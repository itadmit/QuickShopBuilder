// scripts/deploy.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// נתיבים
const buildPath = path.join(__dirname, '../build');
// אם אתה משתמש באותו שרת
const localServerPath = path.join(__dirname, '../../../public_html/builder/static');

async function deploy() {
  try {
    console.log('Starting deployment process...');
    
    // בדיקה שיש גרסת בילד
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build directory does not exist. Run "npm run build" first.');
    }
    
    // אם אתה מריץ על אותו שרת (למשל XAMPP או שרת מקומי אחר)
    if (fs.existsSync(path.dirname(localServerPath))) {
      console.log(`Deploying to local server path: ${localServerPath}`);
      
      // יצירת תיקיית היעד אם לא קיימת
      if (!fs.existsSync(localServerPath)) {
        fs.mkdirSync(localServerPath, { recursive: true });
      }
      
      // העתקת הקבצים
      const { ncp } = require('ncp');
      
      await new Promise((resolve, reject) => {
        ncp(buildPath, localServerPath, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
      
      console.log('Local deployment completed successfully!');
      return;
    }
    
    // אם אתה מעלה לשרת מרוחק
    const serverInfo = {
      host: 'your-server.com',
      username: 'your-username',
      path: '/public_html/builder/static'
    };
    
    console.log(`Deploying to remote server: ${serverInfo.host}${serverInfo.path}`);
    
    // פקודת העלאה באמצעות rsync (לינוקס/מק) או robocopy (חלונות)
    let deployCommand;
    
    if (process.platform === 'win32') {
      // פקודה לחלונות
      deployCommand = `robocopy "${buildPath}" "${localServerPath}" /E /PURGE`;
    } else {
      // פקודה ללינוקס/מק
      deployCommand = `rsync -avz --delete ${buildPath}/ ${serverInfo.username}@${serverInfo.host}:${serverInfo.path}`;
    }
    
    // הפעלת פקודת ההעלאה
    const { stdout, stderr } = await execCommand(deployCommand);
    
    if (stderr && !process.platform === 'win32') {
      // בחלונות, robocopy תמיד מחזיר מידע ל-stderr אבל זה לא בהכרח שגיאה
      console.warn(`Deployment warnings: ${stderr}`);
    }
    
    console.log(`Deployment output: ${stdout}`);
    console.log('Remote deployment completed successfully!');
    
  } catch (error) {
    console.error(`Deployment error: ${error.message}`);
    process.exit(1);
  }
}

// פונקציית עזר להפעלת פקודות בצורה אסינכרונית
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error && process.platform !== 'win32') {
        // בחלונות, robocopy מחזיר קוד יציאה שונה מ-0 גם במקרה של הצלחה
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// נוסיף תלות לncp אם לא קיימת
try {
  require.resolve('ncp');
} catch (e) {
  console.log('Installing ncp package for file copying...');
  exec('npm install --no-save ncp', (error) => {
    if (error) {
      console.error('Failed to install ncp, deployment may fail:', error);
    }
    deploy();
  });
  return;
}

deploy();
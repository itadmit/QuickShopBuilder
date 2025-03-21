// scripts/postbuild.js
const fs = require('fs-extra');
const path = require('path');

// נתיב הבניה
const buildPath = path.join(__dirname, '../build');
// נתיב היעד - מבוסס על מבנה התיקיות של השרת שלך
const targetPath = path.join(__dirname, '../../../public_html/builder/static');

async function postBuild() {
  try {
    console.log('Starting post-build process...');
    
    // בדיקה שתיקיית הבניה קיימת
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build directory does not exist. Run "npm run build" first.');
    }
    
    // יצירת תיקיית היעד אם לא קיימת
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
      console.log(`Created target directory: ${targetPath}`);
    }
    
    // העתקת כל הקבצים מתיקיית הבניה לתיקיית היעד
    await fs.copy(buildPath, targetPath);
    console.log(`Successfully copied build files to ${targetPath}`);
    
    // קריאת המניפסט כדי ליצור קבצים עם שמות קבועים
    const manifestPath = path.join(buildPath, 'asset-manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // יצירת התיקיות אם הן לא קיימות
      fs.mkdirSync(path.join(targetPath, 'static/css'), { recursive: true });
      fs.mkdirSync(path.join(targetPath, 'static/js'), { recursive: true });
      
      // העתקת קובץ ה-CSS הראשי עם שם קבוע
      if (manifest.files && manifest.files['main.css']) {
        const mainCssPath = path.join(buildPath, manifest.files['main.css'].replace(/^\//, ''));
        const fixedCssPath = path.join(targetPath, 'static/css/main.css');
        
        if (fs.existsSync(mainCssPath)) {
          fs.copyFileSync(mainCssPath, fixedCssPath);
          console.log(`Created fixed CSS file: ${fixedCssPath}`);
        }
      }
      
      // העתקת קובץ ה-JS הראשי עם שם קבוע
      if (manifest.files && manifest.files['main.js']) {
        const mainJsPath = path.join(buildPath, manifest.files['main.js'].replace(/^\//, ''));
        const fixedJsPath = path.join(targetPath, 'static/js/main.js');
        
        if (fs.existsSync(mainJsPath)) {
          fs.copyFileSync(mainJsPath, fixedJsPath);
          console.log(`Created fixed JS file: ${fixedJsPath}`);
        }
      }
      
      // העתקת קבצי ה-chunks עם שמות קבועים
      if (manifest.entrypoints) {
        manifest.entrypoints.forEach(entrypoint => {
          if (entrypoint.endsWith('.js') && !entrypoint.includes('main.')) {
            const chunkName = path.basename(entrypoint).split('.')[0]; // לקבל את מספר ה-chunk
            const chunkPath = path.join(buildPath, entrypoint.replace(/^\//, ''));
            const fixedChunkPath = path.join(targetPath, `static/js/${chunkName}.chunk.js`);
            
            if (fs.existsSync(chunkPath)) {
              fs.copyFileSync(chunkPath, fixedChunkPath);
              console.log(`Created fixed chunk file: ${fixedChunkPath}`);
            }
          }
        });
      }
    }
    
    // יצירת קובץ .htaccess בתיקיית היעד אם צריך
    const htaccessPath = path.join(targetPath, '.htaccess');
    if (!fs.existsSync(htaccessPath)) {
      const htaccessContent = `
# הגדרת MIME types לקבצי JavaScript ו-CSS
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
  AddType application/json .map
</IfModule>

# הפניית כל הבקשות לקבצים לא קיימים לאינדקס
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /builder/static/
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /builder/static/index.html [L]
</IfModule>
`;
      fs.writeFileSync(htaccessPath, htaccessContent);
      console.log('Created .htaccess file in target directory');
    }
    
    console.log('Post-build process completed successfully.');
  } catch (error) {
    console.error('Error during post-build process:', error);
    process.exit(1);
  }
}

postBuild();
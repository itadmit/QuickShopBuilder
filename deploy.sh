#!/bin/bash
# צבעים להודעות
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
# הגדרת משתנים - שימוש בהגדרות SSH מקובץ ה-config
SSH_HOST="quickshop" # שם החיבור כפי שמוגדר בקובץ ה-SSH config
BUILD_DIR="./build" # הנתיב המקומי שבו נמצא תיקיית הבילד
SERVER_DIR="/var/www/html/builder/static" # יעד בשרת - נתיב מתוקן!
# פונקציה להדפסת הודעות
print_status() {
echo -e "${YELLOW}$1${NC}"
}
print_success() {
echo -e "${GREEN}$1${NC}"
}
print_error() {
echo -e "${RED}$1${NC}"
}
# בניית הפרויקט
print_status "...טקיורפ תיינב ליחתמ"
npm run build
# בדיקה אם הבנייה הצליחה
if [ $? -ne 0 ]; then
print_error "טקיורפה תיינבב האיגש"
exit 1
fi
print_success "החלצהב המייתסה טקיורפה תיינב"
# בדיקה אם תיקיית הבילד קיימת
if [ ! -d "$BUILD_DIR" ]; then
print_error "תמייק אל $BUILD_DIR דליב תייקית :האיגש"
exit 1
fi
# בדיקת קישוריות לשרת
print_status "...$SSH_HOST תרשל תוירושיק קדוב"
if ! ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SSH_HOST exit; then
print_error ".ךלש SSH-ה תורדגה תא קודב .תרשל רבחתהל ןתינ אל"
exit 1
fi
print_success "הניקת תרשל תוירושיק"
# יצירת תיקיות נדרשות בשרת
print_status "...תרשב תמייק דעיה תייקית םא קדוב"
ssh $SSH_HOST "sudo mkdir -p $SERVER_DIR && sudo chown ubuntu:ubuntu $SERVER_DIR"
# העלאת הקבצים לשרת באמצעות rsync
print_status "...$SSH_HOST תרשל םיצבק הלעמ"
rsync -avz --delete $BUILD_DIR/ $SSH_HOST:$SERVER_DIR/
# בדיקה אם ההעלאה הצליחה
if [ $? -ne 0 ]; then
print_error "תרשל םיצבקה תאלעהב האיגש"
exit 1
fi
print_success "תרשל החלצהב ולעוה םיצבקה"
# סקריפט SSH לשינוי שמות הקבצים בשרת ומחיקת קבצים נלווים
print_status "...םיכרצנ יתלב םיצבק תקיחמו תומש הנשמ"
ssh $SSH_HOST << EOF
 # מציאת הקובץ JS הנוכחי וביטוי הנתיב המלא
 JS_FILE=\$(find $SERVER_DIR/static/js -name "main.*.js" | head -n 1)
 if [ -n "\$JS_FILE" ]; then
   JS_DIR=\$(dirname "\$JS_FILE")
   # יצירת קובץ חדש במקום symlink (מעתיק את התוכן)
   cp "\$JS_FILE" "\$JS_DIR/main.js"
   echo "main.js/\$JS_DIR :רצונ שדח JS ץבוק"
 else
   echo "JS ץבוק אצמנ אל"
 fi
 
 # מציאת הקובץ CSS הנוכחי וביטוי הנתיב המלא
 CSS_FILE=\$(find $SERVER_DIR/static/css -name "main.*.css" | head -n 1)
 if [ -n "\$CSS_FILE" ]; then
   CSS_DIR=\$(dirname "\$CSS_FILE")
   # יצירת קובץ חדש במקום symlink (מעתיק את התוכן)
   cp "\$CSS_FILE" "\$CSS_DIR/main.css"
   echo "main.css/\$CSS_DIR :רצונ שדח CSS ץבוק"
 fi
 
 # מציאת קובץ HTML והחלפת הנתיבים
 HTML_FILE=\$(find $SERVER_DIR -name "index.html")
 if [ -n "\$HTML_FILE" ]; then
   # החלפת נתיבי JS ו-CSS בקובץ ה-HTML
   sed -i 's/static\/js\/main\.[a-z0-9]*\.js/static\/js\/main.js/g' "\$HTML_FILE"
   sed -i 's/static\/css\/main\.[a-z0-9]*\.css/static\/css\/main.css/g' "\$HTML_FILE"
   echo "HTML ץבוקב ונכדוע םיביתנ"
 else
   echo "HTML ץבוק אצמנ אל"
 fi
 
 # מחיקת קבצים נלווים שאינם נחוצים
 echo "...םיכרצנ יתלב םיצבק קחומ"
 
 # מחיקת קבצי map
 find $SERVER_DIR/static/js -name "*.map" -type f -delete
 find $SERVER_DIR/static/css -name "*.map" -type f -delete
 echo "map יצבק וקחמנ"
 
 # מחיקת קבצי chunk 
 find $SERVER_DIR/static/js -name "*chunk.js" -type f -delete
 echo "chunk יצבק וקחמנ"
 
 # מחיקת קבצי LICENSE
 find $SERVER_DIR/static/js -name "*.LICENSE.txt" -type f -delete
 echo "LICENSE יצבק וקחמנ"
 
 # מחיקת קבצי JS המקוריים עם ההאש (השארת רק main.js)
 find $SERVER_DIR/static/js -name "main.*.js" -type f -delete
 echo "םיירוקמה JS יצבק וקחמנ"
 
 # מחיקת קבצי CSS המקוריים עם ההאש (השארת רק main.css)
 find $SERVER_DIR/static/css -name "main.*.css" -type f -delete
 echo "םיירוקמה CSS יצבק וקחמנ"
 
 # הצגת הקבצים שנשארו אחרי הניקוי
 echo "יוקינה ירחא וראשנש םיצבקה תמישר"
 find $SERVER_DIR/static/js -type f | sort
 find $SERVER_DIR/static/css -type f | sort
EOF

print_success "====================================================="
print_success "ןשקדורפה תרשל הלע רתאה !החלצהב םייתסה ךילהתה לכ"
print_success "וקחמנ םיכרצנ יתלבה םיצבקה לכ"
print_success "====================================================="
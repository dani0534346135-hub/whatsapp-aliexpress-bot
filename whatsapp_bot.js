const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let latestQr = null;

// דף הבית שיציג את הברקוד בצורה נקייה ויפה לסריקה מהנייד
app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`
            <div style="text-align: center; font-family: Arial, sans-serif; padding-top: 50px; background-color: #f0f2f5; height: 100vh; margin: 0;">
                <div style="background: white; display: inline-block; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #128c7e;">🤖 סרוק את הברקוד כדי לחבר את הבוט:</h2>
                    <p style="color: #666;">פתח וואטסאפ בטלפון -> מכשירים מקושרים -> קשר מכשיר</p>
                    <div style="margin: 20px 0;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" alt="WhatsApp QR Code" style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;" />
                    </div>
                    <p style="font-weight: bold; color: #333;">לאחר הסריקה, הבוט יתחבר ויתחיל לעבוד ברקע של השרת!</p>
                </div>
            </div>
        `);
    } else {
        res.send(`
            <div style="text-align: center; font-family: Arial, sans-serif; padding-top: 100px;">
                <h2 style="color: #4abc96;">🤖 הבוט מחובר ועובד בהצלחה!</h2>
                <p>הוא מאזין כעת בקבוצות וממתין להודעות שמתחילות במילה "בוט".</p>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`🌐 שרת האינטרנט הפנימי רץ על פורט ${PORT}`);
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ],
        handleSIGINT: false
    }
});

// עדכון הברקוד ושמירתו עבור השרת
client.on('qr', (qr) => {
    latestQr = qr; 
    console.log('=== קוד ה-QR עודכן! כנס לאתר שלך כדי לסרוק אותו ===');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    latestQr = null; // מוחק את הברקוד ברגע שהתחברנו בהצלחה
    console.log('=============================================');
    console.log('🤖 הבוט של הרב דניאל מחובר וממתין להודעות! 🤖');
    console.log('=============================================');
});

// פונקציה מרכזית לטיפול בהודעות
async function handleMessage(msg) {
    const text = msg.body ? msg.body.trim() : "";

    if (text.startsWith('בוט ')) {
        const keyword = text.replace('בוט ', '').trim();
        if (!keyword) return;

        console.log(`[הודעה זוהתה] מחפש דילים עבור: "${keyword}"`);

        // 1. הודעת ביניים מהירה
        await msg.reply(`🔍 מחפש עבורך את הדילים השווים ביותר עבור *${keyword}*... רק רגע!`);

        // 2. הפעלת מנוע הפייתון
        exec(`python3 bot_brain.py "${keyword}"`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[שגיאת הרצה בפייתון]:`, error);
                return;
            }
            
            // 3. שליחת התוצאה הסופית
            if (stdout && stdout.trim()) {
                msg.reply(stdout.trim());
                console.log(`[הצלחה] התשובה הסופית נשלחה חזרה לוואטסאפ!`);
            } else {
                console.log(`[אזהרה] פייתון החזיר תשובה ריקה.`);
            }
        });
    }
}

client.on('message', handleMessage);
client.on('message_create', handleMessage);

client.initialize();
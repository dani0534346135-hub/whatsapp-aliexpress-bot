const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express'); // הוספת שרת אינטרנט לשמירה על השרת ער

const app = express();
const PORT = process.env.PORT || 3000;

// דף בית פשוט - השרת החיצוני יקרא לדף הזה כדי לשמור על הבוט ער
app.get('/', (req, res) => {
    res.send('🤖 הבוט של הרב דניאל חי, קיים ובועט 24/7!');
});

app.listen(PORT, () => {
    console.log(`🌐 שרת האינטרנט הפנימי רץ על פורט ${PORT}`);
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // התאמת הגדרות Puppeteer לעבודה חלקה על שרתי לינוקס בענן
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

client.on('qr', (qr) => {
    console.log('=== סרוק את קוד ה-QR הבא כדי להתחבר ===');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('=============================================');
    console.log('🤖 הבוט של הרב דניאל מחובר וממתין להודעות! 🤖');
    console.log('=============================================');
});

async function handleMessage(msg) {
    const text = msg.body ? msg.body.trim() : "";

    if (text.startsWith('בוט ')) {
        const keyword = text.replace('בוט ', '').trim();
        if (!keyword) return;

        console.log(`[הודעה זוהתה] מחפש דילים עבור: "${keyword}"`);

        await msg.reply(`🔍 מחפש עבורך את הדילים השווים ביותר עבור *${keyword}*... רק רגע!`);

        exec(`python bot_brain.py "${keyword}"`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[שגיאת הרצה בפייתון]:`, error);
                return;
            }
            
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
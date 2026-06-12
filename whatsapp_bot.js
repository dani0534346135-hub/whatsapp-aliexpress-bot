const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = null;

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`
            <div style="text-align: center; font-family: sans-serif; padding-top: 50px;">
                <h2>🤖 הבוט של הרב דניאל - סרוק כדי לחבר:</h2>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />
            </div>
        `);
    } else {
        res.send('<h2>🤖 הבוט מחובר וממתין להודעות...</h2>');
    }
});

app.listen(PORT, () => console.log(`🌐 שרת רץ על פורט ${PORT}`));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    if (latestQr === qr) return; // מונע עדכון מיותר
    latestQr = qr; 
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    latestQr = null;
    console.log('🤖 הבוט מחובר וממתין להודעות!');
});

async function handleMessage(msg) {
    const text = msg.body ? msg.body.trim() : "";
    if (text.startsWith('בוט ')) {
        const keyword = text.replace('בוט ', '').trim();
        if (!keyword) return;

        console.log(`[הודעה] מחפש: "${keyword}"`);
        await msg.reply(`🔍 מחפש דילים עבור: *${keyword}*...`);

        // הרצה עם timeout כדי למנוע תקיעות
        exec(`python3 bot_brain.py "${keyword}"`, { timeout: 20000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`שגיאה: ${error.message}`);
                msg.reply("❌ קרתה תקלה בחיפוש הדיל, נסה שוב.");
                return;
            }
            if (stdout && stdout.trim()) {
                msg.reply(stdout.trim());
            }
        });
    }
}

client.on('message', handleMessage);
client.initialize();
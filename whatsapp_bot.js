const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// שרת אינטרנט להצגת ה-QR
let latestQr = null;
app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`<div style="text-align:center; padding:50px;"><h2>סרוק את הבוט:</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" /></div>`);
    } else {
        res.send('<h2>הבוט מחובר!</h2>');
    }
});
app.listen(PORT, () => console.log(`🌐 שרת פעיל בפורט ${PORT}`));

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }), // שמירת החיבור לקובץ
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    latestQr = qr;
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    latestQr = null;
    console.log('✅ הבוט מחובר ומוכן!');
});

// מנוע התגובות להודעות
client.on('message', async msg => {
    console.log(`💬 הודעה התקבלה: ${msg.body}`); // זה יופיע לך בלוגים של Render
    
    if (msg.body.startsWith('בוט ')) {
        const keyword = msg.body.replace('בוט ', '').trim();
        await msg.reply(`🔍 מחפש עבורך: *${keyword}*...`);

        exec(`python3 bot_brain.py "${keyword}"`, (error, stdout, stderr) => {
            if (error) {
                msg.reply("❌ קרתה תקלה בחיפוש, נסה שוב.");
                return;
            }
            msg.reply(stdout || "לא נמצאו תוצאות.");
        });
    }
});

client.initialize();
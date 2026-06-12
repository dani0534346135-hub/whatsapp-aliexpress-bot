const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = ""; // כאן נשמור את הברקוד

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`
            <h1>בוט של הרב דניאל</h1>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />
            <p>סרוק אותי!</p>
        `);
    } else {
        res.send('<h1>הבוט מנסה להתחבר... חכה כמה שניות ורענן את הדף</h1>');
    }
});

app.listen(PORT, () => console.log(`פורט ${PORT}`));

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    latestQr = qr; // מעדכן את המשתנה עם הברקוד החדש
    console.log('QR קיבלנו! הנה הוא באתר');
});

client.on('ready', () => {
    latestQr = ""; // מוחק את הברקוד כשהוא מחובר
    console.log('✅ מחובר!');
});

client.initialize();
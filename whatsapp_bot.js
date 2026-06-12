const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// משתנה גלובלי לברקוד
let latestQr = "";

app.get('/', (req, res) => {
    if (latestQr) {
        // מציג את הברקוד בדפדפן
        res.send(`<h1>סרוק את הבוט:</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />`);
    } else {
        res.send('<h1>הבוט מנסה להתחבר... רענן את הדף בעוד 10 שניות.</h1>');
    }
});
app.listen(PORT);

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    latestQr = qr; // שומר את הברקוד
    console.log('QR קיבלנו! הנה הוא באתר');
});

client.on('ready', () => {
    latestQr = "";
    console.log('✅ הבוט מחובר!');
});

client.initialize();
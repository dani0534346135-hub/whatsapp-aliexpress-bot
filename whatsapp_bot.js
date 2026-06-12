const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = "";

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`<h1>בוט בטעינה...</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />`);
    } else {
        res.send('<h1>הבוט פועל!</h1>');
    }
});
app.listen(PORT);

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // קריטי לחיסכון בזיכרון
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    latestQr = qr;
    console.log('QR מוכן לסריקה באתר');
});

client.on('ready', () => {
    latestQr = "";
    console.log('✅ הבוט מחובר!');
});

// הגנה מפני קריסת זיכרון
process.on('uncaughtException', (err) => {
    console.error('שגיאה קריטית, מאתחל...', err);
    process.exit(1); 
});

client.initialize();
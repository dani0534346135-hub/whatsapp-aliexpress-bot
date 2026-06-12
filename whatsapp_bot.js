const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = "";

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`<h1>סרוק את הבוט</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />`);
    } else {
        res.send('<h1>הבוט מחובר וממתין!</h1>');
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
            '--disable-gpu',
            '--single-process', // חוסך המון זיכרון
            '--no-zygote'
        ]
    }
});

client.on('qr', (qr) => {
    latestQr = qr;
});

client.on('ready', () => {
    latestQr = "";
    console.log('✅ הבוט מחובר!');
});

// ניקוי זיכרון למקרה של תקלה
client.on('disconnected', () => {
    console.log('הבוט התנתק, מאתחל...');
    process.exit(1);
});

client.initialize();
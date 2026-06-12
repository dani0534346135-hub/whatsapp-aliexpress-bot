const { Client, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = "";

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`<h1>סרוק את הברקוד הבא:</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />`);
    } else {
        res.send('<h1>הבוט מחובר למסד הנתונים וממתין להוראות</h1>');
    }
});

app.listen(PORT);

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ מחובר למסד נתונים');
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        authStrategy: new LocalAuth({
            store: store,
            clientId: 'dani-bot' // שינינו מזהה כדי להכריח יצירה חדשה
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        }
    });

    client.on('qr', (qr) => {
        latestQr = qr;
        console.log('QR מוכן! ניתן לסרוק באתר.');
    });

    client.on('ready', () => {
        latestQr = "";
        console.log('✅ הבוט מחובר לוואטסאפ!');
    });

    client.on('disconnected', (reason) => {
        console.log('הבוט התנתק, ינסה להפעיל מחדש:', reason);
        client.initialize();
    });

    client.initialize();
}).catch(err => console.error('שגיאה:', err));

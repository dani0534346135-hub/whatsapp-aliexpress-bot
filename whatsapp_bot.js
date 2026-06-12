const { Client, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = "";
let isInitializing = false; // מנגנון למניעת לופ ברקודים

app.get('/', (req, res) => {
    if (latestQr) {
        res.send(`<h1>סרוק את הברקוד:</h1><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}" />`);
    } else {
        res.send('<h1>הבוט מחובר וממתין להוראות</h1>');
    }
});

app.listen(PORT, '0.0.0.0');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✅ מחובר למסד הנתונים');
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        authStrategy: new LocalAuth({
            store: store,
            clientId: 'dani-bot'
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        }
    });

    client.on('qr', (qr) => {
        if (!isInitializing) {
            latestQr = qr;
            console.log('QR מוכן! ניתן לסרוק באתר.');
            isInitializing = true;
        }
    });

    client.on('ready', () => {
        latestQr = "";
        isInitializing = false;
        console.log('✅ הבוט מחובר לוואטסאפ ושומר Session!');
    });

    client.on('disconnected', (reason) => {
        console.log('הבוט התנתק, מאפס תהליך...');
        isInitializing = false;
        client.initialize();
    });

    client.initialize();
}).catch(err => console.error('שגיאה בחיבור:', err));

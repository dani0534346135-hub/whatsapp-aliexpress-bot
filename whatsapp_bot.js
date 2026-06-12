const { Client, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('הבוט רץ ומחובר למסד הנתונים!'));
app.listen(PORT);

const MONGODB_URI = process.env.MONGODB_URI;

// חיבור למסד הנתונים ושמירת ה-Session
mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ מחובר למסד נתונים');
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        authStrategy: new LocalAuth({
            store: store,
            clientId: 'client-one'
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
        }
    });

    client.on('qr', (qr) => console.log('QR מוכן לסריקה!'));
    client.on('ready', () => console.log('✅ הבוט מחובר ושומר Session!'));
    client.initialize();
}).catch(err => console.error('שגיאה בחיבור למסד הנתונים:', err));

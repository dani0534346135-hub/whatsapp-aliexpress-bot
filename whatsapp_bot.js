const { Client, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✅ מחובר למסד נתונים');
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        authStrategy: new LocalAuth({
            store: store,
            clientId: 'dani-bot-v1' // שינינו שם כדי להתחיל "דף חדש"
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => console.log('QR RECEIVED:', qr));
    
    // זה החלק הקריטי: מוודא שה-Session נשמר
    client.on('authenticated', (session) => {
        console.log('✅ אימות הצליח, שומר ב-MongoDB...');
    });

    client.on('ready', () => {
        console.log('✅ הבוט מוכן ומחובר בוואטסאפ!');
    });

    client.initialize();
}).catch(err => console.error('שגיאה בחיבור:', err));

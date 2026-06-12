const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('הבוט פעיל'));
app.listen(PORT);

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }), // מזהה קבוע
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

client.on('qr', (qr) => {
    console.log('סרוק את הקוד הבא:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('✅ הבוט מוכן!'));

client.on('message', async msg => {
    if (msg.body.startsWith('בוט ')) {
        const keyword = msg.body.replace('בוט ', '').trim();
        exec(`python3 bot_brain.py "${keyword}"`, (error, stdout) => {
            if (stdout) msg.reply(stdout);
        });
    }
});

client.initialize();
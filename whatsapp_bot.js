const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;

app.post('/webhook', async (req, res) => {
    const data = req.body;
    
    // בדיקה אם זו הודעת טקסט נכנסת (מפרטי או מקבוצה)
    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.typeMessage === 'textMessage') {
        const chatId = data.senderData.chatId;
        const message = data.messageData.textMessageData.textMessage;
        const senderName = data.senderData.senderName;
        
        console.log(`הודעה התקבלה מ-${senderName} ב-${chatId}: ${message}`);
        
        // כאן אתה מגדיר את הלוגיקה שלך
        // למשל, תגובה לכל הודעה שמכילה מילה מסוימת
        if (message.includes("מבצע")) {
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: chatId,
                message: "שלום! מצאתי מבצע חם באליאקספרס בשבילך."
            });
        }
    }
    
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`הבוט רץ ומאזין בפורט ${PORT}`));

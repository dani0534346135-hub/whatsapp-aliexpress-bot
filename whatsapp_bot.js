const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;

app.post('/webhook', async (req, res) => {
    const data = req.body;
    
    // לוג לראות בדיוק מה מגיע לשרת (יופיע ב-Logs של Render)
    console.log("התקבלה הודעה מ-Green API:", JSON.stringify(data, null, 2));

    // בדיקה: האם זו הודעת טקסט (נכנסת או יוצאת)
    if (data.messageData && data.messageData.textMessageData) {
        const chatId = data.senderData.chatId;
        const message = data.messageData.textMessageData.textMessage;
        
        console.log(`זיהיתי הודעה מ-${chatId}: ${message}`);
        
        // לוגיקה לתגובה אוטומטית (רק אם זו הודעה נכנסת)
        if (data.typeWebhook === 'incomingMessageReceived' && message.includes("מבצע")) {
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: chatId,
                message: "קיבלתי! אני בודק את המבצע באליאקספרס..."
            });
        }
    }
    
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`הבוט מאזין בפורט ${PORT}`));

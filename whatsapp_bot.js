const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;

app.post('/webhook', async (req, res) => {
    const data = req.body;
    
    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.typeMessage === 'textMessage') {
        const sender = data.senderData.sender;
        
        console.log("הודעה חדשה התקבלה");
        
        // הגדרה בטוחה של התשובה
        const answer = "קיבלתי את ההודעה שלך, תודה.";
        
        try {
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: sender,
                message: answer
            });
        } catch (error) {
            console.error("שגיאה בשליחה");
        }
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`הבוט רץ בפורט ${PORT}`));

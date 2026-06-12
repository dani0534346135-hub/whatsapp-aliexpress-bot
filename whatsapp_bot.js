const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// קריאת נתונים ממשתני הסביבה (שהגדרת ב-Render)
const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;

// נתיב ה-Webhook שדרכו תקבל הודעות מ-Green API
app.post('/webhook', async (req, res) => {
    const data = req.body;
    
    // בדיקה: האם זו הודעת טקסט נכנסת?
    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.typeMessage === 'textMessage') {
        const sender = data.senderData.sender;
        const message = data.messageData.textMessageData.textMessage;
        
        console.log(`הודעה חדשה מ-${sender}: ${message}`);
        
        // כאן אתה מגדיר מה הבוט עונה
        const answer = "שלום! קיבלתי את ההודעה שלך, הרב דניאל כרייף שליט"א יטפל בזה בהקדם.";
        
        try {
            // שליחת תשובה חזרה דרך ה-API של Green API
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: sender,
                message: answer
            });
            console.log("התשובה נשלחה בהצלחה");
        } catch (error) {
            console.error("שגיאה בשליחת ההודעה:", error);
        }
    }
    
    // אישור קבלת ההודעה (חשוב מאוד ל-Webhook)
    res.sendStatus(200);
});

// הגדרת פורט והאזנה
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`הבוט מאזין בפורט ${PORT}`));

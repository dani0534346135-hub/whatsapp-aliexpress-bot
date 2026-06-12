const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;

// קישור השותף הבסיסי שלך מ-Admitad
const BASE_AFFILIATE_LINK = "https://rzerl.com/g/1e8d114494f4b1eb315016525dc3e8/?ulp=";

app.post('/webhook', async (req, res) => {
    const data = req.body;

    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.textMessageData) {
        const chatId = data.senderData.chatId;
        const message = data.messageData.textMessageData.textMessage;
        const lowerMessage = message.toLowerCase();

        let response = "";

        // 1. טיפול בברכות ושירותים
        if (lowerMessage.includes("היי") || lowerMessage.includes("שלום")) {
            response = "שלום וברכה! אני העוזר האישי של הרב דניאל כרייף.\n" +
                       "אני מציע: פיתוח אתרים, אפליקציות, כתיבת תסריטים, שיווק ועריכת שיעורי תורה.\n" +
                       "בשביל לחפש מוצר באליאקספרס, כתוב 'בוט' ואת שם המוצר.";
        } 
        // 2. טיפול בחיפוש באליאקספרס
        else if (lowerMessage.startsWith("בוט")) {
            const query = message.replace(/בוט/i, "").trim();
            if (query) {
                // יצירת לינק חיפוש באליאקספרס
                const searchUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`;
                // שילוב עם קישור השותף
                const finalLink = BASE_AFFILIATE_LINK + encodeURIComponent(searchUrl);
                
                response = `הנה הדילים הכי טובים שמצאתי עבור "${query}":\n${finalLink}`;
            } else {
                response = "איזה מוצר לחפש? פשוט כתוב 'בוט' ואחריו את שם המוצר.";
            }
        }

        if (response) {
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: chatId,
                message: response
            });
        }
    }

    res.sendStatus(200);
});

app.listen(process.env.PORT || 10000);

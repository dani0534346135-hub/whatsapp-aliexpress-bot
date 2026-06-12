const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;
const BASE_AFFILIATE_LINK = "https://rzerl.com/g/1e8d114494f4b1eb315016525dc3e8/?ulp=";

app.post('/webhook', async (req, res) => {
    const data = req.body;
    // בדיקה שזו הודעת טקסט
    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.textMessageData) {
        const chatId = data.senderData.chatId;
        const message = data.messageData.textMessageData.textMessage.toLowerCase();
        
        if (message.includes("שלום") || message.includes("היי")) {
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: chatId,
                message: "שלום וברכה! אני העוזר האישי של הרב דניאל. אנו מציעים: פיתוח אתרים, שיווק, ועריכת שיעורי תורה. לחיפוש מוצר כתוב 'בוט' ואת שם המוצר."
            });
        } else if (message.startsWith("בוט")) {
            const query = message.replace("בוט", "").trim();
            const searchUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`;
            const finalLink = BASE_AFFILIATE_LINK + encodeURIComponent(searchUrl);
            await axios.post(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
                chatId: chatId,
                message: `מצאתי את הדילים עבור "${query}"! הנה הקישור שלך:\n${finalLink}`
            });
        }
    }
    res.sendStatus(200);
});

app.listen(process.env.PORT || 10000);

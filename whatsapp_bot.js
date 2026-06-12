const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const idInstance = process.env.ID_INSTANCE;
const apiTokenInstance = process.env.API_TOKEN_INSTANCE;
// הקישור המעודכן שלך מ-Admitad
const BASE_AFFILIATE_LINK = "https://rzerl.com/g/1e8d114494f4b1eb315016525dc3e8/?ulp=";

app.post('/webhook', async (req, res) => {
    const data = req.body;

    // בודקים אם זו הודעת טקסט נכנסת
    if (data.typeWebhook === 'incomingMessageReceived' && data.messageData.textMessageData) {
        const chatId = data.senderData.chatId;
        const message = data.messageData.textMessageData.textMessage.toLowerCase();
        
        let response = "";

        // מקרה 1: ברכה ושירותים
        if (message.includes("שלום") || message.includes("היי")) {
            response = "שלום וברכה! הגעת לעוזר האישי של הרב דניאל כרייף שליט"א.\n\n" +
                       "אני כאן כדי לעזור עם השירותים שלנו:\n" +
                       "💻 פיתוח אתרים ואפליקציות\n" +
                       "📝 יצירת תסריטים ושיווק\n" +
                       "🎙️ עריכת שיעורי תורה לרבנים\n\n" +
                       "אנא השאר הודעה ונחזור אליך בהקדם.\n\n" +
                       "לחיפוש מוצר באליאקספרס, פשוט כתוב 'בוט' ואחריו את שם המוצר.";
        } 
        // מקרה 2: חיפוש מוצר ושילוב קישור שותף
        else if (message.startsWith("בוט")) {
            const query = message.replace("בוט", "").trim();
            if (query) {
                const searchUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`;
                response = `המערכת מחפשת עבורך את הדילים ל-"${query}":\n${BASE_AFFILIATE_LINK}${encodeURIComponent(searchUrl)}`;
            }
        }

        // אם יש תשובה, שלח אותה
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

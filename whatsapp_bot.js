const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log("קיבלתי הודעה מה-Webhook!");
    console.log(JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

app.listen(10000, () => console.log("הבוט רץ ומקשיב..."));

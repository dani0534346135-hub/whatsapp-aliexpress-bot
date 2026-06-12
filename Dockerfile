# השתמש בגרסה רזה של Node.js
FROM node:20-slim

# התקנת כל התלויות הנדרשות עבור דפדפן Chrome בתוך לינוקס
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.com.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# יצירת תיקיית עבודה
WORKDIR /app

# העתקת קבצי ה-JSON להתקנת ספריות (קודם להעתיק אותם כדי לחסוך זמן ב-Build)
COPY package*.json ./
RUN npm install

# העתקת כל שאר הקבצים
COPY . .

# הגדרת משתנה סביבה שמונע מ-Puppeteer להוריד כרום בעצמו (משתמשים בזה שהתקנו ב-APT)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# חשיפת הפורט
EXPOSE 10000

# פקודת ההרצה
CMD ["node", "whatsapp_bot.js"]
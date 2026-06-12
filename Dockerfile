FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# מעתיקים קודם את קבצי ההגדרות כדי להתקין את הספריות
COPY package*.json ./
RUN npm install

# מעתיקים את כל שאר הקוד
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["node", "whatsapp_bot.js"]

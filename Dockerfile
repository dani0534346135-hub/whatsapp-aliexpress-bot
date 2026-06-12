FROM node:20-slim

# התקנת chromium במקום כרום מלא
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# הגדרות שמונעות הורדת כרום נוסף ושומרות על יציבות
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 10000
CMD ["node", "whatsapp_bot.js"]
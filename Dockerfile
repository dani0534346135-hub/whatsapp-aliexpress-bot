FROM ghcr.io/puppeteer/puppeteer:22.10.0

USER root

# התקנת פייתון וכלים נחוצים
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean

WORKDIR /app

# העתקת קבצי ההגדרות
COPY package*.json ./
COPY requirements.txt ./

# התקנת הספריות של נוד ופייתון
RUN npm install
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# העתקת שאר קבצי הקוד
COPY . .

EXPOSE 3000

CMD ["node", "whatsapp_bot.js"]
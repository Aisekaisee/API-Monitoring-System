FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --prodcution

COPY . .

RUN mkdir -p logs

EXPOSE 5000

CMD ["node","src/server.js"]
FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
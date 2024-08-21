FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install @prisma/client && npm install prisma --save-dev && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
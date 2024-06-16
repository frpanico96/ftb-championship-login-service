FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]

EXPOSE 3000
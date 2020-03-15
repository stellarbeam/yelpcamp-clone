FROM node:13.5.0

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm i -g nodemon


EXPOSE 3000

CMD ["npm", "start"]

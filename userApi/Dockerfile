FROM node:alpine

#VOLUME /home/node/app

WORKDIR /home/node/app

COPY package.json package.json

RUN npm install 

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]
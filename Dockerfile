FROM node:15.10.0-alpine3.10

WORKDIR /usr/src/app/

COPY package*.json package-lock.json ./
RUN npm ci --silent
RUN npm install --silent

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]

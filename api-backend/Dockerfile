FROM node

RUN mkdir -p /usr/src/intelliq-api

WORKDIR /usr/src/intelliq-api

COPY . .

RUN npm install pm2 -g
RUN npm install express mariadb multer

EXPOSE 9102
CMD [ "pm2", "start", "app.js", "--name", "intelliQ-API" ]
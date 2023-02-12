FROM node

RUN mkdir -p /usr/src/intelliq-api

WORKDIR /usr/src/intelliq-api

COPY . .

# Use special app configuration for Docker container
RUN mv -f config-docker.js config.js

# Install dependencies
RUN npm install express mariadb multer json2csv cors

# Generate self-signed SSL certificate
RUN mkdir ssl

RUN openssl genrsa -out ssl/key.pem
RUN openssl req -new -batch -key ssl/key.pem -out ssl/csr.pem
RUN openssl x509 -req -days 9999 -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem

EXPOSE 9103

CMD [ "node", "app.js" ]
# intelliQ 📃
Semester project repository for the 2022-2023 Software Engineering course.

School of Electrical and Computer Engineering  
National Technical University of Athens

## Build Instructions

### API Backend Application
1. Download and install [Node.js](https://nodejs.org/).
2. Install PM2 through NPM:
	```shell
	$ npm install pm2 -g
	```
3. Install required modules:
	```shell
	$ cd api-backend
	$ npm install express mariadb multer https
	```
4. Open [config.js](api-backend/config.js) and configure the application.
	- For HTTPS an SSL certificate is required. You may find instructions on how to create one yourself [below](#creating-a-self-signed-ssl-certificate).
5. Start as a daemon:
	```shell
	$ pm2 start app.js --name intelliQ-API
	```

#### Creating a self-signed SSL certificate

```shell
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
```

## Project Team
| Full Name           | Registration Number  |
| ------------------- | -------------------- |
| Ioannis Basdekis    | 03119198             |
| Ioannis Dressos     | 03119608             |
| Kriton Iordanidis   | 03119604             |
| Pantelis Emmanouil  | 03119018             |
| Panagiotis Tsakonas | 03119610             |

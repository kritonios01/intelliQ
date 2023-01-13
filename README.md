# intelliQ 📃
Semester project repository for the 2022-2023 Software Engineering course.

School of Electrical and Computer Engineering  
National Technical University of Athens

## Build Instructions

### API Backend Application
1. Download and install [Node.js](https://nodejs.org/).
2. Install PM2 through NPM:
	```shell
	$ sudo npm install pm2
	```
3. Install required modules:
	```shell
	$ cd api-backend
	$ npm install express mariadb
	```
4. Start as a daemon:
	```shell
	$ pm2 start app.js
	```

## Project Team
| Full Name           | Registration Number  |
| ------------------- | -------------------- |
| Ioannis Basdekis    | 03119198             |
| Ioannis Dressos     | 03119608             |
| Kriton Iordanidis   | 03119604             |
| Pantelis Emmanouil  | 03119018             |
| Panagiotis Tsakonas | 03119610             |

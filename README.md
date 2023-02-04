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
	- In order to use the HTTPS server, an SSL certificate is required. You may find instructions on how to create one yourself [below](#creating-a-self-signed-ssl-certificate).
5. Start as a daemon:
	```shell
	$ pm2 start app.js --name intelliQ-API
	```

#### Creating a self-signed SSL certificate

```shell
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```


### CLI (Command Line Interface)
1. Make sure you have python 3 installed (it can be downloaded from the [official website](https://www.python.org/) or you can use your favourite package manager)
2. *Create a virtual environment in a directory of your choosing to install dependencies and activate it in your terminal:
	```shell
	$ python3 -m venv <virtenvname>
	$ source <virtenvname>/bin/activate
	```
3. Go to the [cli-tool](/cli/cli-tool/) directory and run:
	```shell
	$ pip install -e
	```
4. Next time you want to use the CLI commands just activate the virtual environment using:
	```shell
	$ source <virtenvname>/bin/activate
	```

\*Note: if you skip this step dependencies will be installed globally


## Project Team
| Full Name           | Registration Number  |
| ------------------- | -------------------- |
| Ioannis Basdekis    | 03119198             |
| Ioannis Dressos     | 03119608             |
| Kriton Iordanidis   | 03119604             |
| Pantelis Emmanouil  | 03119018             |
| Panagiotis Tsakonas | 03119610             |

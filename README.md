# intelliQ 📃
Semester project repository for the 2022-2023 Software Engineering course.

School of Electrical and Computer Engineering  
National Technical University of Athens

## Build Instructions
If you have **Docker** installed, simply clone and run `docker compose up`.  
Otherwise you may find manual instructions for each component below.

### API Backend Application
1. Download and install [Node.js](https://nodejs.org/).
2. Install PM2 through NPM:
	```shell
	$ npm install pm2 -g
	```
3. Install required modules:
	```shell
	$ cd api-backend
	$ npm install express mariadb multer https json2csv cors swagger-ui-express
	```
4. Open [config.js](api-backend/config.js) and configure the application.
	- In order to use the HTTPS server, an SSL certificate is required. You may find instructions on how to create one yourself [below](#creating-a-self-signed-ssl-certificate).
5. Start as a daemon:
	```shell
	$ pm2 start app.js --name intelliQ-API
	```

### Command Line Interface
#### UNIX systems
Prerequisites: [python3](https://www.python.org/), python3-venv

1. Create a virtual environment in the directory of your choosing and activate it in your shell:
	```shell
	$ python3 -m venv <venv_name>
	$ source <venv_name>/bin/activate
	```
2. Change to the [cli](/cli) directory and install dependencies:
	```shell
	$ cd cli
	$ pip install -e .
	```
3. Every time you wish to use the CLI, just activate the virtual environment you created:
	```shell
	$ source <venv_name>/bin/activate
	```

You may choose not to use a virtual environment, however dependencies will be installed globally that way.

The CLI tools are accessible through the `se2226` alias in the virtual environment.

### Database
This implementation of the intelliQ specification is compatible with MariaDB.
The installation and configuration process for MariaDB differs depending on the operating system.  
Please refer to the [official documentation](https://mariadb.com/kb/en/getting-installing-and-upgrading-mariadb/) for instructions.

Make sure to initialise the database using [schema.sql](scripts/mariadb/schema.sql):
```shell
$ mysql -u <user> [-p] < scripts/mariadb/schema.sql
```

## Creating a self-signed SSL certificate

```shell
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

## Testing
For the API application, a Postman collection version 2.1 file is included in the test directory.
For the CLI application a shell script is included.

## Project Team
| Full Name           | Registration Number  |
| ------------------- | -------------------- |
| Ioannis Basdekis    | 03119198             |
| Ioannis Dressos     | 03119608             |
| Kriton Iordanidis   | 03119604             |
| Pantelis Emmanouil  | 03119018             |
| Panagiotis Tsakonas | 03119610             |
# Shoe catalogue API 
 An API used to create an online catalogue that allows people to check the stock

[![Build Status](https://travis-ci.org/nodwengu/shoes_api.svg?branch=master)](https://travis-ci.org/nodwengu/shoes_api)
## Getting Started

For development, you will only need Node.js and a node global package, npm, installed in your environement.

## Prerequisites
Things you need to install the software and how to install them?
- NodeJS
- PostgreSQL
- Package.json dependencies
- Mocha

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! After running the following command, just open again the command line.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/nodwengu/shoes_api.git
    $ cd shoes_api
    $ npm install

### Install PostgreSQL

You can install PostgreSQL on Ubuntu using these commands:

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### Database setup

Once you have all the above installed you need to setup the database.

Create a database called `database_name` and username - `username` with a password of `password`. Enter the password when prompted after executing the `createuser` command. 

```
sudo -u postgres createdb database_name;
sudo -u postgres createuser username -P;
```

Now run *psql* as the *postgres* user:

```
sudo -u postgres psql;
```

Grant the `username` user access to the `database_name` database by running this command: 

```
grant all privileges on database database_name to username;
```

Type in `\q` to exit *psql* as the *postgres* user.

Connect to your database using: `psql -d database_name`

Execute these SQL commands to create the `shoes` and `basket` table in your database. 

You can copy and paste the script below into psql or your can run the database script inside psql using `\i database.sql`

```sql

CREATE TABLE shoes(
    shoe_id SERIAL NOT NULL  PRIMARY KEY,
    color TEXT NOT NULL,
    brand TEXT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL
);

CREATE TABLE basket(
    id SERIAL NOT NULL  PRIMARY KEY,
    color TEXT NOT NULL,
    brand TEXT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    shoe_id INT NOT NULL,
    foreign key (shoe_id) references shoes(shoe_id)
);
```

### Package.json dependencies
```sh

"dependencies": {
    "axios": "^0.19.0",
    "bcrypt": "^3.0.6",
    "body-parser": "^1.19.0",
    "cookie-parser": "^1.4.4",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-flash": "0.0.2",
    "express-handlebars": "^3.1.0",
    "express-session": "^1.16.2",
    "mocha": "^6.2.1",
    "pg": "^7.12.1"
  },
  "devDependencies": {
    "eslint": "^6.6.0",
    "eslint-plugin-standard": "^4.0.1",
    "mocha": "^6.2.0"
  }
```
To install all dependencies required for the app to run, on the terminal navigate to the shoes_api folder, and type npm install .

### Mocha Setup


## Running the app locally
The app is deployed at Heroku and gitHub.

### Prerequisites
The best practices in this article assume that you have:

- Node.js and npm installed.
- an existing Node.js app.
- a free Heroku account.
- the Heroku CLI.

Then start your app locally using heroku local command which is installed as a part of the Heroku CLI.

$ heroku local web Your app should now be running on http://localhost:5001/.

The shoes api App is deployed on Heroku

##### To open the app locally;
- first you need to navigate to your shoes_api directory on the terminal.
- run the server using $ heroku open command.
- navigate to your web browser and type <http://localhost:5001/> on the url input.

## Built With
- MLAB - Cloud MongoDB server
- NPM - Dependency Management
- Bootstrap - The web framework used
- 
## Author
- Thanduxolo Nodwengu


# Shoe catalogue API 
 An API used to create an online catalogue that allows people to check the stock

[![Build Status](https://travis-ci.org/nodwengu/shoes_api.svg?branch=master)](https://travis-ci.org/nodwengu/shoes_api)
## Getting Started

For development, you will only need Node.js and a node global package, npm, installed in your environement.

## Prerequisites
Things you need to install and how to install them?
- NodeJS
- PostgreSQL
- Package.json dependencies

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

Create a database called `shoes_api_db` and username - `coder` with a password of `pg123`. Enter the password when prompted after executing the `createuser` command. 

```
sudo -u postgres createdb shoes_api_db;
sudo -u postgres createuser coder -P;
```

Now run *psql* as the *postgres* user:

```
sudo -u postgres psql;
```

Grant the `coder` user access to the `shoes_api_db` database by running this command: 

```
grant all privileges on database shoes_api_db to coder;
```

Type in `\q` to exit *psql* as the *postgres* user.

Connect to your database using: `psql -d shoes_api_db`

Execute these SQL commands to create the `colors`, `brands`, `shoes` and `basket` table in your database. 

You can copy and paste the script below into psql or your can run the database script inside psql using `\i database.sql`

```sql

CREATE TABLE brands(
    id SERIAL NOT NULL PRIMARY KEY,
    brand_name TEXT NOT NULL
);

CREATE TABLE colors(
    id SERIAL NOT NULL PRIMARY KEY,
    color_name TEXT NOT NULL
);

CREATE TABLE shoes(
    shoe_id SERIAL NOT NULL PRIMARY KEY,
    color_id INT NOT NULL,
    brand_id INT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    foreign key (color_id) references colors(id),
    foreign key (brand_id) references brands(id)
);

CREATE TABLE basket(
    id SERIAL NOT NULL  PRIMARY KEY,
    brand_name TEXT NOT NULL,
    brand_id INT NOT NULL,
    color_id INT NOT NULL, 
    color_name TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    shoe_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
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

## Mocha Setup
### Install Mocha
You need to install Mocha using this command:

$ sudo npm install -g mocha

modules should be able to
-    ✓ should be able to add new shoes to the storage
-   ✓ should be able to list all shoes in stock
 -   ✓ should be able to return a shoes for a given brand and size
 -   ✓ should be able to return a shoes for a given brand and size and color
 -  ✓ should be able to return a shoes for a given brand
 -  ✓ should be able to return a shoes for a given size
## Running the tests
In the CLI navigate to the shoes_api and run/type $ mocha and this will be your results;

## Running the app locally
The app is deployed at Heroku and gitHub.

### Prerequisites

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

## API routes
| HTTP Method | Route name |Description |
| ------ | ------ | ------ |
| GET | /api/shoes |  List all shoes in stock |
| GET | /api/shoes/brand/:brandname |  List all shoes for a given brand |
| GET | /api/shoes/size/:size |  List all shoes for a given size |
| GET | /api/shoes/brand/:brandname/size/:size |  List all shoes for a given brand and size |
| GET | /api/shoes/brand/:brandname/size/:size/color/:color |  List all shoes for a given brand, color and size |
| POST | /api/shoes/sold/:id |  Update the stock levels when a shoe is sold |
| POST | /api/shoes |  Add a new new shoe to his stock. |

## Built With
- [PostgreSQL](https://www.postgresql.org/)
- [NPM](https://www.npmjs.com/) - Dependency Management
- [Materialisecss](https://materializecss.com/) - The web framework used

## Author
- Thanduxolo Nodwengu


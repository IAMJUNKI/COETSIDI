# MY-ETSIDI

## 🏁 Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the following software/tools:
  * Node 20.x
  * PGadmin

### Installing

`npm ci` instead of `npm install` will install exact dependency versions from the lockfile (package-lock.json) which ensures reproducibility

First, clone the repository on your desktop
 ```sh
 git clone https://github.com/IAMJUNKI/COETSIDI.git
 ```

If there is a folder node_modules on cloning the repo run this so there are no conflicts like root-owned files in the cache
 ```sh
  rm -rf node_modules
  ```

install all depencies
```sh
npm install
```
Create your .env for environment variables
```sh
touch .env
```

Your .env variables should look something like this!
```
NODE_ENV='development'#LOCAL
HOST='http://localhost:5050'
PORT= '5050'

COOKIE_SECRET = 'someCOokieSecret'

#DATABASE DEV
DATABASE_NAME ='postgres'
DATABASE_USER ='postgres'
DATABASE_PASSWORD ='postgres'
DATABASE_HOST ='localhost'
DATABASE_SESSION = 'sessions'
#this last one is for storing the cookie for the user session
```
For local, run the migrations to get the needed tables on your database
```sh
cd server/database/
npx sequelize-cli db:migrate
 ```
And finally we will clone the submodules horarios and misc.

For that to happen you will have to write two commands.
```sh
git submodule init
 ```
and 
```sh
git submodule update
 ```

Now you're all set!

## ⛏️ Built Using
- [PostgresSQL](https://www.postgresql.org/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Bootstrap](https://getbootstrap.com/) - Front-end Framework

## ✍️ Authors
- [@Diego](https://github.com/IAMJUNKI)


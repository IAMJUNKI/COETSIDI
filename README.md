# COETSIDI

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

For local run migrations to get the needed table
```sh
cd server/database/
npx sequelize-cli db:migrate
 ```

You're ready!

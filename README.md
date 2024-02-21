## Установка CLI
```sh
npm install --save-dev sequelize-cli
```

## Настройка окружения

**Обязательные поля:**
```env
//.env
DB_NAME=db_name
DB_USER=root
DB_PASSWORD=root_password
DB_HOST=localhost
DB_PORT=3306
```
Настройка конфигурации `config/config.js`
```js
//config.js
{
  "development": {
    "username": process.env.DB_DEV_USER,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV_NAME,
    "host": process.env.DB_DEV_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_TEST_USER,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST_NAME,
    "host": process.env.DB_TEST_HOST,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  }
}
```

## Создание новой модели

Пример:
```sh
npx sequelize-cli model:generate --name User --attributes username:string,fullName:string,email:string
```
User:
  - username: string,
  - fullName: string,
  - email: string

После:
- Файл с моделью `user` создается в папке с моделями;
- Файл миграции с именем типа `XXXXXXXXXXXXXX-create-user.js` создается в папке миграций.

## Миграция
```sh
npx sequelize-cli db:migrate
```
Происходит миграция в базу данных, которую расписали в `config/config.js`

Откат последней миграции
```sh
npx sequelize-cli db:migrate:undo
```

Откат до конткретной миграции `XXXXXXXXXXXXXX-create-posts.js`
```sh
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
```

## Создание сидов

Пример:
```sh
npx sequelize-cli seed:generate --name demo-user
```
В папке `seeders` создаётся `XXXXXXXXXXXXXX-demo-user.js` файл

Пример сида для модели `user`
```js
//XXXXXXXXXXXXXX-demo-user.js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'JohnDoe',
      fullName: 'John Doe',
      email: 'example@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
```

Для исполнения сидов:
```sh
npx sequelize-cli db:seed:all
```

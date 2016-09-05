# Mongodb setting

#### 1. `config/connection.js`에 mongodb 연결을 정의합니다
```
  someMongodbServer: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    // user: 'username', //optional
    // password: 'password', //optional
    database: 'shoppingbag' //optional
  },
```

# Test Driven Development (TDD)


> 테스트를 염두해 두고 설계하라 - 실용주의 프로그래며 Tip 48


> 소프트웨어를 테스트하라. 그렇지 않으면 사용자가 테스트하게 될 것이다


앞으로 테스트 없이는 코딩도 안할라구 ㅋㅋ

#### Sails.js에서의 Test

- mocha라는 모듈을 이용해 테스트

- 다음과 같이 디텍토리 구조를 구성해 놓자

```
./myApp
├── api/
├── assets/
├── ...
├── test/
│  ├── integration/
│  │  ├── controllers/
│  │  │  └── UserController.test.js
│  │  ├── models/
│  │  │  └── User.test.js
│  │  └── ...
│  ├── fixtures/
|  ├── ...
│  ├── bootstrap.test.js
│  └── mocha.opts
└── views/
```

- bootstrap.test.js
test를 시작하기 전, 후로 특정 코드를 실행할수 있도록 해준다

```javascript
var sails = require('sails');

before(function(done) {
    // Increase the Mocha timeout so that Sails has enough time to lift.
    this.timeout(5000);

    sails.lift({
	// configuration for testing purposes
    }, function(err, server) {
	if (err) return done(err);
	// here you can load fixtures, etc.
	done(err, sails);
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});
```

- mocha.opts

```
--require coffee-script/register
--compilers coffee:coffee-script/register
--timeout 5s
```


```javascript
describe('UserModel', function() {
    describe('#find()', function() {
	it('should check find function', function(done) {
	    User.find()
	    .then(function(results) {
		// some tests
		done();
	    })
	    .catch(done);
	})
    })
});
```



- package.json


```json
  "scripts": {
    "start": "node app.js",
    "debug": "node debug app.js",
    "test": "node ./node_modules/mocha/bin/mocha test/bootstrap.test.js test/integration/**/*.test.js"
  }
```

`npm test` 로 test 시작
# 유저 모델 생성

## [Passport.js 로 Sails.js Authentication 구현](http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/)

#### Step1: 터미널에 명령어를 입력해 bcrypt passport passport-local 모듈을 설치
`npm install bcrypt passport passport-local --save`

#### Step2: api 생성
`sails generate api user`

api/controllers/UserController.js
api/models/User.js
가 생성됩니다.

#### Step3: `api/models/User.js` User 모델에 유저정보, 패스워드 설정

```javascript
/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
	email: {

	},
	password: {

	},
	toJSON: function() {
	    var obj = this.toObject();
	    delete obj.password;
	    return obj;
	}
    },
    beforeCreate: function(user, cb) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
		if (err) {
		    console.log(err);
		    cb(err);
		} else {
		    user.password = hash;
		    cb();
		}
	    })
	})
    }
};
```

- Sails.js에서는 *Waterline*이라는 [ORM(Object-Relational Mapping)]()을 내장하고 있다

> ORM이란, 객체형 데이터(Java의 Object)와 관계형 데이터(관계형 데이터베이스의 테이블) 사이에서 개념적으로 일치하지 않는 부분을 해결하기 위하여 이 둘 사이의 데이터를 매핑(Mapping)하는 것.

- [안전한 패스워드 저장](http://d2.naver.com/helloworld/318732) bcrpyt?

> 단방향 해시함수 : 수학적 연산을 통해 원본 메시지를 변환하여 암호화된 메시지인 다이제스트를 생성. 원본 메시지를 알면 암호화된 메시지를 구하는 것은 쉽지만 암호화된 메시지로는 원본 메시지를 구할 수 없어야 하며 이를 `단방향성`이라고 한다.

> Avalanche 효과 : 대부분의 해시 함수는 입력 값의 일부가 변경되었을 때 다이제스트가 완전히 달라지도록 설계되어 있다. 이 특징을 Avalanche 효과라고 한다

> 단방향 해시 함수의 문제점 : 레인보우 공격(rainbow attack : 전처리된 다이제스트를 가능한 많이 확보한 다음, 이를 탈취한 다이제스트와 비교해 원본 메시지를 찾아내거나 동일한 효과의 메시지를 찾아내는 공격), 속도(너무 빨라서 쉽게 비교할수 있다)

> 단방향 해시 함수 보완하기 : 솔팅(salting : 임의의 문자열을 추가해 다이제스트 생성), 키 스트래칭 (다이제스트로 다이제스트를 생성 - 반복으로 속도를 조절할수 있다)

> *bcrypt*는 애초부터 패스워드 저장을 목적으로 설계되었다. Niels Provos와 David Mazières가 1999년 발표했고 현재까지 사용되는 가장 강력한 해시 메커니즘 중 하나이다. bcrypt는 보안에 집착하기로 유명한 OpenBSD에서 기본 암호 인증 메커니즘으로 사용되고 있고 미래에 PBKDF2보다 더 경쟁력이 있다고 여겨진다.
bcrypt에서 "work factor" 인자는 하나의 해시 다이제스트를 생성하는 데 얼마만큼의 처리 과정을 수행할지 결정한다. "work factor"를 조정하는 것만으로 간단하게 시스템의 보안성을 높일 수 있다.
다만 PBKDF2나 scrypt와는 달리 bcrypt는 입력 값으로 72 bytes character를 사용해야 하는 제약이 있다.

#### Step4: AuthController 생성

`sails generate controller auth`

`api/controllers/AuthController.js`

```
/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {
    _config: {
	actions: false,
	shortcuts: false,
	rest: false
    },

    login: function(req, res) {
	passport.authenticate('local', function(err, user, info) {
	    if ((err) || (!user)) {
		return res.send({
		    message: info.message,
		    user: user
		});
	    }
	    req.login(user, function(err) {
		if (err) res.send(err);
		return res.send({
		    message: info.message,
		    user: user
		});
	    });
	})(req, res);
    },

    logout: function(req, res) {
	req.logout();
	res.redirect('/');
    }
};
```

- [passport : Authentication middleware for Node.js](http://passportjs.org/)

> Express-based 웹앱에 Authentication을 쉽게 구현할수 있도록 도와주는 미들웨어
  `username and password`, `Facebook`, `Twitter`등의 인증을 지원함

#### Step5: Login, Signup View 생성

`views/signup.ejs`

```html
<h1>Signup</h1>
<form method="POST" action="/user">
    <input type="email" name="email">
    <input type="password" name="password">
    <input type="submit" value="submit">
</form>
```

`views/login.ejs`

```html
<h1>Login</h1>
<form method="POST" action="/login">
    <input type="email" name="email">
    <input type="password" name="password">
    <input type="submit" value="submit">
</form>
```

#### Step6: routes 설정

`config/routes.js` 파일을 수정합니다
```javascript
'get /login': {
    view: 'login'
},

'post /login': 'AuthController.login',

'/logout': 'AuthController.logout',

'get /signup': {
    view: 'signup'
}
```
- Sails.js의 route.
> config/routes.js 에서 URL을 controller에 mapping. (Django의 url.py와 비슷)
address는 왼쪽
target은 오른쪽
target은 controller또는 view가 될 수 있음

#### Step 7: [Middleware 세팅](http://sailsjs.org/documentation/concepts/middleware)

`config/http.js`

```javascript
passportInit: require('passport').initialize(),
passportSession: require('passport').session(),

order: [
    'startRequestTimer',
    'cookieParser',
    'session',
    'passportInit',
    'passportSession',
    'myRequestLogger',
    'bodyParser',
    'handleBodyParserError',
    'compress',
    'methodOverride',
    'poweredBy',
    '$custom',
    'router',
    'www',
    'favicon',
    '404',
    '500'
],
```

- custom middleware 예시

```javascript
foobar: function (req,res,next) { /*...*/ next(); },

order: [
       'foobar',
]
```

혹은 Express의 많은 Middleware들을 이곳에 추가해 줄수 있다.


#### Step 8: Passport Local Strategy 설정

`config/passport.js`

```
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({id: id}, function(err, user) {
	done(err, user);
    });
});

passport.use(new LocalStrategy(
    {
	usernameField: 'email',
	passwordField: 'password'
    },
    function(email, password, done) {
	User.findOne({email: email}, function(err, user) {
	    if (err) { return done(err); }
	    if (!user) {
		return done(null, false, {
		    message: 'Invalid Password'
		});
	    }
	    var returnUser = {
		email: user.email,
		createAt: user.createAt,
		id: user.id
	    };
	    return done(null, returnUser, {
		message: 'Logged In Successfully'
	    });
	})
    }
))
```

#### Step 9: 새로운 Policy 적용

`api/policies/isAuthenticated.js`

```javascript
module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    } else {
	return res.redirect('/login');
    }
};
```
- policy 적용 예시

`config/policies.js`

```javascript
module.exports.policies = {

   '*': true,

  'PostController': {
    '*': 'isAuthenticated'
  },

};
```

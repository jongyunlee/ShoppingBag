# [Sails.js에 JSON Web Token 적용하기](https://thesabbir.com/how-to-use-json-web-token-authentication-with-sails-js/)

#### Step1: jsonwebtoken을 install합니다

`npm install jsonwebtoken --save`

#### jwToken service를 생성합니다
`api/services/jwToken.js`

```javascript
var jwt = require('jsonwebtoken');
var tokenSecret = 'thisissecrettoken';

module.exports.issue = function(payload) {
    return jwt.sign(
	payload,
	tokenSecret,
	{
	    expiresInMinutes: 180
	}
    );
};

module.exports.verify = function(token, callback) {
    return jwt.verify(
	token,
	tokenSecret,
	{},
	callback
    );
};
```

#### Step2: jwToken service를 이용하여 token을 login/signup할때 발행해줍니다

```javascript
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
		    email: user.email
		});
	    }
	    req.login(user, function(err) {
		if (err) res.send(err);
		return res.send({
		    message: info.message,
		    email: user.email,
		    token: jwToken.issue({id: user.id})
		});
	    });
	})(req, res);
    },

    logout: function(req, res) {
	req.logout();
	res.redirect('/');
    },

    signup: function(req, res) {
	var params = req.params.all();
	User.create({
	    email: params.email,
	    password: params.password
	}).exec(function createCB(err, user) {
	    if (err) {
		if ('password' in err.invalidAttributes) {
		    if (err.invalidAttributes.password[0].rule === 'minLength')
			return res.json(200, { message : '6자리 이상의 비밀번호를 입력해주세요', status: 400 });
		} else if ('email' in err.invalidAttributes) {
		    if (err.invalidAttributes.email[0].rule === 'unique')
			return res.json(200, { message: '이메일이 이미 존재합니다', status: 400});
		}
		return res.send(err);
	    }
	    return res.json(200, {
		status: 200,
		email: user.email,
		token: jwToken.issue({id: user.id})
	    })
	})
    }
};
```

#### Step3: jwToken으로 verify하는 Policy를 만들어 적용합니다


`api/policies/isAuthorized.js`

```javascript
module.exports = function(req, res, next) {
    var token;
    if (req.headers && req.headers.authorization) {
	var parts = req.headers.authorization.split(' ');
	if (parts.length == 2) {
	    var scheme = parts[0];
	    var credentials = parts[1];
	    if (/^Bearer$/i.test(scheme)) {
		token = credentials;
	    }
	} else {
	    return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
	}
    } else if (req.param('token')) {
	token = req.param('token')
	delete req.query.token;
    } else {
	return res.json(401, {err: 'No Authorization header was found'});
    }
    jwToken.verify(token, function(err, token) {
	if (err) return res.json(401, {err: 'Invalid Token!'});
	req.token = token;
	next();
    });
};

```

`config/policies.js`

```javascript
    '*': ['isAuthorized'],
    'AuthController': {
	'*': true
    }
```

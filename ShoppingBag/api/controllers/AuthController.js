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
		email: user.email
	    })
	})
    }
};

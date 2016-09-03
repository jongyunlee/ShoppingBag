var request = require('supertest');

describe('AuthController', function() {
    describe('#signup()', function() {
	before(function(done) {
	    User.destroy({
		email: 'test@test.com'
	    }).exec(function() {
		done();
	    });
	});
	it('signup validation: report password is too short message', function(done) {
	    request(sails.hooks.http.app)
		.post('/user')
		.send({email: 'test@test.com', password: 'test'})
		.expect(function(res) {
		    if (res.body.status != 400) throw new Error('status should be 400');
		    if (res.body.message !== '6자리 이상의 비밀번호를 입력해주세요') throw new Error('If less than minLength it should return error message');
		})
		.expect(200, done)
	});
	it ('signup validation: signup success', function(done) {
	    request(sails.hooks.http.app)
		.post('/user')
		.send({email: 'test@test.com', password: 'testtest'})
		.expect(function(res) {
		    if (res.body.status != 200) throw new Error('status should be 200');
		    if (res.body.email !== 'test@test.com') throw new Error('should return email in json');
		})
		.expect(200, done)
	});
	it ('second signup : email should be unique ', function(done) {
	    request(sails.hooks.http.app)
	    .post('/user')
	    .send({email: 'test@test.com', password: 'testtest'})
	    .expect(function(res) {
		if (res.body.status != 400) throw new Error('status should be 400');
		if (res.body.message !== '이메일이 이미 존재합니다') throw new Error('should return email unique message in json');
	    })
	    .expect(200, done)
	});
	after(function(done) {
	    User.destroy({
		email: 'test@test.com'
	    }).exec(function() {
		done();
	    });
	});
    });
});

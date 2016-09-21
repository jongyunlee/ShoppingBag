var jwt = require('jsonwebtoken');
var tokenSecret = '<%= secret_key %>';

module.exports.issue = function(payload) {
    return jwt.sign(
	payload,
	tokenSecret,
	{
	    // expiresInMinutes: 180
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

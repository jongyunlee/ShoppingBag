var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    constructor: function() {
	generators.Base.apply(this, arguments);
	// generator code
    },
    prompting: function() {
	return this.prompt([{
	    type: 'input',
	    name: 'name',
	    message: 'Your project name',
	    default: this.appname
	}, {
	    type: 'input',
	    name: 'secretkey',
	    message: 'Secret key of your app'
	}, {
	    type: 'list',
	    name: 'db',
	    message: 'Select Database: ',
	    choices: ['sails-disk', 'Mysql', 'Mongodb', 'PostgreSQL']
	}]).then(function(answers) {
	    this.name = answers.name;
	    this.secretkey = answers.secretkey;
	    this.db = answers.db;
	}.bind(this));
    },
    writing: function() {
	var context = {};
	if (this.db == 'Mongodb') {
	    context = {
		db_adapter:  'sails-mongo',
		db_host: 'localhost',
		db_port: 27017,
		db_name: this.name
	    }
	}
	this.fs.copyTpl(
	    this.templatePath('connections.js'),
	    this.destinationPath('config/connections.js'),
	    context
	);
    }
});

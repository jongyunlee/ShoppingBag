'use strict';

var glob = require('glob');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');

module.exports = yeoman.Base.extend({

    _processDirectory: function(source, destination, data) {
	var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
	var files = this.expandFiles('**', { dot: true, cwd: root });

	for (var i = 0; i < files.length; i++) {
	    var f = files[i];
	    var src = path.join(root, f);
	    if(path.basename(f).indexOf('_') == 0){
		var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
		this.template(src, dest, data);
	    } else {
		var dest = path.join(destination, f);
		this.fs.copy(src, dest);
	    }
	}
    },

    prompting: function() {
	this.log(yosay(
	    'Welcome to the ' + chalk.red('generator-sailsapp') + ' generator!'
	));

	var prompts = [
	    {
		type: 'input',
		name: 'project_name',
		message: 'What is your project name?',
            default: 'DemoApp'
	    },
	    {
		type: 'input',
		name: 'secret_key',
		message: 'What is your secret key?',
	    default: 'SECRETKEY'
	    },
	    {
		type: 'list',
		name: 'db',
		message: 'Select Database: ',
		choices: ['SailsDisk', 'MySQL', 'MongoDB', 'PostgreSQL'],
		default: 'SailsDisk'
	    }
	];

	return this.prompt(prompts).then(function(props) {
	    this.props = props;
	}.bind(this));
    },

    writing: function() {
	this._processDirectory('server', 'server', {
	    project_name: this.props.project_name,
	    secret_key: this.props.secret_key,
	    db: this.props.db
	});
    }
});

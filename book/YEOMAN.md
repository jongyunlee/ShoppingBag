# Yeoman으로 코드생성기 작성

## 코드를 작성하는 코드를 작성하라 - 실용주의 프로그래며 Tip 29

생각해보니, 지금까지 작업은 다음번 프로젝트를 할때도 똑같이 반복할것 같은 생각이 들었다.
반복을 줄이는 것이 (DRY : Do not Repeat Yourself) 실용주의 프로그래머의 덕목이니, 코드생성기를 작성하여 같은 작업을 반복하지 않도록 해보자.

> `Waterlock` 이라는 Sails를 위한 웹토큰 관리 툴이 있기는 하지만 처음부터 끝까지 확인하지 않은 코드가 생성되는 것은 뭔가 찜찜한 기분이 들어 직접 코드생성기를 만들기로 결정했다.

### [YEOMAN : The Web's scaffolding tool for modern webapps](http://yeoman.io/)

코드 생성기 작성에 앞서 무작정 코드를 생성하는 코드를 작성하려니 뭔가 막막했다.

```
1. 필요한 부분은 쉽게 대체할수 있어야 하고,
(ex1 : json web token의 secret키는 코드 생성 전에 입력을 받도록)
(ex2 : 어떤 데이터베이스를 쓸지 코드 생성 전에 선택할 수 있도록... 등등)

2. Sails가 generate tool을 제공하는 것 처럼
(ex : sails generate api User)
어떤 작은 단위로 코드 생성을 작성하기 용이하면 좋을 것 같았다.
(ex : routes.js에 url 자동생성)

3. 코드 생성기도 코드인데 test, linting, 유지보수, dependency 관리가 쉬워야 하지 않을까?
```

Yeoman(Web's scaffolding tool for modern webapps)을 써서 코드생성기를 만들자

#### Yeoman의 Tools

1. YO : scaffolding tool

2. Gulp : build system

3. npm : package manager


#### Step 1 : Setup generator

> generator-generator : 생성기를 위한 생성기도 있다고 하니, yeoman에 익숙해지면 이것을 쓰는것도 좋을것 같다

`mkdir generator-name`
이때 generator- 다음의 name은 생성기의 이름으로 한다.

`npm init -y`

`npm install --save yeoman-generator`

- `package.json`의 files : 생성기가 사용하는 file과 directories는 여기에 명시되어 있어야 한다고 하니 채크!

```json
    "files": [
	"generators/app",
	"generators/router",
    ]
```

- Folder tree

```
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

`yo 생성기이름:앱이름`로 코드 생성을 명령하는데, `yo 생성기이름`만 입력하면 app 디렉토리의 index.js가 default로 실행된다고 한다

(ex : yo name:router)


#### Step 2 : 생성기 작성하기

- `generators/app/index.js` 에 yeoman-generator을 extend해서 생성기 코드를 작성합니다

```javascript
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    constructor: function() {
	generators.Base.apply(this, arguments);
	// TODO: 여기에 생성기가 시작하기 전 해야할 일들을 작성함
    },
    method1: function() {
        /// TODO 생성기 코드 작성
    },
    method2: function() {
        /// TODO 생성기 코드 작성
    }
});
```

> 여기서 extend 메소드는 Class-extend라는 모듈을 사용해서 generators.Base의 prototype을 확장해 사용할수 있게 하는 메소드라 한다. constructor을 선언하지 않으면 generators.Base의 constructor만 생성이 된다고 한다. (나중에 Backbone.js 을 다루게 된다면 이게 사용된다 하니 참고)


> 보통 extend안에 선언된 메소드들은 순서대로 실행된다고 함


#### Step 3: 생성기 작동시키기

생성기 디렉토리(`generator-name/`)에서 `npm link`
dependencies를 인스톨하고 이 local file을 global module로 symlink 한다고 한다
어디서나 `yo name`으로 이 코드를 생성 가능


#### Step 4: Secret key와 DB선택 prompts 만들기
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)이용하여 prompt 모듈을 지원한다
- prompting queue에 원하는 prompt를 넣는다

```javascript
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
	    this.log('app name', answers.name);
	    this.log('secret key', answers.secretkey);
	    this.log('database : ', answers.db)
	}.bind(this));
    }
});
```

#### Step 5: 파일 생성하기
- `.yo-rc.json` : yeoman 프로젝트의 루트 디텍토리를 정의
- `generator.destinationRoot()` : 루트 디렉토리 반환
- `generator.destinationPath('sub/path')` : root/sub/path를 반환
- `generator.sourceRoot()` : 템플릿이 있는 디렉토리를 반환 (default './template')
- `generator.templatePath('app/index.js')`


- template 작성
`connections.js`
```javascript
module.exports.connections = {
    server: {
	adapter: <%= db_adapter %>,
	host: <%= db_host %>,
	port: <%= db_port %>,
	database: <%= db_name %>
    }
};
```

- `copyTpl` 메소드를 이용하여 코드 생성 (`app/index.js`)

```javascript
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
		port: 27017,
		database: this.name
	    }
	}
	this.fs.copyTpl(
	    this.templatePath('connections.js'),
	    this.destinationPath('config/connections.js'),
	    context
	);
    }
});
```
#### Step 6: Unit testing

## Reference
- [yeoman creating a generator](http://yeoman.io/authoring/)
- [generate tool](http://sailsjs.org/documentation/reference/command-line-interface/sails-generate)
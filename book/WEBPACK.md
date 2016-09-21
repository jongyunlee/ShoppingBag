# Webpack.js, React.js 적용하기

### Step1: webpack, react module 설치하기

```
npm install react react-dom react-router sails-webpack --save
npm install babel babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
```

### Step2: webpack 설정하기

`config/webpack.js`

```
var webpack = require('webpack');
const path = require('path');

module.exports.webpack = {
    options: {
	entry: './assets/js/app.jsx',
	output: {
	    path: path.resolve(__dirname, '../.tmp/public/js'),
	    filename: 'bundle.jsx'
	},
	resolve: {
	    extension: ['', '.js', 'jsx', '.json']
	},
	stats: {
	    colors: true,
	    reasons: true,
	    chunks: false
	},
	module: {
	    loaders: [
		{
		    test: /\.jsx?$/,
		    loader: 'babel-loader'
		},
		{
		    test: /\.json$/,
		    loader: 'json-loader'
		}
	    ]
	}
    },

    watchOptions: {
	aggregateTimeout: 300
    }
}
```


`.babelrc`
```
{
    "presets": ["react", "es2015"]
}
```


### Step3: React로 첫화면 만들기

`assets/js/app.jsx`

```
const React = require('react');
const ReactDOM = require('react-dom');
const Landing = require('./Landing.jsx');
const { Router, Route, IndexRoute, hashHistory } = require('react-router');

const App = () => (
    <Router history={hashHistory}>
	<Route path='/' component={Landing}/>
    </Router>
)

ReactDOM.render(<App />, document.getElementById('app'));
```

`assets/js/Landing.jsx`

```
const React = require('react');
const ReactDOM = require('react-dom');
const {Link} = require('react-router');

const Landing = () => (
    <div className='home-info'>
	<h1 className='title'>ShoppingBag</h1>
    </div>
)

module.exports = Landing;
```

### Step4: view/layout.ejs 수정

```
<!DOCTYPE html>
<html>
  <head>
    <title><%=typeof title == 'undefined' ? 'New Sails App' : title%></title>

    <!-- Viewport mobile tag for sensible mobile support -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">


    <!--
        Stylesheets and Preprocessors
        ==============================

        You can always bring in CSS files manually with `<link>` tags, or asynchronously
        using a solution like AMD (RequireJS).  Or, if you like, you can take advantage
        of Sails' conventional asset pipeline (boilerplate Gruntfile).

        By default, stylesheets from your `assets/styles` folder are included
        here automatically (between STYLES and STYLES END). Both CSS (.css) and LESS (.less)
        are supported. In production, your styles will be minified and concatenated into
        a single file.

        To customize any part of the built-in behavior, just edit `tasks/pipeline.js`.
        For example, here are a few things you could do:

            + Change the order of your CSS files
            + Import stylesheets from other directories
            + Use a different or additional preprocessor, like SASS, SCSS or Stylus
    -->

    <!--STYLES-->
    <link rel="stylesheet" href="/styles/importer.css">
    <!--STYLES END-->
  </head>

  <body>
      <div id="app"></div>
    <!--
        Client-side Templates
        ========================

        HTML templates are important prerequisites of modern, rich client applications.
        To work their magic, frameworks like Backbone, Angular, Ember, and Knockout require
        that you load these templates client-side.

        By default, your Gruntfile is configured to automatically load and precompile
        client-side JST templates in your `assets/templates` folder, then
        include them here automatically (between TEMPLATES and TEMPLATES END).

        To customize this behavior to fit your needs, just edit `tasks/pipeline.js`.
        For example, here are a few things you could do:

            + Import templates from other directories
            + Use a different template engine (handlebars, jade, dust, etc.)
            + Internationalize your client-side templates using a server-side
              stringfile before they're served.
    -->

    <!--TEMPLATES-->

    <!--TEMPLATES END-->


    <!--

      Client-side Javascript
      ========================

      You can always bring in JS files manually with `script` tags, or asynchronously
      on the client using a solution like AMD (RequireJS).  Or, if you like, you can
      take advantage of Sails' conventional asset pipeline (boilerplate Gruntfile).

      By default, files in your `assets/js` folder are included here
      automatically (between SCRIPTS and SCRIPTS END).  Both JavaScript (.js) and
      CoffeeScript (.coffee) are supported. In production, your scripts will be minified
      and concatenated into a single file.

      To customize any part of the built-in behavior, just edit `tasks/pipeline.js`.
      For example, here are a few things you could do:

          + Change the order of your scripts
          + Import scripts from other directories
          + Use a different preprocessor, like TypeScript

    -->

    <!--SCRIPTS-->

    <!--SCRIPTS END-->
    <script src="/js/bundle.jsx"></script>
  </body>
</html>
```

### Step5: 확인하기

`sails lift`
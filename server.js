// Dependencies
var _ = require('lodash'),
	bodyParser = require('body-parser'),
	express = require('express'),
	fs = require('fs'),
	methodOverride = require('method-override'),
	path = require('path'),
	waterline = require('waterline'),
	JSONAPISerializer = require('jsonapi-serializer').Serializer,
	inflection = require('inflection'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash');

// Instantiations and configs
var app = express(),
	config = require('./config/config'),
	Router = require('./routes'),
	orm = new waterline();

require('./config/passport')(passport, app); // pass passport for configuration
//app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ 
	secret: config.sessionSecret, 
	saveUninitialized: true, 
	resave: false,
	cookie: { 
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: 18000000
	},
	rolling: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Load all models into Waterline
var modelsDir = __dirname + '/models';
var modelFiles = fs.readdirSync(modelsDir);
var model = '';
_.filter(modelFiles, function(file) {
	if (file.indexOf(".") !== 0) {
		model = require(path.join(modelsDir, file));
		orm.loadCollection(model);
	}
});

// Setup routes
var routes = new Router(app, passport);
app.use('/', routes);

app.use(function(req, res, next) {
	res.locals.currentUser = req.session.user;
	next();
});

// error handlers 
app.use(function(err, req, res, next) {
	console.log(err);
	// TODO better error handlers
	if (err) {
		var errRes = {},
			code = 500;
		errRes.code = code;
		if (_.isObject(err)) {
			if (_.has(err,'status') && err.status) {
				code = err.status;
				errRes.code = code;
			} 
			
			if (_.has(err,'title') && err.title) {
				errRes.error = err.title;
			}
			
			if (_.has(err,'details') && err.details) {
				errRes.error_description = err.details;
			}
		} else {
			errRes.error = err;
		}
		res.status(code).json(errRes);
	}
});

// Initialize Waterline with the orm config
orm.initialize(config.waterline, function(err, models) {
	if (err) {
		console.log('Error initializing ORM. '+err);
		throw err;
	}

	app.models = models.collections;
	app.connections = models.connections;

	// Start Server
	app.listen(config.port);
	console.log('App listening in '+ config.env.toUpperCase() + ' on port ' + config.port);
});
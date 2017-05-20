var router = require('express').Router(),
	fs = require('fs'),
	config = require(__dirname + '/config/config');

module.exports = function Router(app, passport) {
	
	// Load all controller modules from the controllers folder
	var controllerPath = __dirname + '/controllers/',
		appControllers = {},
		appControllerPaths = [];

	//Create an object to store all controller files found under /controllers/
	fs.readdirSync(controllerPath).forEach(function(file) {
		appControllers[file.replace('.js', '')] = require(controllerPath + file)(app, config);
		appControllerPaths.push(controllerPath + file);
	});
	
	// middleware to check if the user is logged in
	function isAuthenticated(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();
		// if they aren't redirect them to the login page
		res.render('login.ejs',{ oauthError: 'Please login !!', title: 'Authentication'});
	}
	
	router.route('/')
	.get(isAuthenticated, function(req, res, next) {
		res.redirect('/timeline');
	});
	
	router.route('/login')
	.get(function(req, res, next) {
		res.render('login.ejs',{ oauthError: req.flash('oauthError'), title: 'Authentication'});
	});
	
	router.route('/oauth')
	.post(
		passport.authenticate('local-login', {
			successRedirect : '/timeline', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		})
	);
	
	router.route('/logout')
	.get(function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	router.route('/timeline')
	.get(isAuthenticated, appControllers.posts.getMyPosts);
	
	router.route('/network')
	.get(isAuthenticated, appControllers.posts.getAllButMyPosts);
	
	router.route('/posts/add')
	.post(isAuthenticated, appControllers.posts.create)
	
	router.route('/likes/add')
	.post(isAuthenticated, appControllers.likes.create)
	
	router.route('/comments/add')
	.post(isAuthenticated, appControllers.comments.create)
	
	return router;
};
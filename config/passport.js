var LocalStrategy   = require('passport-local').Strategy,
	helpers = require('../utils/helpers');
	
module.exports = function(passport, app) {
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		app.models.user.findOne({id:id})
		.exec(function(err, user) {
			done(err, user);
		});
	});
		
	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form
		// find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
		app.models.user.findOne({'username' :  username})
		.exec(function(err, user) {
			if (err) return done(err);
				
			if (!user) return done(null, false, req.flash('oauthError', 'No user found.'));
			
			// create the oauthError and save it to session as flashdata
			if (!helpers.validUserPassword(password, user.password))
				return done(null, false, req.flash('oauthError', 'Oops! Wrong password.')); 
			
			// all is well, return successful user
			return done(null, user);
		});
	}));
};
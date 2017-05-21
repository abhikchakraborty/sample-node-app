var config = require('../config/config'),
	bcrypt   = require('bcrypt-nodejs'),
	waterline = require('waterline'),
	async = require('async'),
	User = require('../models/user');

var orm = new waterline(),
	db = {};
	
var userList = [
	{userName:'abhik', password: 'abhik123', email: 'abhik.chakraborty@gmail.com',firstName:'Abhik', lastName:'C'},
	{userName:'ashish', password: 'ashish123', email: 'ashish@gmail.com',firstName:'Ashish', lastName:'R'},
	{userName:'amrita', password: 'amrita123', email: 'amrita@gmail.com',firstName:'Amrita', lastName:'C'},
	{userName:'vinuta', password: 'vinuta123', email: 'vinuta@gmail.com',firstName:'Vinuta', lastName:'B'}
];

orm.loadCollection(User);
orm.initialize(config.waterline, function(err, models) {
	if (err) throw err;
	db.models = models.collections;
	db.connections = models.connections;
	migrateSampleUser();
});

function generateHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function migrateSampleUser() {
	async.each(userList, function(u, callback) {
		db.models.user.findOne({userName:u.userName})
		.exec(function(err, user) {
			if (err) return callback(err);
			
			if (user) {
				console.log('User already in the DB.. skipping the insertion');
			} else {
				var userData = {
					userName: u.userName,
					password: generateHash(u.password),
					email: u.email,
					firstName: u.firstName,
					lastName: u.lastName
				};
				
				db.models.user.create(userData)
				.exec( function(err, newUser) {
					if (err) return callback(err);
					
					console.log('User Created...');
					console.log(newUser);
				});
			}
		});
	}, function(err) {
		console.log(err);
	});
}
var bcrypt   = require('bcrypt-nodejs');

exports.generatePasswordHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.validUserPassword = function(givenPass, passInDb) {
	return bcrypt.compareSync(givenPass, passInDb);
}
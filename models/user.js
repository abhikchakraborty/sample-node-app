var Waterline = require('waterline');

var user = Waterline.Collection.extend({

	identity: 'user',
	connection: 'appReadMysql',
	tableName: 'user',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'iduser',
			primaryKey: true
		},

		firstName: {
			type: 'string',
			columnName: 'firstname'
		},

		lastName: {
			type: 'string',
			columnName: 'lastname'
		},

		userName: {
			type: 'string',
			columnName: 'username'
		},

		password: {
			type: 'string'
		},
		
		email: {
			type: 'string'
		}
	}
});

module.exports = user;
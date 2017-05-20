var Waterline = require('waterline');

var comments = Waterline.Collection.extend({

	identity: 'comments',
	connection: 'appReadMysql',
	tableName: 'comments',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'idcomments',
			primaryKey: true
		},

		post: {
			model: 'posts',
			columnName: 'idposts'
		},
		
		user: {
			model: 'user',
			columnName: 'iduser'
		},

		content: {
			type: 'string',
			columnName: 'content'
		},

		createdOn: {
			type: 'datetime',
			columnName: 'created_on'
		},
		
		
	}
});

module.exports = comments;
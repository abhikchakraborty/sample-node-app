var Waterline = require('waterline');

var comments_write = Waterline.Collection.extend({

	identity: 'comments_write',
	connection: 'appReadWrite',
	tableName: 'comments',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'idcomments',
			primaryKey: true,
			autoIncrement: true
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

module.exports = comments_write;
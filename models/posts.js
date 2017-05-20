var Waterline = require('waterline');

var posts = Waterline.Collection.extend({

	identity: 'posts',
	connection: 'appReadMysql',
	tableName: 'posts',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'idposts',
			primaryKey: true
		},

		createdBy: {
			model: 'user',
			columnName: 'created_by'
		},

		content: {
			type: 'string',
			columnName: 'content'
		},

		createdOn: {
			type: 'datetime',
			columnName: 'created_on'
		},
		
		comments: {
			collection: 'comments',
			via: 'post'
		}
	}
});

module.exports = posts;
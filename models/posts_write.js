var Waterline = require('waterline');

var posts_write = Waterline.Collection.extend({

	identity: 'posts_write',
	connection: 'appReadWrite',
	tableName: 'posts',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'idposts',
			primaryKey: true,
			autoIncrement: true
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
		}
	}
});

module.exports = posts_write;
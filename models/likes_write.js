var Waterline = require('waterline');

var likes_write = Waterline.Collection.extend({

	identity: 'likes_write',
	connection: 'appReadWrite',
	tableName: 'post_likes',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,

	attributes: {
		id: {
			type: 'integer',
			columnName: 'idpost_likes',
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

		createdOn: {
			type: 'date',
			columnName: 'created_on'
		}
	}
});

module.exports = likes_write;
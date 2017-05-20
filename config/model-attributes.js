module.exports = {
	posts: {
		default: ['createdBy', 'content', 'createdOn','comments', 'likes'],
		me: ['content', 'createdOn','comments', 'likes'],
		network: ['content', 'createdOn','comments', 'likes', 'firstName', 'lastName', 'createdBy', 'likedByMe'],
	},
	user: {
		default: ['id', 'firstName', 'lastName', 'email'],
		me: ['id', 'firstName', 'lastName', 'email', 'userName', 'password']
	},
	
	comments: {
		default: ['post', 'content', 'user', 'createdOn'],
	},
	
	likes: {
		default: ['post', 'user', 'createdOn']
	}
};

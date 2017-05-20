var _ = require('lodash'),
	modelInfo = require('../config/model-attributes'),
	inflection = require('inflection'),
	moment = require('moment'),
	JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = function(app, config) {
	var apiNamespace = config.apiNamespace,
		resourceType = 'comments';
	
	return {
		
		create: function(req, res, next) {
			var apiBase = req.protocol + '://' + req.get('host') + apiNamespace,
				apiEndpoint = apiBase + '/' + resourceType + '/';
			
			var commentObj = {
				user: req.user.id,
				createdOn: moment().format(),
				post: req.body.postId,
				content: req.body.commentText
			};
			
			app.models.comments_write.create(commentObj)
			.exec(function(err, newComment) {
				if (err) next(err);
				  
				var JSONAPIOptions = {
					resourceType: resourceType,
					attributes:modelInfo.comments.default,
					dataLinks: {
						self: function (newComment,comment) {
							return apiEndpoint + comment.id;
						}
					}
				};
				
				// always camelize the attributes
				JSONAPIOptions.keyForAttribute = function(attribute) {
					return inflection.camelize(attribute, true);
				};
				var data = new JSONAPISerializer(JSONAPIOptions.resourceType, JSONAPIOptions).serialize(newComment);
				
				res.status(200).json(data);
			});
		}
	};
};
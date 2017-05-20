var _ = require('lodash'),
	modelInfo = require('../config/model-attributes'),
	inflection = require('inflection'),
	moment = require('moment'),
	JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = function(app, config) {
	var apiNamespace = config.apiNamespace,
		resourceType = 'likes';
	
	return {
		
		create: function(req, res, next) {
			var apiBase = req.protocol + '://' + req.get('host') + apiNamespace,
				apiEndpoint = apiBase + '/' + resourceType + '/';
			
			var likesObj = {
				user: req.user.id,
				createdOn: moment().format(),
				post: req.body.postId
			};
			
			app.models.likes_write.create(likesObj)
			.exec(function(err, newLike) {
				if (err) next(err);
				  
				var JSONAPIOptions = {
					resourceType: resourceType,
					attributes:modelInfo.likes.default,
					dataLinks: {
						self: function (newLike,like) {
							return apiEndpoint + like.id;
						}
					}
				};
				
				// always camelize the attributes
				JSONAPIOptions.keyForAttribute = function(attribute) {
					return inflection.camelize(attribute, true);
				};
				var data = new JSONAPISerializer(JSONAPIOptions.resourceType, JSONAPIOptions).serialize(newLike);
				
				res.status(200).json(data);
			});
		}
	};
};
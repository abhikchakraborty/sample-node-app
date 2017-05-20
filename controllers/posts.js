var _ = require('lodash'),
	async = require('async'),
	modelInfo = require('../config/model-attributes'),
	pagination = require('../utils/pagination'),
	inflection = require('inflection'),
	moment = require('moment'),
	JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = function(app, config) {
	var apiNamespace = config.apiNamespace,
		resourceType = 'posts';
	
	return {
		
		getMyPosts: function(req, res, next) {
			var whereClause,
				page,
				limit;
			
			whereClause = {createdBy:req.user.id} ;
			
			pagination.parsePagingRequest(req, function(err, pagingReq) {
				if (err) return next(err);
				page = pagingReq.page - 1; // limit 0,1 in case the page is 1
				limit = pagingReq.limit;
			});
			
			async.auto({
				
				recordCount: function(autoCallback) {
					app.models.posts.count(whereClause)
					.exec(function(err, cnt) {
						if (err) return autoCallback(err);
						  
						return autoCallback(null, cnt);
					});
				},
			  
				getRecords: ['recordCount', function(result, autoCallback) {
					var count = (_.isArray(result.recordCount)) ? result.recordCount[0] : result.recordCount;
					
					if (count === 0) return autoCallback();
					
					app.models.posts.find(whereClause)
					.sort('createdOn desc')
					.paginate({page: page, limit: limit})
					.exec(function(err, posts) {
						if (err) console.log(err);
						
						return autoCallback(null, posts);
					});
					
				}]
			}, 
			
			function(err, results) {
				if (err) return next(err);
					   
				var postsCount = (_.isArray(results.recordCount)) ? results.recordCount[0] : results.recordCount,
					pagingLinks = pagination.pagingLinks(req, postsCount, apiEndpoint),
					posts = results.getRecords,
					apiBase = req.protocol + '://' + req.get('host') + apiNamespace,
					apiEndpoint = apiBase + '/' + resourceType + '/';
				
				if (posts) {
					
					async.forEachOf(posts, function(post, i, eachCallback) {
						
						async.parallel({
							
							comments: function(parallelCallback) {
								app.models.comments.find({post:post.id})
								.sort('createdOn asc')
								.populate('user')
								.exec(function(err, comments) {
									if (err) return parallelCallback(err);
										
									/*comments.forEach(function(comment, i) {
										var user = _.pick(comment.user,  modelInfo.user.default);
										comments[i].user = user;
									});*/
									
									posts[i].comments = comments;
									return parallelCallback();
								});
							},
							
							likes: function(parallelCallback) {
								app.models.likes.find({post:post.id})
								.exec(function(err, likes) {
									if (err) return parallelCallback(err);
										
									posts[i].likes = likes;
									return parallelCallback();
								});
							}
							
						}, function(err) {
							if (err) return eachCallback(err);
							
							return eachCallback(null, true);
						});
						
					}, function(err) {
						if (err) return next(err);
						
						var JSONAPIOptions = {
							resourceType: resourceType,
							topLevelLinks: pagingLinks,
							attributes:modelInfo.posts.me,
							dataLinks: {
								self: function (posts,post) {
									return apiEndpoint + post.id;
								}
							}
						};
				
						var meta = {totalRecords: postsCount};
			
						// always camelize the attributes
						JSONAPIOptions.keyForAttribute = function(attribute) {
							return inflection.camelize(attribute, true);
						};
						
						var data = new JSONAPISerializer(JSONAPIOptions.resourceType, JSONAPIOptions).serialize(posts);
						data.meta = meta;
						res.render('timeline.ejs',{ title: 'Timeline', posts: data,currentPage:'timeline', currentUser:req.user});
					});//
				} else {
					res.render('timeline.ejs',{ title: 'Timeline', posts: {},currentPage:'timeline', currentUser:req.user});
				}
			});
		},
		
		getAllButMyPosts: function(req, res, next) {
			var whereClause,
				page,
				limit;
			
			whereClause = {createdBy: {'!' : req.user.id}} ;
			
			pagination.parsePagingRequest(req, function(err, pagingReq) {
				if (err) return next(err);
				page = pagingReq.page - 1; // limit 0,1 in case the page is 1
				limit = pagingReq.limit;
			});
			
			async.auto({
				
				recordCount: function(autoCallback) {
					app.models.posts.count(whereClause)
					.exec(function(err, cnt) {
						if (err) return autoCallback(err);
						  
						return autoCallback(null, cnt);
					});
				},
			  
				getRecords: ['recordCount', function(result, autoCallback) {
					var count = (_.isArray(result.recordCount)) ? result.recordCount[0] : result.recordCount;
					
					if (count === 0) return autoCallback();
								 
					var query= " select p.idposts as id, p.created_on as createdOn, p.created_by as createdBy,p.content, "
						query += " u.firstname as firstName, u.lastname as lastName ";
						query += " from posts p ";
						query += " inner join user u on u.iduser = p.created_by ";
						query += " where p.created_by <> "+req.user.id ;
						query += " order by u.firstname, p.created_on desc "
						query += " limit "+page+" , "+limit;
					
					app.models.posts
					.query(query, function(err, posts) {
						if (err) return autoCallback(err);
								 
						return autoCallback(null, posts);
					});
					
				}]
			}, 
			
			function(err, results) {
				if (err) return next(err);
					   
				var postsCount = (_.isArray(results.recordCount)) ? results.recordCount[0] : results.recordCount,
					pagingLinks = pagination.pagingLinks(req, postsCount, apiEndpoint),
					posts = results.getRecords,
					apiBase = req.protocol + '://' + req.get('host') + apiNamespace,
					apiEndpoint = apiBase + '/' + resourceType + '/';
				
				if (posts) {
					
					async.forEachOf(posts, function(post, i, eachCallback) {
						
						async.parallel({
							
							comments: function(parallelCallback) {
								app.models.comments.find({post:post.id})
								.sort('createdOn asc')
								.populate('user')
								.exec(function(err, comments) {
									if (err) return parallelCallback(err);
										
									/*comments.forEach(function(comment, i) {
										var user = _.pick(comment.user,  modelInfo.user.default);
										comments[i].user = user;
									});*/
									
									posts[i].comments = comments;
									return parallelCallback();
								});
							},
							
							likes: function(parallelCallback) {
								app.models.likes.find({post:post.id})
								.exec(function(err, likes) {
									if (err) return parallelCallback(err);
										
									posts[i].likes = likes;
									
									var currentUserLiked = 'no';
									
									if (likes) {
										if(_.find(likes, {user: req.user.id})) currentUserLiked = 'yes' ;
									}
									
									posts[i].likedByMe = currentUserLiked;
									
									return parallelCallback();
								});
							}
							
						}, function(err) {
							if (err) return eachCallback(err);
							
							return eachCallback(null, true);
						});
						
					}, function(err) {
						if (err) return next(err);
						
						var JSONAPIOptions = {
							resourceType: resourceType,
							topLevelLinks: pagingLinks,
							attributes:modelInfo.posts.network,
							dataLinks: {
								self: function (posts,post) {
									return apiEndpoint + post.id;
								}
							}
						};
				
						var meta = {totalRecords: postsCount};
			
						// always camelize the attributes
						JSONAPIOptions.keyForAttribute = function(attribute) {
							return inflection.camelize(attribute, true);
						};
						
						var data = new JSONAPISerializer(JSONAPIOptions.resourceType, JSONAPIOptions).serialize(posts);
						data.meta = meta;
						res.render('network.ejs',{ title: 'Network', posts: data,currentPage:'network', currentUser:req.user});
					});
				} else {
					res.render('network.ejs',{ title: 'Network', posts: {},currentPage:'network', currentUser:req.user});
				}
			});
		},
		
		create: function(req, res, next) {
			var apiBase = req.protocol + '://' + req.get('host') + apiNamespace,
				apiEndpoint = apiBase + '/' + resourceType + '/';
			
			var postObj = {
				createdBy: req.user.id,
				content: req.body.postContent,
				createdOn: moment().format()
			};
			
			app.models.posts_write.create(postObj)
			.exec(function(err, newPost) {
				if (err) next(err);
				  
				var JSONAPIOptions = {
					resourceType: resourceType,
					attributes:modelInfo.posts.me,
					dataLinks: {
						self: function (newPost,post) {
							return apiEndpoint + post.id;
						}
					}
				};
				
				// always camelize the attributes
				JSONAPIOptions.keyForAttribute = function(attribute) {
					return inflection.camelize(attribute, true);
				};
				var data = new JSONAPISerializer(JSONAPIOptions.resourceType, JSONAPIOptions).serialize(newPost);
				
				res.status(200).json(data);
			});
		}
	};
};
"use strict";

var models = require('../models');

exports.addPost = function(req, res) {
	if (req.body.content.length === 0) return res.redirect('/class/' + req.body.classCode);
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		models.Class.findOne({
			where: {
				classCode: req.body.classCode
			}
		}).then(function(Class) {
			models.Post.create({
				content: req.body.content
			}).then(function(Post) {
				Class.addPost(Post).then(function() {
					user.addPost(Post).then(function() {
						return res.redirect('/class/' + req.body.classCode);
					});
				});
			})
		});
	});
};

exports.deletePost_ajax = function(req, res) {
	models.Post.findOne({
		where: {
			id: req.params.postId
		}
	}).then(function(post) {
		if (post.UserId !== req.session.user.id) return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
		models.Post.destroy({
			where: {
				id: req.params.postId
			}
		}).then(function() {
			return res.status(200).end('Post deleted successfully');
		});
	});
}

exports.updatePost_ajax = function(req, res) {
	if (req.body.content.length === 0) return res.status(400).end();
	models.Post.findOne({
		where: {
			id: req.params.postId
		}
	}).then(function(post) {
		if (post.UserId !== req.session.user.id) return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
		models.Post.update({
			content: req.body.content
		}, {
			where: {
				id: req.params.postId
			}
		}).then(function() {
			return res.status(200).end('Post edited successfully');
		});
	});
}

exports.addComment = function(req, res) {

}

exports.deleteComment = function(req, res) {
	
}

exports.updateComment = function(req, res) {
	
}
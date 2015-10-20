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

exports.deletePost = function(req, res) {
	models.Post.findOne({
		where: {
			id: req.body.id
		}
	}).then(function(post) {
		if (post.UserId !== req.session.user.id) return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
		models.Post.destroy({
			where: {
				id: req.body.id
			}
		}).then(function() {
			return res.redirect('/class/' + req.body.classCode);
		});
	});
}

exports.updatePost = function(req, res) {

}

exports.addComment = function(req, res) {

}

exports.deleteComment = function(req, res) {
	
}

exports.updateComment = function(req, res) {
	
}
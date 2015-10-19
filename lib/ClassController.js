"use strict";

var models = require('../models');
var shortid = require('shortid');
var path = require('path');

exports.addClass = function(req, res) {
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		if (user.type === 'student') return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
		else {
			models.Class.create({
				className: req.body.className,
				classCode: shortid.generate()
			}).then(function(Class) {
				user.addClass(Class).then(function(data) {
					console.log('data: ', data);
					return res.redirect('/class/' + Class.classCode);
				});
			});
		}
	});
}

exports.updateClass = function(req, res) {
	var classCode = req.params.classCode;
	models.Class.findOne({
		where: {
			classCode: classCode
		}
	}).then(function(Class) {

	});
}

exports.classPage = function(req, res) {
	var classCode = req.params.classCode;
	models.Class.findOne({
		where: {
			classCode: classCode
		}
	}).then(function(Class) {
		res.end("Class Page");
	});
}
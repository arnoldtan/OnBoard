"use strict";

var path = require('path');
var models = require('../models');
var shortid = require('shortid');

exports.lessonManagementPage = function(req, res) {
	if (req.session.user.type !== 'teacher') return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
	models.Class.findOne({
		where: {
			classCode: req.params.classCode
		}
	}).then(function(Class) {
		return res.render(__dirname + '/../views/lesson_management.ejs', {
			user: req.session.user,
			Class: Class
		});
	});
};

exports.addLesson = function(req, res) {
	if (req.body.lessonName.split(' ').join('').length === 0) return res.status(400);
	models.Lesson.create({
		lessonName: req.body.lessonName,
		lessonUrl: shortid.generate()
	}).then(function(lesson) {
		models.Class.findOne({
			where: {
				classCode: req.params.classCode
			}
		}).then(function(Class) {
			Class.addLesson(lesson).then(function() {
				return res.status(200).end(lesson.dataValues.lessonUrl);
			});
		});
	});
};

exports.loadLesson = function(req, res) {
	if (req.session.user.type === 'teacher') {
		models.Class.findOne({
			where: {
				classCode: req.params.classCode
			}
		}).then(function(Class) {
			models.Lesson.findOne({
				where: {
					lessonUrl: req.params.lessonUrl
				}
			}).then(function(lesson) {
				return res.render(__dirname + '/../views/teacher.ejs', {
					user: req.session.user,
					Class: Class,
					lesson: lesson
				});
			});
		});
	}
	else if (req.session.user.type === 'student') {
		models.Class.findOne({
			where: {
				classCode: req.params.classCode
			}
		}).then(function(Class) {
			models.Lesson.findOne({
				where: {
					lessonUrl: req.params.lessonUrl
				}
			}).then(function(lesson) {
				return res.render(__dirname + '/../views/student.ejs', {
					user: req.session.user,
					Class: Class,
					lesson: lesson
				});
			});
		});
	}
};
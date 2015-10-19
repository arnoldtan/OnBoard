"use strict";

var models = require('../models');
var bcrypt = require('bcrypt');
var shortid = require('shortid');

exports.login = function (req, res) {
    if (req.session.authenticated) return res.redirect('/app');
    models.Teacher.findOne({
        where: { username: req.body.username }
    }).then(function (data) {
        if (!data) {
            return res.redirect('/');
        }
        console.log(req.body, data);
        bcrypt.compare(req.body.password, data.dataValues.password, function (err, match) {
            if (!match) {
                return res.redirect('/');
            }
            req.session.authenticated = true;
            req.session.user = data.dataValues;
            startlesson(req, function () {
                models.Teacher.findOne({
                    where: { username: req.session.user.username }
                }).then(function (data) {
                    req.session.user.url = data.dataValues.url;
                    return res.redirect('/app');
                });
            });
        });
    })
}

exports.logout = function (req, res) {
    endlesson(req, function () {
        req.session.destroy();
        res.redirect('/');
    });
}

exports.signup = function (req, res) {
    if (req.session.authenticated) return res.redirect('/app');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            models.Teacher.create({
                username: req.body.username,
                password: hash
            })
            .then(function (data) {
                return exports.login(req, res);
            })
            .error(function (error) {
                if (error) {
                    console.log(error);
                    return res.redirect('/');
                }
            });
        });
    });
}

exports.app = function (req, res) {
    res.render(__dirname + '/../views/teacher', {
        teacher: req.session.user
    });
}

function startlesson (req, cb) {
    models.Teacher.findOne({
        where: { username: req.session.user.username }
    }).then(function (data) {
        if (data.dataValues.url !== null) return cb();
        models.Teacher.update({
            url: shortid.generate()
        }, {
            where: { username: req.session.user.username }
        }).then(function (data) {
            cb();
        });
    });
}

function endlesson (req, cb) {
    models.Teacher.update({
        url: null
    }, {
        where: { username: req.session.user.username }
    }).then(function (data) {
        cb();
    });
}
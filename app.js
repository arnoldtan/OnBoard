var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var toobusy = require('toobusy');
toobusy.maxLag(10);

var TeacherController = require('./lib/TeacherController.js');
var StudentController = require('./lib/StudentController.js');

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
    store: new RedisStore(),
    secret: 'hzaQt2Yw4zSbUWNpgPHl',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (toobusy()) {
    res.status(503).send("I'm busy right now, sorry.");
  } else {
    next();
  } 
});

app.get('/', function (req, res) {
    if (req.session.authenticated) return res.redirect('/app');
    return res.sendFile(__dirname + '/public/html/index.html');
});

app.post('/login', TeacherController.login);

app.post('/signup', TeacherController.signup);

app.get('/lesson/:random', StudentController.app);

app.use(function (req, res, next) {
   if (!req.session.authenticated) return res.redirect('/');
   else return next();
});

app.get('/logout', TeacherController.logout);

app.get('/app', TeacherController.app);

module.exports = app;
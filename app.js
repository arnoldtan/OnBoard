var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var account_helper = require('./lib/account_helper.js');
var dashboardController = require('./lib/dashboardController.js');
var ClassController = require('./lib/ClassController.js');
var LessonController = require('./lib/LessonController.js');
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

app.get('/', function (req, res) {
  if (req.session.authenticated) return res.redirect('/dashboard');
  return res.sendFile(__dirname + '/public/html/index.html');
});

app.post('/login', account_helper.login);

app.post('/signup', account_helper.signup);

app.use(function (req, res, next) {
  if (!req.session.authenticated) return res.redirect('/');
  else return next();
});

app.get('/dashboard', dashboardController);

app.post('/class/add', ClassController.addClass);

app.post('/class/join', ClassController.joinClass);

app.post('/class/:classCode', ClassController.updateClass);

app.get('/class/:classCode', ClassController.classPage);

app.get('/class/:classCode/lesson/manage', LessonController.lessonManagementPage);

app.get('/class/:classCode/resource', function(req, res) { res.end('Resource Page') });

app.get('/logout', account_helper.logout);

app.all('*', function(req, res) {
	res.status(404).sendFile(__dirname + '/public/html/404.html');
});

module.exports = app;
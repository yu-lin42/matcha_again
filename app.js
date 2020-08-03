var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');

var connection = require('./dbc').connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var signupRouter = require('./routes/signup');
var profileRouter = require('./routes/profile');
var chatRouter = require('./routes/chat');
var resetRouter = require('./routes/reset_password');
var setupProfileRouter = require('./routes/setup_profile');
var settingRouter = require('./routes/setting');
var adminRouter = require('./routes/admin');
var app = express();

const session = expressSession({
	secret: 'much secret',
	resave : false,
	saveUninitialized : false
});

const loginRedirect = (req, res, next) => {
	if (!req.session.userID) {
		res.redirect('/login');
	}
	else {
		next();
	}
};

const loggedInRedirect = (req, res, next) => {
	if (req.session.userID) {
		console.log(req.session.userID);
		res.redirect('/');
	}
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);

app.use('/', indexRouter);
app.use('/users', loginRedirect, usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', loginRedirect, profileRouter);
app.use('/chat', loginRedirect, chatRouter);
app.use('/logout', logoutRouter);
app.use('/setupProfile',loginRedirect, setupProfileRouter);
app.use('/setting', loginRedirect, settingRouter);
app.use('/admin', adminRouter);
app.use('/reset_password', resetRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status);
	if (err.status === 404) {
		res.render('404', {
			title : '404',
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
		});
	}
	else if (err.status === 500) {
		res.render('500', {
			title : '500',
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
		});
	}
});

module.exports = app;
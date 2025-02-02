var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
//require('./routes/auth')(app);

var session = require('express-session');

var paginate = require('express-paginate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(paginate.middleware(10, 50));
app.use('/room/:roomid', express.static(path.join(__dirname, 'public')));
app.use('/edit/:roomid', express.static(path.join(__dirname, 'public')));
app.use('/rooms/:page', express.static(path.join(__dirname, 'public')));
app.use('/result', express.static(path.join(__dirname, 'public')));

//app.use(express.session());
app.use(session({ 
  secret: 'xadfj_fin43d',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

//app.use(app.router);

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
  res.status(err.status || 500);
  res.render('error');
});

// passport config
var Customer = require('./models/customers.js');
passport.use(new LocalStrategy(Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost:27017/hotel');

module.exports = app;

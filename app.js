var dotev = require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var app = express();
var fileUpload=require('express-fileupload')
const connection = require('./config/connection');
var session = require('express-session')
var userHelpers = require('./helpers/user-helpers');
const helpers = require('./config/handlebars-helpers');
const Razorpay = require('razorpay');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Set the view engine to 'handlebars'
app.engine('hbs', hbs({
  extname:'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    helpers: helpers
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


app.use(session({secret:'key',
resave: false,
saveUninitialized: true,
cookie:{maxAge:60000000}}))

 

app.use('/', usersRouter);
app.use('/admin', adminRouter);

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

module.exports = app;

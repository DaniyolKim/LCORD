var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

/*const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbUrl = 'mongodb+srv://daniel:4728eodjs@lcodercluster-ylbsj.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(dbUrl, { useMongoClient: true })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));*/


var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});
const dbUrl = 'mongodb+srv://daniel:4728eodjs@lcodercluster-ylbsj.mongodb.net/lcordDB?retryWrites=true&w=majority'
mongoose.connect(dbUrl, { useMongoClient: true });

// DEFINE MODEL
var User = require('./models/user');
var router = require('./routes/users')(app, User);

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

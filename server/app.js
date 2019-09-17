let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
let corsOptions = {
  origin: '*',
  withCredentials: true
}
app.use(cors(corsOptions))

let indexRouter = require('./routes/index');
app.use('/', indexRouter);

let usersRouter = require('./routes/users');
app.use('/users', usersRouter);

let authRouter = require('./routes/auth');
app.use('/auth', authRouter);

let mongoose = require('mongoose');
let db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

/*mongo db conncet*/
const dbUrl = 'mongodb+srv://daniel:4728eodjs@lcodercluster-ylbsj.mongodb.net/lcordDB?retryWrites=true&w=majority'
mongoose.connect(dbUrl, { useMongoClient: true });

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

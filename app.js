var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var MongoClient = require('mongodb').MongoClient;

var mongo = require('mongodb');
var monk = require('monk');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// var mongo_URI = 'mongodb://<dbuser>:<dbpassword>@ds049084.mongolab.com:49084/heroku_1mhfcj30';
// var db = MongoClient.connect(mongo_URI, function(error, db_connect) {
//         db = db_connect;
// });

var dbURI = process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || process.env.MONGOHQ_URL || 'localhost:27017/lcsjcode'
var db = monk(dbURI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/allgroups.json', function(req, res) {
  db.collection('Groups', function(error, collection) {
    collection.find().toArray(function(err, docs) {
      res.json(docs);
    });
  });
});

app.get('/groups.json', function(req, res) {
  var query = {
    "location": req.query.location,
    "time_commitment": req.query.time_commitment,
    "semester": req.query.semester,
    "client": req.query.client,
    "area": req.query.area
  };

  db.collection('Groups', function(error, collection) {
    collection.find(query).toArray(function(err, docs) {
      res.json(docs);
    });
  });
});

module.exports = app;

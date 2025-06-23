var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
require('dotenv').config()//Este require nos permitirá cargar las variables de entorno


//Legacy: Esta conexión nos permitirá acceder a la db si corremos el servidor node.js en local fuera de un contenedor y la mongodb en un contendor
//mongoose.connect('mongodb://'+process.env.MONGO_INITDB_ROOT_USERNAME+':'+process.env.MONGO_INITDB_ROOT_PASSWORD+'@localhost:27017',{dbName: 'versionsdb'})
//Esta conexion nos permitirá acceder a la db usando el alias del contenedor de la mongo(Despliegue usando docker-compose)
mongoose.connect('mongodb://'+process.env.MONGO_INITDB_ROOT_USERNAME+':'+process.env.MONGO_INITDB_ROOT_PASSWORD+'@'+process.env.MONGO_CONNECTION_DOCKER+':27017',{dbName: 'versionsdb'})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



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

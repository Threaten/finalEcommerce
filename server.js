var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsmate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var connectMongo = require('connect-mongo/es5')(session);
var passport = require('passport');
var cart = require('./middlewares/middlewares');

//config
var config = require('./config/config');

//schema
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

mongoose.connect(config.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

/* Middleware */
app.use(express.static(__dirname + '/'));
//Morgan
app.use(morgan('dev'));
//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.key,
  store: new connectMongo({ url: config.database, autoReconnect: true})
}));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
//globalize user variable
app.use(function(req, res, cb) {
  res.locals.user = req.user;
  cb();
});
//cart middleware
app.use(cart);
//
app.use(function(req, res, cb) {
  Category.find( {}, function(err, categories) {
    if (err) return cb(err);
    res.locals.categories = categories;
    cb();
  })
});
//ejs
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');

//Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is running on port " + config.port);
});

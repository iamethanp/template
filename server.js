const express = require('express');
const expressSession = require('express-session');
const sharedSession = require('express-socket.io-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const mongodb = require('./config/mongodb.js');
mongoose.connect(mongodb.url, {useNewUrlParser: true, useUnifiedTopology: true});
const MongoStore = require('connect-mongo')(expressSession);
const sessionMiddleware = expressSession({
  secret: 'test',
  resave: true,
  cookie: {maxAge:1000*60*60*24*14},
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
})
const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/public', express.static('public'));
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
const server = app.listen(3000);
const io = require('socket.io')(server, {reconnection: false});
io.use(sharedSession(sessionMiddleware, {autoSave: true}));
require('./app/routes.js')(app, passport);
require('./config/socket-io.js')(io);
require('./config/passport')(passport);

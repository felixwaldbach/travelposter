var express = require('express');

var session = require('express-session');

var cors = require('cors');

var bodyParser = require('body-parser');

var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');


var app = express();

app.use(cors());
app.use(express.json());
app.use(session({secret: 'shhhh', resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/post', postRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var postRouter = require('./routes/post');

var app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

app.set('view engine', 'jade');

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

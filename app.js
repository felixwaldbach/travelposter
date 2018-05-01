var express = require('express');

var session = require('express-session');

var cors = require('cors');

var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var databaseutils = require('./database');
var commonutils = require('./commonutils');

var app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    async function (username, password, done) {
        let user = await databaseutils.findUser(username, commonutils.hash(password));
        if (!user || user.password != commonutils.hash(password)) {
            console.log("Credentials Not correct!");
            return done(null, false);
        }
        return done(null, user);
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/user/login',
    passport.authenticate('local'),
    function (req, res, err) {
        console.log("Logging in..");
        if (err) res.send({user: false});
        console.log(req.user);
        req.session.user = req.user;
        res.send(true);
    }
);

app.post("/api/user/register", async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.send('error');
    } else {
        let rand = Math.floor((Math.random() * 100) + 54);
        await commonutils.sendRegisterMail(rand, req.body.name, req.body.email);
        await databaseutils.unverifiedRegister(req.body.email, req.body, rand);
        res.send('unverified register correct');
    }
});

app.post('/post/add', commonutils.ensureAuthenticated, async function (req, res, next) {
    await databaseutils.addPost(req.body.username, req.body.title, req.body.content);
    res.send('post correct');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

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

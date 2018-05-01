var express = require('express');
var router = express.Router();

var databaseutils = require('../database');
var commonutils = require('../commonutils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login @ travelposter' });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register @ travelposter' });
});

router.get('/index', commonutils.ensureAuthenticated, function(req, res, next) {
    // if logged in
    res.render('index', { title: 'Register @ travelposter' });
});

router.get('/visit/:username', commonutils.ensureAuthenticated, function(req, res, next) {
    // view travel blog of user
});


router.get("/api/user/verify", async function (req, res) {
    let unverifiedUser = await databaseutils.findUnverifiedUser(req.query.name, req.query.id);
    if(!unverifiedUser) res.render('error');
    else databaseutils.register(unverifiedUser.email, unverifiedUser.name, res);
});

module.exports = router;

var express = require('express');
var router = express.Router();

var databaseutils = require('../database');
var commonutils = require('../commonutils');
var sessionutils = require('../sessionutils');

/* GET home page. */
router.get('/', function (req, res, next) {
    if(!sessionutils.getSession()) res.send({page: 0}); // 0 for page login in frontend
    else res.send({page: 10}); // 10 for page index in frontend
});

router.get('/register', function (req, res, next) {
    res.send("Under construction");
});

router.get('/index', /*commonutils.ensureAuthenticated,*/ function (req, res, next) {
    if(!sessionutils.sess) res.send({page: 0}); // 0 for page login in frontend
    else res.send({message: "Welcome " + sessionutils.sess.name}); // 10 for page login in frontend
});

router.get('/visit/:name', /*commonutils.ensureAuthenticated,*/ async function (req, res, next) {
    let user = await databaseutils.findUserByUsername(req.params.name);
    res.send(user);
});

module.exports = router;

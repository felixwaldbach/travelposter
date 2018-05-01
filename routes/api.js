var express = require('express');
var router = express.Router();

router.get('/user/login', function(req, res, next) {
    // do login backend stuff
});

router.get('/user/register', function (req, res, next) {
    // do register backend stuff
});

router.get('/user/logout', function (req, res, next) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

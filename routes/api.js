var express = require('express');
var router = express.Router();


var databaseutils = require('../database');
var commonutils = require('../commonutils');
var sessionutils = require('../sessionutils');

router.post('/user/login',
    async function (req, res, err) {
        let user = await databaseutils.findUser(req.body.name, commonutils.hash(req.body.password));
        if (!user || user.password != commonutils.hash(req.body.password)) {
            console.log("Credentials Not correct!");
        } else {
            let sess = req.session;
            sess.name = req.body.name;
            sessionutils.sess = sess;
            res.send({page: 10});
        }
    }
);

router.post("/user/register", async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.send('error');
    } else {
        let rand = Math.floor((Math.random() * 100) + 54);
        await commonutils.sendRegisterMail(rand, req.body.name, req.body.email);
        await databaseutils.unverifiedRegister(req.body.email, req.body, rand);
        res.send('unverified register correct');
    }
});

router.get("/user/verify", async function (req, res) {
    let unverifiedUser = await databaseutils.findUnverifiedUser(req.query.name, req.query.id);
    if (!unverifiedUser) res.render('error');
    else databaseutils.register(unverifiedUser.email, unverifiedUser.name, res);
});

router.get('/user/logout', function (req, res, next) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

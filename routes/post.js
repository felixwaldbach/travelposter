var express = require('express');
var router = express.Router();

var databaseutils = require('../database');

router.post('/add', /*commonutils.ensureAuthenticated,*/ async function (req, res, next) {
    console.log("Posting");
    await databaseutils.addPost(req.body.username, req.body.title, req.body.content);
    res.send('post correct');
});

router.get('/get/all', /*commonutils.ensureAuthenticated,*/ async function (req, res, next) {
    let posts = await databaseutils.findAllPosts();
    res.send(posts);
});

router.get('/get/:name', /*commonutils.ensureAuthenticated,*/ async function (req, res, next) {
    let posts = await databaseutils.findPostsByUsername(req.params.name);
    console.log(posts);
    res.send(posts);
});

module.exports = router;
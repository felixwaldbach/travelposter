var express = require('express');
var router = express.Router();

var databaseutils = require('../database');

var formidable = require('formidable');
var fs = require('fs');

router.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.path;
        var filename = 'img_' + Date.now() + '_' + files.image.name;
        var newpath = './uploads/' + filename;
        fs.rename(oldpath, newpath, async function (err) {
            if (err) throw err;
            await databaseutils.addPost(req.body.name, oldpath, newpath, filename);
            res.write('File uploaded and moved!');
            res.end();
        });
    });
});

router.get('/get/all', async function (req, res) {
    console.log("Getting posts");
    let posts = await databaseutils.findAllPosts();
    res.send({posts: posts});
});

module.exports = router;
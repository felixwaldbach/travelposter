var express = require('express');
var router = express.Router();

var databaseutils = require('../database');

var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');

router.post('/fileupload', function (req, res) {
    decodeAndWriteFile(req.body.file, function(filename) {
        databaseutils.addPost(req.body.name, filename);

        res.send({
            error: false,
            post: {
                name: req.body.name,
                filename: filename
            }
        });
    });
});

async function decodeAndWriteFile(encodedData, callback) {
    var decodedData = Buffer.from(encodedData, "base64");
    var filename = crypto.createHash("md5").update((+ new Date()).toString()).digest("hex");

    fs.writeFile("storage/" + filename + ".png", decodedData, function(error) {
        if(error) {
            //res.send({
                //error: true,
                //message: "File could not be written to disk. Please contact admin."
            //});
            console.log(error);
        }
    });

    callback(filename);
}

        
    

router.get('/get/all', async function (req, res) {
    console.log("Getting posts");
    let posts = await databaseutils.findAllPosts();
    res.send({posts: posts});
});

module.exports = router;

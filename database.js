const mongoUrl = "mongodb://127.0.0.1:27017/";
const {MongoClient} = require("mongodb");

const addPost = (name, filename) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            var newPost = {
                name: name,
                filename: filename
            }
            dbo.collection("posts").insertOne(newPost, function (err, res) {
                if (err) {
                    db.close();
                    throw err;
                }
                db.close();
                resolve(res);
            });
        });
    });
};

const findAllPosts = () =>
    new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo
                .collection("posts")
                .find({})
                .toArray(function (err, res) {
                    if (err) throw err;
                    resolve(res);
                });
        });
    });

module.exports = {
    addPost,
    findAllPosts
};

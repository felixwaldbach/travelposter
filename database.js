const mongoUrl = "mongodb://127.0.0.1:27017/";
const {MongoClient} = require("mongodb");
const utils = require("./commonutils");

const findUser = (name, password) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo.collection("users").findOne({
                $or: [
                    {
                        name,
                        password
                    },
                    {
                        name: name,
                        password
                    }
                ],
                verified: true
            }, function (err, result) {
                if (err) {
                    db.close();
                    resolve(null);
                }
                db.close();
                resolve(result);
            });
        });
    });
};

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo.collection("users").findOne({
                $or: [
                    {
                        name,
                        password
                    },
                    {
                        name: name,
                        password
                    }
                ],
                verified: true
            }, function (err, result) {
                if (err) {
                    db.close();
                    resolve(null);
                }
                db.close();
                resolve(result);
            });
        });
    });
};

const register = (email, name) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo.collection("users").findOne({$or: [{email}, {name: name}]}, {}, (err, res) => {
                let saver = res;
                dbo.collection("users").deleteOne({name: res.name}, (err, res) => {
                    if (err) throw error;
                    console.log("Successfully deleted");
                });
                if (saver.verified === false) {
                    var newUser = {
                        email: saver.email,
                        name: saver.name,
                        password: saver.password,
                        verified: true
                    };
                    dbo.collection("users").insertOne(newUser, function (err, res) {
                        if (err) {
                            db.close();
                            throw err;
                        }
                        db.close();
                        resolve(res);
                    });
                } else {
                    db.close();
                    resolve(res);
                }
            });
        });
    });
};

const unverifiedRegister = (email, body, rand) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo.collection("users").findOne({$or: [{email}, {name: body.name}]}, {}, (err, res) => {
                if (res === null) {
                    var newUser = {
                        email: body.email,
                        name: body.name,
                        password: utils.hash(body.password),
                        verified: false,
                        rand: rand
                    };
                    dbo.collection("users").insertOne(newUser, function (err, res) {
                        if (err) {
                            db.close();
                            throw err;
                        }
                        db.close();
                        resolve(res);
                    });
                } else {
                    db.close();
                    resolve(res);
                }
            });
        });
    });
};

const addPost = (username, title, content) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            var newPost = {
                author: username,
                title: title,
                content: content
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

const findUnverifiedUser = (name, rand) =>
    new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo
                .collection("users")
                .findOne({verified: false}, {email: 1, saveBody: 1}, (err, res) => {
                    if (err) {
                        db.close();
                        reject(err);
                    }
                    db.close();
                    resolve(res);
                });
        });
    });

const findUserByUsername = (name) =>
    new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo
                .collection("users")
                .findOne({name: name}, (err, res) => {
                    if (err) {
                        db.close();
                        reject(err);
                    }
                    db.close();
                    resolve(res);
                });
        });
    });

const findPostsByUsername = (name) =>
    new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo
                .collection("posts")
                .findOne({author: name}, (err, res) => {
                    if (err) {
                        db.close();
                        reject(err);
                    }
                    db.close();
                    resolve(res);
                });
        });
    });

const findAllPosts = () =>
    new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db("travelposter");
            dbo
                .collection("posts")
                .find({})
                .toArray(function(err, res) {
                    if (err) throw err;
                    resolve(res);
                });
        });
    });

module.exports = {
    findUser,
    login,
    register,
    unverifiedRegister,
    addPost,
    findUnverifiedUser,
    findUserByUsername,
    findPostsByUsername,
    findAllPosts
};
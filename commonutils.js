const crypto = require("crypto");
const nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "thetravelposterverificator",
        pass: "Travel1."
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(false);
}

function hash(block) {
    return crypto
        .createHash("sha256")
        .update(block)
        .digest("hex");
};

async function sendRegisterMail(rand, name, email) {
    let link = "http://localhost:3000/api/user/verify?id=" + rand + "&name=" + name;
    let mailOptions = {
        to: email,
        subject: "Please verify your new Account for Travelposter",
        html: "Dear new user, <br> Welcome to the crew! We wish you happy posting and hope you will have fun on our platform. But" +
        " first of all we need you to confirm your registration by clicking on the following link: <br><a href=" + link + ">Click" +
        " here to verify </a> <br> Thank you and best regards, <br> The Golddigger Gang"
    };

    smtpTransport.sendMail(mailOptions, function (err, res) {
        if (err) throw err;
        console.log("Message sent");
    });
}

module.exports = {
    hash,
    sendRegisterMail,
    ensureAuthenticated
};
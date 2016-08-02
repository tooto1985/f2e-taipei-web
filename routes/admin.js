var mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../db");
var adminDb = new Db(mongodbUri, "admin");
var FB = require('fb');
var express = require("express");
var router = express.Router();
var session = require("express-session");
router.use(session({
    secret: "secret",
    cookie: {
        maxAge: new Date(Date.now() + (60 * 1000 * 30))
    }
}));
router.get("/", function(req, res) {
    var token = req.cookies.accessToken;
    FB.setAccessToken(token);
    FB.api('/me', function(response) {
        if (!response || response.error) {
            res.redirect("/");
        }
        else {
            adminDb.select({
                fbid: response.id
            }, function(data) {
                if (data.length === 1) {
                    req.session["admin"] = true;
                    res.redirect("/admin/user");
                }
                else {
                    res.redirect("/");
                }
            }, function() {
                res.redirect("/");
            });
        }
    });
});
router.get("/user", function(req, res) {
    if (req.session["admin"]) {
        res.render("admin/user", {
            layout: "admin",
            menu: "user"
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/booklist", function(req, res) {
    if (req.session["admin"]) {
        res.render("admin/booklist", {
            layout: "admin",
            menu: "booklist"
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join", function(req, res) {
    if (req.session["admin"]) {
        res.render("admin/join", {
            layout: "admin",
            menu: "join"
        });
    }
    else {
        res.redirect("/");
    }
});
module.exports = router;
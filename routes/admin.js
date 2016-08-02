var mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../modules/db");
var adminDb = new Db(mongodbUri, "admin");
var isAdmin = require("../modules/isAdmin");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        if (isAdmin) {
            req.session["admin"] = true;
            res.redirect("/admin/user");
        }
        else {
            res.redirect("/");
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
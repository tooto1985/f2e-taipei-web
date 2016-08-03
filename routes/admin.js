var mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../modules/db");
var joinDb = new Db(mongodbUri, "join");
var tools = require("../modules/tools");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
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
        joinDb.select({
            $query: {},
            $orderby: {
                date: -1
            }
        }, function(data) {
            res.render("admin/join", {
                layout: "admin",
                menu: "join",
                data: data
            });
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join/delete/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.remove(req.params.id, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join/reject/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.update(req.params.id, {
            isRead: true,
            isShow: false
        }, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join/resolve/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.update(req.params.id, {
            isRead: true,
            isShow: true
        }, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join/reset/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.update(req.params.id, {
            isRead: false,
            isShow: false
        }, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
router.get("/join/edit/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.select({
            _id: joinDb.id(req.params.id)
        }, function(data) {
            res.render("admin/join-edit",{
                layout: "admin",
                menu: "join",
                data: data[0],
                date: tools.getLocalDate(new Date(data[0].date)),
                time: tools.getLocalTime(new Date(data[0].date))
            });
        }, function() {
            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }

});
module.exports = router;
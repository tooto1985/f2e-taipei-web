var tools = require("../modules/tools");
var Db = require("../modules/db");
var joinDb = new Db(tools.mongodbUri, "join");
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
        res.redirect("/admin");
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
        res.redirect("/admin");
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
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
    }
});
router.get("/join/delete/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.remove(req.params.id, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
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
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
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
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
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
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
    }
});
router.get("/join/edit/:id", function(req, res) {
    if (req.session["admin"]) {
        joinDb.select({
            _id: joinDb.id(req.params.id)
        }, function(data) {
            res.render("admin/join-edit", {
                layout: "admin",
                menu: "join",
                data: data[0],
                date: tools.getLocalDate(new Date(data[0].date)),
                time: tools.getLocalTime(new Date(data[0].date))
            });
        }, function() {
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
    }
});
router.post("/join/edit/:id", function(req, res) {
    if (req.session["admin"]) {
        var updateObject = {
            $set: {
                date: new Date(req.body.date + " " + req.body.time).getTime(),
                host: req.body.host.split(","),
                user: req.body.user !== "" ? req.body.user.split(",") : [],
                note: req.body.note
            }
        };
        if (req.body.max) {
            updateObject.$set.max = parseInt(req.body.max, 10);
        }
        else {
            updateObject.$unset = {
                max: 1
            };
        }
        joinDb.update(joinDb.id(req.params.id), updateObject, function() {
            res.redirect("/admin/join");
        }, function() {
            res.redirect("/admin");
        });
    }
    else {
        res.redirect("/admin");
    }
});
module.exports = router;
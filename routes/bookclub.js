var mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../modules/db");
var joinDb = new Db(mongodbUri, "join");
var listDb = new Db(mongodbUri, "booklist");
var tools = require("../modules/tools");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("bookclub", {
            menu: "bookclub",
            isAdmin: isAdmin
        });
    });
});
router.get("/list", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        listDb.select({}, function(data) {
            res.render("bookclub/list", {
                menu: "bookclub",
                data: data,
                isAdmin: isAdmin
            });
        }, function() {
            res.redirect("/");
        });
    });
});
router.get("/join", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        joinDb.select({
            date: {
                $gt: new Date().getTime()
            },
            isShow: true
        }, function(data) {
            res.render("bookclub/join", {
                menu: "bookclub",
                data: data,
                isHistory: false,
                isAdmin: isAdmin
            });
        }, function() {
            res.redirect("/");
        });
    });
});
router.get("/history", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        joinDb.select({
            $query: {
                date: {
                    $lte: new Date().getTime()
                },
                isShow: true
            },
            $orderby: {
                date: -1
            }
        }, function(data) {
            res.render("bookclub/join", {
                menu: "bookclub",
                data: data,
                isHistory: true,
                isAdmin: isAdmin
            });
        }, function() {
            res.redirect("/");
        });
    });
});
router.get("/join/:id/:type", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin, response) {
        if (!response || response.error) {
            res.json(false);
        }
        else {
            joinDb.select({
                _id: joinDb.id(req.params.id)
            }, function(data) {
                var user = data[0].user;
                var index = user.indexOf(response.id);
                var hasValue = index > -1;
                if (req.params.type === "join") {
                    if (!hasValue && (!data[0].max || (data[0].max && user.length + 1 <= data[0].max))) {
                        user.push(response.id);
                    }
                    else {
                        res.json(false);
                        return;
                    }
                }
                if (req.params.type === "leave") {
                    if (hasValue) {
                        user.splice(index, 1);
                    }
                    else {
                        res.json(false);
                        return;
                    }
                }
                joinDb.update(req.params.id, {
                    user: user
                }, function() {
                    res.json(true);
                }, function(data) {
                    console.log(data);
                    res.json(false);
                });
            }, function() {
                res.json(false);
            });
        }
    });
});
router.get("/create", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin, response) {
        if (!response || response.error) {
            res.redirect("/bookclub/join");
        }
        else {
            var min = tools.getLocalDate(new Date());
            var wed = new Date();
            var max = new Date();
            do {
                wed.setDate(wed.getDate() + 1);
            } while (wed.getDay() !== 3);
            wed = tools.getLocalDate(wed);
            max.setMonth(max.getMonth() + 1);
            max = tools.getLocalDate(max);
            res.render("bookclub/create", {
                menu: "bookclub",
                data: null,
                isHistory: false,
                min: min,
                wed: wed,
                max: max,
                isAdmin: isAdmin
            });
        }
    });
});
router.post("/create", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin, response) {
        if (!response || response.error) {
            res.redirect("/bookclub/join");
        }
        else {
            var joinObject = {
                date: new Date(req.body.date + " " + req.body.time).getTime(),
                note: req.body.note,
                host: [response.id],
                user: [],
                max: parseInt(req.body.max, 10),
                isRead: false,
                isShow: false
            };
            joinDb.insert(joinObject, function() {
                res.render("bookclub/created", {
                    menu: "bookclub",
                    message: "我們將會盡快審核，謝謝您的熱情參與！",
                    isAdmin: isAdmin
                });
            }, function() {
                res.render("bookclub/created", {
                    menu: "bookclub",
                    message: "由於技術上的問題發生錯誤，請與系統管理員聯絡，謝謝！",
                    isAdmin: isAdmin
                });
            });
        }
    });
});
module.exports = router;
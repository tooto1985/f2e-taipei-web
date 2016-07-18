var FB = require('fb');
var fs = require("fs");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    res.render("bookclub", {
        menu: "bookclub"
    });
});
router.get("/list", function(req, res) {
    fs.readFile("./data/booklist.json", "utf8", function(err, data) {
        if (!err) {
            data = JSON.parse(data);
            res.render("bookclub/list", {
                menu: "bookclub",
                data: data
            });
        }
        else {
            res.redirect("/");
        }
    });
});
router.get("/join", function(req, res) {
    fs.readFile("./data/join.json", "utf8", function(err, data) {
        if (!err) {
            data = JSON.parse(data);
            data = data.filter(function(a) {
                return new Date().getTime() < a.date;
            });
            res.render("bookclub/join", {
                menu: "bookclub",
                data: data,
                isHistory: false
            });
        }
        else {
            res.redirect("/");
        }
    });
});
router.get("/history", function(req, res) {
    fs.readFile("./data/join.json", "utf8", function(err, data) {
        if (!err) {
            data = JSON.parse(data);
            data = data.filter(function(a) {
                return new Date().getTime() >= a.date;
            });
            res.render("bookclub/join", {
                menu: "bookclub",
                data: data,
                isHistory: true
            });
        }
        else {
            res.redirect("/");
        }
    });
});
router.get("/join/:date/:type", function(req, res) {
    var token = req.cookies.accessToken;
    FB.setAccessToken(token);
    FB.api("/me", function(response) {
        if (!response || response.error) {
            res.json(false);
        }
        else {
            fs.readFile("./data/join.json", "utf8", function(err, data) {
                if (!err) {
                    data = JSON.parse(data);
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].date === parseInt(req.params.date)) {
                            var user = data[i].user;
                            var index = user.indexOf(response.id);
                            var hasValue = index > -1;
                            if (req.params.type === "join" && !hasValue) {
                                user.push(response.id);
                            }
                            if (req.params.type === "leave" && hasValue) {
                                user.splice(index, 1);
                            }
                            fs.writeFile("./data/join.json", JSON.stringify(data, null, 4), "utf8", function(err) {
                                if (!err) {
                                    res.json(true);
                                }
                                else {
                                    res.json(false);
                                }
                            });
                        }
                    }
                }
                else {
                    res.json(false);
                }
            });
        }
    });
});
module.exports = router;
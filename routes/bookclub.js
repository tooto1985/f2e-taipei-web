var FB = require('fb');
var fs = require("fs");
var bodyParser = require("body-parser");
var express = require("express");
var router = express.Router();
router.use(bodyParser());
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
                                if (!data[i].max || (data[i].max && data[i].user.length + 1 <= data[i].max)) {
                                    user.push(response.id);
                                }
                                else {
                                    res.json(false);
                                    return;
                                }
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
router.get("/create", function(req, res) {
    var min = new Date().toISOString().split("T")[0];
    var wed = new Date();
    var max = new Date();
    do {
        wed.setDate(wed.getDate() + 1);
    } while (wed.getDay() !== 3);
    wed = wed.toISOString().split("T")[0];
    max.setMonth(max.getMonth() + 1);
    max = max.toISOString().split("T")[0];
    res.render("bookclub/create", {
        menu: "bookclub",
        data: null,
        isHistory: false,
        min: min,
        wed: wed,
        max: max
    });
});
router.post("/create", function(req, res) {
    console.log(req.body);
    res.render("bookclub/created", {
        menu: "bookclub"
    });
});
module.exports = router;
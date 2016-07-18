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
            res.render("bookclub/join", {
                menu: "bookclub",
                data: data
            });
        }
        else {
            res.redirect("/");
        }
    });
});
router.get("/join/:date/:id/:type", function(req, res) {
    console.log(req.params.date,req.params.id,req.params.type);
    res.json(true);
});
module.exports = router;
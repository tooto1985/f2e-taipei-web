var FB = require('fb');
var fs = require("fs");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    fs.readFile("./data/admin.json", "utf8", function(err, data) {
        if (!err) {
            data = JSON.parse(data);
            var token = req.cookies.accessToken;
            FB.setAccessToken(token);
            FB.api('/me', function(response) {
                if (!response || response.error || data.indexOf(response.id) === -1) {
                    res.redirect("/");
                }
                else {
                    res.render("admin", {
                        layout: false
                    });
                }
            });
        }
        else {
            res.redirect("/");
        }
    });
});
module.exports = router;
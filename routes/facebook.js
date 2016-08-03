var isAdmin = require("../modules/isAdmin");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("facebook", {
            menu: "facebook",
            isAdmin: isAdmin
        });
    });
});
module.exports = router;
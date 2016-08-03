var isAdmin = require("../modules/isAdmin");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("slack", {
            menu: "slack",
            isAdmin: isAdmin
        });
    });
});
module.exports = router;
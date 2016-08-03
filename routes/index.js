var tools = require("../modules/tools");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("index", {
            menu: "index",
            isAdmin: isAdmin
        });
    });
});
module.exports = router;
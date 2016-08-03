var tools = require("../modules/tools");
var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    tools.isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("slack", {
            menu: "slack",
            isAdmin: isAdmin
        });
    });
});
module.exports = router;
var path = require("path");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
//var logger = require('express-logger');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var isAdmin = require("./modules/isAdmin");
var admin = require("./routes/admin");
var bookclub = require("./routes/bookclub");
var app = express();
app.use(session({
    secret: "secret",
    cookie: {
        maxAge: new Date(Date.now() + (60 * 1000 * 30))
    }
}));
app.use(bodyParser());
app.use(cookieParser());
//app.use(logger({path: "/path/to/logfile.txt"}));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("index", {
            menu: "index",
            isAdmin: isAdmin
        });
    });
});
app.use("/bookclub", bookclub);
app.get("/facebook", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("facebook", {
            menu: "facebook",
            isAdmin: isAdmin
        });
    });
});
app.get("/slack", function(req, res) {
    isAdmin(req.cookies.accessToken, function(isAdmin) {
        res.render("slack", {
            menu: "slack",
            isAdmin: isAdmin
        });
    });
});
app.use("/admin", admin);
app.listen(3000);
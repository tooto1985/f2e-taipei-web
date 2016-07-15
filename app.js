var path = require("path");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var logger = require('express-logger');
var app = express();
app.use(logger({path: "/path/to/logfile.txt"}));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,"public")));
app.get("/", function(req,res) {
    res.render("index", {menu:"index"});
});
app.get("/bookclub", function(req,res) {
    res.render("bookclub", {menu:"bookclub"});
});
app.get("/facebook", function(req,res) {
    res.render("facebook", {menu:"facebook"});
});
app.get("/slack", function(req,res) {
    res.render("slack", {menu:"slack"});
});
app.listen(3000);
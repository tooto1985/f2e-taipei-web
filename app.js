var path = require("path");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
//var logger = require('express-logger');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var index = require("./routes/index");
var bookclub = require("./routes/bookclub");
var facebook = require("./routes/facebook");
var slack = require("./routes/slack");
var admin = require("./routes/admin");
var app = express();
app.use(session({
    secret: "secret",
    cookie: {
        maxAge: 60 * 1000 * 30
    },
    rolling: true
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
app.use("/", index);
app.use("/bookclub", bookclub);
app.use("/facebook", facebook);
app.use("/slack", slack);
app.use("/admin", admin);
app.listen(3000);
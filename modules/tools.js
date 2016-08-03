exports.mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../modules/db");
var adminDb = new Db(exports.mongodbUri, "admin");
var FB = require('fb');
exports.isAdmin = function(token, callback) {
    FB.setAccessToken(token);
    FB.api('/me', function(response) {
        if (response && !response.error) {
            adminDb.select({
                fbid: response.id
            }, function(data) {
                if (data.length === 1) {
                    callback(true, response);
                }
                else {
                    callback(false, response);
                }
            }, function() {
                callback(false, response);
            });
        }
        else {
            callback(false);
        }
    });
};
exports.getLocalDate = function(date) {
    var a = date.toLocaleDateString().split("/");
    a = a.map(function(a) {
        return parseInt(a, 10);
    });
    return a[2] + "-" + (a[0] < 10 ? "0" : "") + a[0] + "-" + (a[1] < 10 ? "0" : "") + a[1];
};
exports.getLocalTime = function(date) {
    return (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":" + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
};

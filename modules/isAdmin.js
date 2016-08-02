var mongodbUri = "mongodb://127.0.0.1/f2e-taipei";
var Db = require("../modules/db");
var adminDb = new Db(mongodbUri, "admin");
var FB = require('fb');
module.exports = function(token, callback) {
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
}
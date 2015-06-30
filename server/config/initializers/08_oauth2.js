var oauth2 = require('sycle-component-oauth2');

module.exports = function () {

    oauth2(this.express, {
        "loginPage": "/login",
        "loginPath": "/login",
        "addHttpHeaders": "X-"
    });

};

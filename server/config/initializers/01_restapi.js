module.exports = function (c) {
    var app = c.app;
    var restApiRoot = app.get('restApiRoot');
    app.middleware('routes:before', restApiRoot, require('copress-rest')(c.sapp));
};

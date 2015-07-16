module.exports = function (c) {
    var app = c.app;
    var explorer;
    try {
        explorer = require('copress-explorer');
    } catch(err) {
        console.log(
            'Run `npm install copress-explorer` to enable the Copress explorer'
        );
        return;
    }

    var restApiRoot = app.get('restApiRoot');

    var explorerApp = explorer(app.sapp, { basePath: restApiRoot });
    app.middleware('routes:before','/explorer', explorerApp);
    c.once('ready', function() {
        var baseUrl = app.get('url').replace(/\/$/, '');
        // express 4.x uses `mountpath`
        // express 3.x uses `route`
        var explorerPath = explorerApp.mountpath || explorerApp.route;
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    });
};

module.exports = function () {
    var explorer;
    try {
        explorer = require('sycle-express-explorer');
    } catch(err) {
        console.log(
            'Run `npm install sycle-express-explorer` to enable the Sycle explorer'
        );
        return;
    }

    var restApiRoot = this.get('restApiRoot');

    var explorerApp = explorer(this.sapp, { basePath: restApiRoot });
    this.use('/explorer', explorerApp);
    this.once('ready', function() {
        var baseUrl = this.get('url').replace(/\/$/, '');
        // express 4.x uses `mountpath`
        // express 3.x uses `route`
        var explorerPath = explorerApp.mountpath || explorerApp.route;
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    });
};

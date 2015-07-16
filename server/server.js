var async = require('async')
    , http = require('http')
    , https = require('https')
    , sslCert = require('./private/ssl_cert');

var httpsOptions = {
    key: sslCert.privateKey,
    cert: sslCert.certificate
};

var isMain = !module.parent || module.parent.isApplicationLoader;

/**
 * Server module exports method returning new instance of app.
 *
 * @param {Object} params - compound/express webserver initialization params.
 * @returns Copress powered express instantiate
 */
var instantiate = module.exports = function instantiate(params) {
    params = params || {};
    // specify current dir as default root of server
    params.root = params.root || __dirname;
    return require('copress').createServer(params);
};

if (!module.parent || module.parent.isApplicationLoader) {
    var port = process.env.PORT || 3000;
    var host = process.env.HOST || '0.0.0.0';

    var app = instantiate();
    app.compound.boot(function (err) {
        if (err) {
            console.trace(err);
            throw err;
        }
        app.listen(port, host, function () {
            console.log('Copress server listening on http://%s:%d within %s environment', host, port, app.set('env'));
        });
    });
}
var witty = require('witty')
    , async = require('async')
    , http = require('http')
    , https = require('https')
    , bootable = require('bootable')
    , sslCert = require('./private/ssl_cert');

var httpsOptions = {
    key: sslCert.privateKey,
    cert: sslCert.certificate
};

var isMain = !module.parent || module.parent.isApplicationLoader;

// Create a new application and initialize it with *required* support for
// controllers and views.  Move (or remove) these lines at your own peril.
var app = module.exports = new witty.Application();
app.httpsOptions = httpsOptions;
app.phase(witty.boot.controllers(__dirname + '/app/controllers'));
app.phase(witty.boot.views());

// Add phases to configure environments, run initializers, draw routes, and
// start an HTTP server.  Additional phases can be inserted as needed, which
// is particularly useful if your application handles upgrades from HTTP to
// other protocols such as WebSocket.
app.phase(witty.boot.config(__dirname + '/config'));
app.phase(require('bootable-environment')(__dirname + '/config/environments'));
app.phase(bootable.initializers(__dirname + '/config/initializers'));
app.phase(witty.boot.middleware(__dirname + '/config'));
app.phase(witty.boot.routes(__dirname + '/config/routes'));

app.start = function (callback) {
    var servers = [];
    var host = app.get('host') || "0.0.0.0";
    var httpPort = app.get('port') || app.get('http-port') || app.get('httpPort');
    var httpsPort = app.get('https-port') || app.get('httpsPort');

    async.series([
        function (callback) {
            if (httpPort) {
                servers.push(http.createServer(app.express).listen(httpPort, host, function () {
                    if (isMain) printServerListeningMsg('http', host, httpPort);
                    callback();
                }));
            } else {
                callback();
            }
        },
        function (callback) {
            if (httpsPort) {
                servers.push(https.createServer(httpsOptions, app.express).listen(httpsPort, host, function () {
                    if (isMain) printServerListeningMsg('https', host, httpsPort);
                    callback();
                }));
            } else {
                callback();
            }
        }
    ], function () {
        app.emit('started');
        callback && callback();
    });

    app.close = function (cb) {
        app.removeAllListeners('started');
        app.removeAllListeners('loaded');

        async.eachSeries(servers, function (server, callback) {
            server.close(callback);
        }, function done() {
            servers = [];
            cb();
        });
    };

    function printServerListeningMsg(protocol, host, port) {
        var url = protocol + '://' + host + ':' + port;
        console.log('Web server listening at', url);
    }

};

// Boot the application.  The phases registered above will be executed
// sequentially, resulting in a fully initialized server that is listening
// for requests.
app.boot(function (err) {
    if (err) {
        console.error(err.message);
        console.error(err.stack);
        return process.exit(-1);
    }

    app.loaded = true;
    app.emit('loaded');

    if (isMain) {
        app.start();
    }

});
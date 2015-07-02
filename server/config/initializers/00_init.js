var expressx = require('expressx');
var syclify = require('syclify');

module.exports = function (done) {
    // Any files in this directory will be `require()`'ed when the application
    // starts, and the exported function will be invoked with a `this` context of
    // the application itself.  Initializers are used to connect to databases and
    // message queues, and configure sub-systems such as authentication.

    // Async initializers are declared by exporting `function(done) { /*...*/ }`.
    // `done` is a callback which must be invoked when the initializer is
    // finished.  Initializers are invoked sequentially, ensuring that the
    // previous one has completed before the next one executes.

    var sapp = syclify({
        modules: [
            'sycle-component-oauth2',
            __dirname + '/..'
        ],
        db: this.get('db')
    });

    sapp.enable('auth');    // enable authentication
    sapp.enable('model:public'); // disable model public default

    this.sapp = sapp;
    this.express.sapp = sapp;
    sapp.app = this.express;

    sapp.boot(done);
};

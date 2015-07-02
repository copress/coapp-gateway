var app = require('../server/server');

exports.start = function(done) {
    if (app.loaded) {
        _start(app, done);
    } else {
        app.once('loaded', function() {
            _start(app, done);
        });
    }
};


function _start(app, done) {
    app.once('started', function (err) {
        if (err) return done(err);
        app.oauth2 = app.express._oauth2Handlers; // For testing
        app.expressx = app.express.expressx;
        done();
    });
    app.start();
}

exports.model = function (name) {
    return app.sapp.models[name];
};

var async = require('async');
var sslCert = require('../../private/ssl_cert');
var samples = require('../sample-data.json');

module.exports = function (app, done) {
    var sapp = app.sapp;

    console.log('Generating Samples Data');
    console.log('-----------------------');
    var Application = sapp.models['OAuthClientApplication'];
    // Hack to set the app id to a fixed value so that we don't have to change
    // the client settings
    Application.hook('beforeSave', function (inst, next) {
        for (var i = 0, n = samples.applications.length; i < n; i++) {
            if (samples.applications[i].name === inst.name) {
                inst.id = samples.applications[i].id;
                inst.restApiKey = inst.clientSecret =
                    samples.applications[i].clientSecret ||
                    samples.applications[i].restApiKey;
                inst.jwks = samples.applications[i].jwks || sslCert.certificate;
            }
        }
        next();
    });

    function createUsers(done) {
        async.each(samples.users, function createUser(user, done) {
            sapp.models.User.findOrCreate({where: {username: user.username}}, user,
                function (err, user) {
                    if (!err) {
                        console.log('User registered: id=%s username=%s password=%s',
                            user.id, user.username, 'secret');
                    }
                    done(err);
                });
        }, done);
    }

    function createApplications(done) {
        async.each(samples.applications, function createApplication(application, done) {
            Application.findOrCreate({where: {id: application.id}}, application,
                function (err, application) {
                    if (!err) {
                        console.log(
                            'Client application registered: id=%s name=%s key=%s',
                            application.id, application.name, application.clientSecret);
                    }
                    done(err);
                });
        }, done);
    }

    async.parallel([createUsers, createApplications], function (err) {
        console.log('---------------------');
        console.log('Sample Data Generated');
        console.log();
        done(err);
    });
};
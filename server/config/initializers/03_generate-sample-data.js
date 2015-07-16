module.exports = function (c, done) {
    if (process.env.NODE_ENV !== 'prod' &&
        process.env.NODE_ENV !== 'production') {
        return require('../scripts/create-sample-data')(c.app, done);
    }
    done();
};
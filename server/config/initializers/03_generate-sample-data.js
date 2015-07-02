module.exports = function (done) {
    if (process.env.NODE_ENV !== 'prod' &&
        process.env.NODE_ENV !== 'production') {
        require('../scripts/create-sample-data')(this, done);
    }
};
module.exports = function () {
    var restApiRoot = this.get('restApiRoot');
    this.use(restApiRoot, require('sycle-express-rest')(this.sapp));
};

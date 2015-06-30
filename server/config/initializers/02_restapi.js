module.exports = function () {
    var restApiRoot = this.get('restApiRoot');
    this.use(restApiRoot, require('sira-express-rest')(this.sapp));
};

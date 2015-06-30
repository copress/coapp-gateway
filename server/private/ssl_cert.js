var tls = require('tls');
var fs = require('fs');
var path = require('path');

exports.privateKey = fs.readFileSync(path.join(__dirname, 'privatekey.pem')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem')).toString();

exports.credentials = tls.createSecureContext({key: exports.privateKey, cert: exports.certificate});

/**
 * Create a middleware to redirect http requests to https
 * @param {Object} options Options
 * @returns {Function} The express middleware handler
 */
module.exports = function(options) {
  options = options || {};
  return function httpsRedirect(req, res, next) {
    if (!req.secure) {
      var parts = req.get('host').split(':');
      var host = parts[0] || '127.0.0.1';
      var port = options.httpsPort || req.app.get('https-port') || 433;
      return res.redirect('https://' + host + ':' + port + req.url);
    }
    next();
  };
};
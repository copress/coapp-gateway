/* jshint camelcase: false */
var chai = require('chai');
chai.should();

var s = require('./support');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var app = require('../server/server');
var request = require('supertest')('https://localhost:3001');

var TOKEN_ENDPOINT = '/oauth/token';
var CLIENT_ID = '123';
var CLIENT_SECRET = 'secret';

describe('Granting with authorization_code grant type', function () {

  before(s.start);

  // Hacky way to create an authorization code
  before(function(done) {
    var model = s.model('OAuthAuthorizationCode');
    model.create({
      code: 'abc2',
      scopes: ['demo'],
      userId: 1,
      appId: '123',
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + 1000)
    }, function(err, code) {
      done(err, code);
    });
  });

  after(function(done) {
    app.close(done);
  });

  it('should detect missing parameters', function (done) {
    request
      .post(TOKEN_ENDPOINT)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
      .expect(400, /invalid_request/i, done);
  });

  it('should invalid authorization_code', function (done) {
    request
      .post(TOKEN_ENDPOINT)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: 'xyz'
      })
      .expect(403, /invalid_grant/i, done);
  });

  it('should detect invalid client_id', function (done) {
    request
      .post(TOKEN_ENDPOINT)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        client_id: '999',
        client_secret: CLIENT_SECRET,
        code: 'abc2'
      })
      .expect(401, done);
  });

  it('should allow valid request', function (done) {
    request
      .post(TOKEN_ENDPOINT)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: 'abc2'
      })
      .expect(200, /"access_token":"(.*)"/i, done);
  });

  it('should detect expired code', function (done) {
    setTimeout(function() {
      request
        .post(TOKEN_ENDPOINT)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: 'abc2'
        })
        .expect(403, /invalid_grant/i, done);
    }, 1000);
  });

});

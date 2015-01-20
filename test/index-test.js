'use strict';

var test = require('tape');
var nock = require('nock');
var nockResponses = require('./nock-responses');

var Drupal = require('../index');

test('Initialize with endpoint', function(t) {
  t.plan(1);

  var endpoint = 'http://test.sample/api';
  var drupal = new Drupal(endpoint);

  t.equal(drupal._endpoint, endpoint);
});

test('user - actions - login', function(t) {
  t.plan(2);

  var drupal = new Drupal('http://test.com/api');

  nock('http://test.com')
    .post('/api/user/login.json')
    .reply(200, nockResponses.user.login);

  return drupal.login('user', 'password').then(function() {
    t.equal(drupal._cookie, nockResponses.user.login.sessid);
    t.equal(drupal._csrfToken, nockResponses.user.login.token);
  });
});

test('user - actions - logout', function(t) {
  t.plan(2);

  var drupal = loggedInDrupal('http://test.com/api');

  authedNock('http://test.com', drupal)
    .post('/api/user/logout.json')
    .reply(200, nockResponses.user.logout);


  return drupal.logout().then(function() {
    t.equal(drupal._cookie, null);
    t.equal(drupal._csrfToken, null);
  });
});

test('node - crud - index', function(t) {
  t.plan(1);

  var drupal = new Drupal('http://test.com/api');

  nock('http://test.com')
    .get('/api/node.json')
    .reply(200, nockResponses.node.index);

  return drupal.index().then(function(response) {
    t.deepEqual(response, nockResponses.node.index);
  });
});

test('node - crud - index w/ query', function(t) {
  t.plan(1);

  var drupal = new Drupal('http://test.com/api');

  nock('http://test.com')
    .get('/api/node.json?limit=1&parameters%5Btitle%5D=something')
    .reply(200, nockResponses.node.indexQuery);

  return drupal.index({limit: 1}, {title: 'something'}).then(function(response) {
    t.deepEqual(response, nockResponses.node.indexQuery);
  });
});

test('node - crud - retrieve', function(t) {
  t.plan(1);
  var drupal = new Drupal('http://test.com/api');

  nock('http://test.com')
    .get('/api/node/3.json')
    .reply(200, nockResponses.node.retrieve);

  return drupal.retrieve(3).then(function(response) {
    t.deepEqual(response, nockResponses.node.retrieve);
  });
});

test('node - crud - create', function(t) {
  t.plan(1);
  var drupal = loggedInDrupal('http://test.com/api');

  authedNock('http://test.com', drupal)
    .post('/api/node.json')
    .reply(200, nockResponses.node.create);

  return drupal.create({
    type: 'article',
    title: 'title',
    /* jshint ignore:start */
    field_phone_number: { und: [{ value: '1234567890' }] }
    /* jshint ignore:end */
  }).then(function(response) {
    t.deepEqual(response, nockResponses.node.create);
  });
});

test('node - crud - update', function(t) {
  t.plan(1);
  var drupal = loggedInDrupal('http://test.com/api');

  authedNock('http://test.com', drupal)
    .put('/api/node/5.json')
    .reply(200, nockResponses.node.update);

  return drupal.update(5, {
    title: 'new title',
    /* jshint ignore:start */
    field_phone_number: { und: [{ value: '999999999' }] }
    /* jshint ignore:end */
  }).then(function(response) {
    t.deepEqual(response, nockResponses.node.update);
  });
});

test('node - crud - delete', function(t) {
  t.plan(1);
  var drupal = loggedInDrupal('http://test.com/api');

  authedNock('http://test.com', drupal)
    .delete('/api/node/5.json')
    .reply(200, nockResponses.node.delete);

  return drupal.delete(5).then(function(response) {
    t.deepEqual(response, nockResponses.node.delete);
  });
});

function authedNock(url, drupalClient) {
  return nock(url, {
    reqheaders: {
      'Cookie': drupalClient._cookie,
      'X-CSRF-Token': drupalClient._csrfToken
    }
  });
}

function loggedInDrupal(endpoint) {
  var drupal = new Drupal(endpoint);
  drupal._cookie = nockResponses.user.login.sessid;
  drupal._csrfToken = nockResponses.user.login.token;

  return drupal;
}

'use strict';

var request = require('./utils/request');
var assign  = require('lodash-node/modern/objects/assign');
var TaxonomyVocabulary = require('./lib/taxonomy-vocabulary');
var DrupalFile = require('./lib/file');
var User    = require('./lib/user');
var Promise = require('bluebird'); // jshint ignore:line

function Drupal(endpoint) {
  this._endpoint          = endpoint;
  this._cookie            = null;
  this._csrfToken         = null;
  this.taxonomyVocabulary = new TaxonomyVocabulary(this);
  this.file               = new DrupalFile(this);
  this.user               = new User(this);
}

Drupal.prototype.urlForPath = function(urlPath) {
  return this._endpoint + '/' + urlPath;
};

Drupal.prototype.urlForNode = function(nid) {
  return this.urlForPath('node/' + nid + '.json');
};

Drupal.prototype.isLoggedIn = function() {
  if (this._cookie && this._csrfToken) {
    return true;
  }

  return false;
};

/*
 * Login/Logout
 */
Drupal.prototype.login = function(username, password) {
  if (this.isLoggedIn()) {
    return Promise.resolve();
  }

  return request.post(this.urlForPath('user/login.json'), {
    username: username,
    password: password
  }).then(function(user) {
    this._cookie    = createCookieFromUser(user);
    this._csrfToken = user.token;

    return user;
  }.bind(this));
};

Drupal.prototype.logout = function() {
  var logoutUrl = this.urlForPath('user/logout.json');
  return this.authenticatedPost(logoutUrl).then(function() {
    this._cookie    = null;
    this._csrfToken = null;

    return true;
  }.bind(this));
};

/*
 * Node methods
 */
Drupal.prototype.index = function(options, params) {
  // This merges options like limit: 1 and params like title: 'whatever'.
  var query = assign({}, options || {}, {
    parameters: params || {}
  });

  return request({
    method: 'GET',
    url: this.urlForPath('node.json'),
    qs: query
  });
};

Drupal.prototype.retrieve = function(nid) {
  return request.get(this.urlForNode(nid));
};

Drupal.prototype.create = function(body) {
  return this.authenticatedPost(this.urlForPath('node.json'), body);
};

Drupal.prototype.update = function(nid, body) {
  return this.authenticatedPut(this.urlForNode(nid), body);
};

Drupal.prototype.delete = function(nid) {
  return this.authenticatedDelete(this.urlForNode(nid));
};

/*
 * Auth methods
 */
Drupal.prototype.authenticatedGet = function(url, qa) {
  return this.authenticatedRequest('GET', url, null, qa);
};

Drupal.prototype.authenticatedPost = function(url, body) {
  return this.authenticatedRequest('POST', url, body);
};

Drupal.prototype.authenticatedDelete = function(url, body) {
  return this.authenticatedRequest('DELETE', url, body);
};

Drupal.prototype.authenticatedPut = function(url, body) {
  return this.authenticatedRequest('PUT', url, body);
};

Drupal.prototype.authenticatedRequest = function(method, url, body, qa) {
  return request({
    method:  method,
    url:     url,
    body:    body,
    qa:      qa,
    headers: {
      'Cookie':        this._cookie,
      'X-CSRF-Token':  this._csrfToken
    }
  });
};

/*
 * private
 */
function createCookieFromUser(user) {
  return user.session_name + '=' + user.sessid;
}

module.exports = Drupal;

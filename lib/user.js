'use strict';

var assign  = require('lodash-node/modern/objects/assign');

function User(drupal) {
  this.drupal = drupal;
}

User.prototype.index = function(options, params) {
  var query = assign({}, options || {}, {
    parameters: params || {}
  });
  var url = this.drupal.urlForPath('user.json');
  return this.drupal.authenticatedGet(url, query);
};

User.prototype.retrieve = function(id) {
  var url = this.drupal.urlForPath('user/' + id + '.json');
  return this.drupal.authenticatedGet(url);
};

User.prototype.create = function(params) {
  var url = this.drupal.urlForPath('user/register.json');
  return this.drupal.authenticatedPost(url, params);
};

module.exports = User;

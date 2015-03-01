'use strict';

var assign  = require('lodash-node/modern/objects/assign');

function File(drupal) {
  this.drupal = drupal;
}

File.prototype.index = function(options, params) {
  var query = assign({}, options || {}, {
    parameters: params || {}
  });
  var url = this.drupal.urlForPath('file.json');
  return this.drupal.authenticatedGet(url, query);
};

File.prototype.retrieve = function(fid) {
  var url = this.drupal.urlForPath('file/' + fid + '.json');
  return this.drupal.authenticatedGet(url);
};

module.exports = File;

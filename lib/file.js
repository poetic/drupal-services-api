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

module.exports = File;

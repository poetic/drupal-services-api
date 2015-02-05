'use strict';

var Promise = require('bluebird'); // jshint ignore:line
var request = require('../utils/request');

function TaxonomyVocabulary(drupal) {
  this.drupal = drupal;
}

TaxonomyVocabulary.prototype.index = function() {
  return request({
    method: 'GET',
    url: this.drupal.urlForPath('taxonomy_vocabulary.json')
  });
};

TaxonomyVocabulary.prototype.getTree = function(vid) {
  return request({
    method: 'POST',
    url: this.drupal.urlForPath('taxonomy_vocabulary/getTree.json'),
    body: {vid: vid}
  });
};

module.exports = TaxonomyVocabulary;

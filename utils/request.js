'use strict';

var promiseRequest = require('request-promise');
var assign  = require('lodash-node/modern/objects/assign');

function request(options) {
  return promiseRequest(assign({
    json: true
  }, options));
}

module.exports = request;

request.post = function(url, body) {
  return request({
    method: 'POST',
    url: url,
    body: body
  });
};

request.get = function(url) {
  return request({
    method: 'GET',
    url: url
  });
};

# Drupal 7 Services API [![Build Status](https://travis-ci.org/poetic/drupal-services-api.svg?branch=master)](https://travis-ci.org/poetic/drupal-services-api)

An Node.js client for interacting with Drupal 7 Services 3.11.

## Installation

```sh
npm install --save drupal-services-api
```

## Usage

You need to login before using any methods that require it.

```js
var client = new Drupal('http://drupal-site.com/api');

client.login('username', 'password').then(function(user) { });

client.isLoggedIn(); // => Boolean

client.logout().then(function() { });

/* Nodes */

client.index().then(function(nodes) { });

client.index({limit: 10}).then(function(max10nodes) { });

client.index(null, {title: 'something'}).then(function(nodesWhereTitleIsSomething) { });

client.index({limit: 1}, {title: 'something'}).then(function(nodesWhereTitleIsSomethingButOnly1) { });

client.retrieve(2).then(function(nodeWithNid2) { });

client.create({
  type: 'article',
  title: 'something'
}).then(function(newArticle) { });

client.update(2, {
  title: 'something'
}).then(function(updatedNode) { });

client.delete(2).then(function() { });

/* Taxonomy */

client.taxonomyVocabulary.index().then(function(vocabulary) { });

client.taxonomyVocabulary.getTree(vid).then(function(termsForVid) { });

/* File */

client.file.index().then(function(files) {  });

client.file.index({limit: 10}).then(function(max10files) { });

client.file.index(null, {filename: 'something'}).then(function(filesWhereOrigNameIsSomething) { });

/* User */

client.user.index().then(function(users) {  });

client.user.retrieve(1).then(function(userWithIdOf1) {  });
```


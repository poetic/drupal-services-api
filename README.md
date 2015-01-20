# Drupal 7 Services API

An Node.js client for interacting with Drupal 7 Services 3.11.

## Usage

You need to login before using any methods that require it.

```js
var client = new Drupal('http://drupal-site.com/api');

client.login('username', 'password').then(function(user) { });

client.logout().then(function() { });

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
```


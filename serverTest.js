var http = require('http'); //require the 'http' module

//create a server
http.createServer(function (request, response) {
  //function called when request is received
  response.writeHead(200, {'Content-Type': 'text/plain'});
  //send this response
  response.end('Hello World\nMy first node.js app\n\n -Gopi Ramena');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

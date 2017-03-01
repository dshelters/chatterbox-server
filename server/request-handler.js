const fs = require('fs');

var results = []; 

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function(response, statusCode, data) {
  response.writeHead(statusCode, headers);
  response.end(data);
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  

  // declaring some variables
  var statusCode;
  var method = request.method;
  var url = request.url;
  var urlMatch = (url === '/classes/messages' || url === '/classes/room');

  //POST Method
  if (request.method === 'POST' && urlMatch) {
    statusCode = 201;
    var body = '';
    request.on('data', function(chunk) {
      body = body.concat(chunk.toString());
    });
    request.on('end', function() {
      if (body.length > 0) {
        var result = JSON.parse(body);
        results.push(result);
      }
    });
   
    sendResponse(response, statusCode, JSON.stringify(results[results.length - 1]));


  //GET method
  } else if (request.method === 'GET' && urlMatch) {
    statusCode = 200;
    var responseBody = {
      method: method,
      url: url,
      results: results
    };
    
    sendResponse(response, statusCode, JSON.stringify(responseBody));


  // options
  } else if (request.method === 'OPTIONS' && urlMatch) {
    statusCode = 200;
    console.log('headers', headers);
    
    sendResponse(response, statusCode);

  // different url
  } else {
    statusCode = 404;
    sendResponse(response, statusCode);    
  }
  
};


module.exports.requestHandler = requestHandler;


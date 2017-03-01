var results = []; 


var requestHandler = function(request, response) {
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  

  // declaring some variables
  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
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
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(results[results.length - 1]));


  //GET method
  } else if (request.method === 'GET' && urlMatch) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    var responseBody = {
      method: method,
      url: url,
      results: results
    };
    response.end(JSON.stringify(responseBody));


  // options
  } else if (request.method === 'OPTIONS' && urlMatch) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    console.log('headers', headers);
    response.end();

  // different url
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
  
};


module.exports.requestHandler = requestHandler;


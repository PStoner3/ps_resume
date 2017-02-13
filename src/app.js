var http = require("http"),
  path = require("path"),
  fs = require("fs"),
  mime = require("mime");

var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url === "/") {
    filePath = "public/index.html";
  } else {
    filePath = "public/" + request.url;
  }

  var absPath = "./" + filePath;

  serve(response, absPath)
});

function serve(response, filePath) {
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          send404(response);
        } else {
          sendPage(response, filePath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}

function send404(response) {
  response.writeHead(404, {
    "Content-type": "text/plain"
  });
  response.write("Error 404: resource not found");
  response.end();
}

function sendPage(response, filePath, fileData) {
  response.writeHead(200, {
    "Content-type": mime.lookup(path.basename(filePath))
  });
  response.end(fileData);
}

var port = server.listen(process.env.PORT || 6765);

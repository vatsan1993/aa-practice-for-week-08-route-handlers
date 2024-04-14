const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = '';
  req.on('data', (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on('end', () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split('&')
        .map((keyValuePair) => keyValuePair.split('='))
        .map(([key, value]) => [key, value.replace(/\+/g, ' ')])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    // GET /
    if (req.method == 'GET' && req.url == '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      return res.end('Dog Club');
    }

    // GET /dogs/new
    if (req.method == 'GET' && req.url == '/dogs/new') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      return res.end('Dog create form page');
    }

    // GET /dogs
    if (req.method == 'GET' && req.url == '/dogs') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      return res.end('Dogs index');
    }

    // GET /dogs/:dogId
    if (req.method == 'GET' && req.url.startsWith('/dogs')) {
      let urlParts = req.url.split('/');

      if (urlParts.length == 3 && urlParts[1] == 'dogs') {
        let dogId = urlParts[2];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        return res.end(`Dog details for dogId: ${dogId}`);
      }

      // GET /dogs/:dogId/edit
      if (
        urlParts.length == 4 &&
        urlParts[1] == 'dogs' &&
        urlParts[3] == 'edit'
      ) {
        let dogId = urlParts[2];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        return res.end(`Dog edit form page for dogId: ${dogId}`);
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        return res.end(`you forgot to write edit after /`);
      }
    }

    // post methods /dogs and POST /dogs/:dogId
    if (req.method == 'POST' && req.url.startsWith('/dogs')) {
      let urlParts = req.url.split('/');
      if (urlParts.length == 2 && urlParts[1] == 'dogs') {
        res.statusCode = 302;
        let newDogId = getNewDogId();
        res.setHeader('Location', `/dogs/${newDogId}`);
        return res.end();
      }

      if (urlParts.length == 3 && urlParts[1] == 'dogs' && urlParts[2]) {
        let dogId = urlParts[2];
        res.statusCode = 302;
        res.setHeader('Location', `/dogs/${dogId}`);
        return res.end();
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('dogID was not provided');
      }
    }

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));

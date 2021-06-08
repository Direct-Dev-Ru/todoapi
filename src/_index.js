// const http = require("http");
// const dbService = require("./getDb");
// const hostname = "localhost";
// const port = 8080;
// const app = require("./app");

const server = require("../api/bin/www");

// app.listen(port);
// console.log(`Web Server running at http://${hostname}:${port}/`);

/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  console.log(req.url);
  if (req.url === "/") {
    res.writeHead(302, {
      Location: "/home"
    });
    res.end();
  } else if (req.url === "/home") {
    res.writeHead(200);
    return res.end("<h1>This is Home page</h1>");
  } else if (req.url === "/about") {
    res.writeHead(200);
    return res.end("<h1>This is About page</h1>");
  } else if (req.url === "/api") {
    dbService.readDb().then((dbObject) => {
      console.log(dbObject);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      return res.end(JSON.stringify(dbObject));
    });
  } else {
    return res.end(`<h1>404 NOT FOUND</h1>`);
  }
});

   server.listen(port, hostname, () => {
   console.log(`Server running at
   http://${hostname}:${port}/`);
 });
*/

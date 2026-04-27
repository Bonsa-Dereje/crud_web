const http = require("http");
const fs = require("fs");

const PORT = 3000;
const FILE = "./movies.json";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/movies") {
    fs.readFile(FILE, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error reading file");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  }

  else if (req.method === "GET" && req.url.startsWith("/movies/")) {
    const id = req.url.split("/")[2];

    fs.readFile(FILE, "utf8", (err, data) => {
      const movies = JSON.parse(data);
      const movie = movies.find(m => m.id == id);

      if (!movie) {
        res.writeHead(404);
        return res.end("Movie not found");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(movie));
    });
  }

  else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
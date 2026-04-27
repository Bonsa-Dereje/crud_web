const http = require("http");
const fs = require("fs");

const PORT = 3000;
const FILE = "./movies.json";

const getBody = (req, callback) => {
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => callback(JSON.parse(body)));
};

const server = http.createServer((req, res) => {

  // READ ALL
  if (req.method === "GET" && req.url === "/movies") {
    fs.readFile(FILE, "utf8", (err, data) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  }

  // READ ONE
  else if (req.method === "GET" && req.url.startsWith("/movies/")) {
    const id = req.url.split("/")[2];

    fs.readFile(FILE, "utf8", (err, data) => {
      const movies = JSON.parse(data);
      const movie = movies.find(m => m.id == id);

      if (!movie) {
        res.writeHead(404);
        return res.end("Not found");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(movie));
    });
  }

  // CREATE
  else if (req.method === "POST" && req.url === "/movies") {
    getBody(req, (newMovie) => {
      fs.readFile(FILE, "utf8", (err, data) => {
        const movies = JSON.parse(data);

        newMovie.id = Date.now();
        movies.push(newMovie);

        fs.writeFile(FILE, JSON.stringify(movies, null, 2), () => {
          res.writeHead(201);
          res.end("Movie added");
        });
      });
    });
  }

  // UPDATE
  else if (req.method === "PUT" && req.url.startsWith("/movies/")) {
    const id = req.url.split("/")[2];

    getBody(req, (updatedData) => {
      fs.readFile(FILE, "utf8", (err, data) => {
        let movies = JSON.parse(data);

        movies = movies.map(m =>
          m.id == id ? { ...m, ...updatedData } : m
        );

        fs.writeFile(FILE, JSON.stringify(movies, null, 2), () => {
          res.writeHead(200);
          res.end("Updated");
        });
      });
    });
  }

  // DELETE
  else if (req.method === "DELETE" && req.url.startsWith("/movies/")) {
    const id = req.url.split("/")[2];

    fs.readFile(FILE, "utf8", (err, data) => {
      let movies = JSON.parse(data);

      movies = movies.filter(m => m.id != id);

      fs.writeFile(FILE, JSON.stringify(movies, null, 2), () => {
        res.writeHead(200);
        res.end("Deleted");
      });
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
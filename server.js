const express = require("express");
const path = require("path");
const fs = require("fs");
let autoIterator = 1;


const dbRoute = path.join(__dirname, "/db/db.json");
const dbConnect = JSON.parse(
  fs.readFileSync(dbRoute, (err, data) => {
    if (err) throw err;
  })
);

const dbWrite = dbConnect => {
  let filtered = dbConnect.filter(function(el) {
    return el != null;
  });
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(filtered),
    err => {
      if (err) throw err;
    }
  );
};

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/index", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  return res.json(dbConnect);
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  newNote.id = autoIterator;
  autoIterator++;
  dbConnect.push(newNote);
  dbWrite(dbConnect);
  return res.json(dbConnect);
});

app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  delete dbConnect[id - 1];
  dbWrite(dbConnect);
  res.send(dbConnect);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

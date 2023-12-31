const express = require("express");
const app = express();
const port = 3000;
const square = require("./square"); // Here we require() the name of the file without the (optional) .js file extension

const logger = require("morgan");
app.use(logger("dev"));

console.log(`The area of a square with a width of 4 is ${square.area(4)}`);
const wiki = require("./wiki.js");
// …

const { getNotes, getNote, createNote } = require("./database.js");
app.use(express.json()); // for parsing application/json

//custom middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/wiki", wiki);

app.get("/notes", async function (req, res) {
  try {
    const notes = await getNotes();
    res.send(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting notes");
  }
});

app.get("/notes/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const note = await getNote(id);
    res.send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting note");
  }
});

app.post("/notes", async function (req, res) {
  try {
    const { title, contents } = req.body;
    const note = await createNote(title, contents);
    res.status(201).send(note);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating note");
  }
});

app.get("/", function (req, res) {
  res.send("Hello World!!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

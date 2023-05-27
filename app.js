const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

let port = 8080
app.listen(port, () => {
  console.log("Server listening on port " + port);
});


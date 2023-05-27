const express = require("express");
const app = express();

app.get("/", (req, res) => {
  // Redirect to an alternate port (e.g., 3000)
  const redirectUrl = `http://${req.hostname}:3000${req.url}`;
  res.redirect(redirectUrl);
});

let port = 8080
app.listen(port, () => {
  console.log("Server listening on port " + port);
});


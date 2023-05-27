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

// JSON middleware
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get a single user by ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const index = users.findIndex(u => u.id === userId);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);

  if (index !== -1) {
    const deletedUser = users[index];
    users.splice(index, 1);
    res.json(deletedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"username":"john", "password":"secret"}' http://pithree:8080/login
// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform login authentication logic
  // Replace this with your actual login authentication logic

  if (username === 'john' && password === 'secret') {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

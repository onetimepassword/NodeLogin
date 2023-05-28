const express = require("express");
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

let count = 0

// Create a new pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

// JSON middleware
app.use(express.json());

app.get("/", (req, res) => {
  // Redirect to an alternate port (e.g., 3000)
  const redirectUrl = `http://${req.hostname}:3000${req.url}`;
  res.redirect(redirectUrl);
});

const port = 8080
app.listen(port, () => {
	// Test the connection
	pool.query('SELECT NOW()', (err, res) => {
	  if (err) {
	    console.error('Error connecting to the database:', err);
	  } else {
	    console.log('Connected to the database');
	  }
	});
  console.log("Server listening on port " + port);
});


// curl -X POST -H "Content-Type: application/json" -d '{"username":"john", "password":"secret"}' http://pithree:8080/register
// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  const query = 'select * from users where username = $1'
  const values = [username]

    // callback
  pool.query(query, values, (err, resp) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (resp.rows.length == 1) {
        console.log(resp.rows[0]);
        return res.json({ error: 'Username already taken' });
      } else { 
        const insert = 'insert into users(username, password) values ($1, $2)'
        const user = [username, password]
        pool.query(insert, user, (err, resp) => {
          if (err) {
            console.log(err.stack);
            return res.json({ error: 'Error adding user: ' + username});
          } else {
            return res.json({ error: 'Registered user' });
	  }
	});
      }
    }
  });
});


// curl -X POST -H "Content-Type: application/json" -d '{"username":"john", "password":"secret"}' http://pithree:8080/login
// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform login authentication logic
  // Replace this with your actual login authentication logic
  count += 1;
  console.log("count " + count);

   // Check if the username is already taken
  const query = 'SELECT * FROM users WHERE username = $1'
  const values = [username]

    // callback
  pool.query(query, values, (err, resp) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (resp.rows[0]) {
        console.log(resp.rows[0]);
        res.json({ message: 'Login successful', code: count });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// Close the pool when the application exits
process.on('exit', () => {
  pool.end();
});


const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();

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

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  const query = 'SELECT * FROM users WHERE username = $1 AND password IS NOT NULL'
  const values = [username]

  pool.query(query, values, (err, resp) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      if (resp.rows.length == 1) {
	console.log('Already registered: ' + username);
        return res.status(500).json({ error: 'Username already taken' });
      } else { 
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.log(err.stack);
            return res.status(500).json({ error: 'Internal server error' });
          }
          const insert = 'INSERT INTO users(username, password) VALUES ($1, $2) ON CONFLICT(username) DO UPDATE SET password = $2'
          const user = [username, hashedPassword]
          pool.query(insert, user, (err, resp) => {
            if (err) {
              console.log(err.stack);
              return res.status(500).json({ error: 'Server error adding user: ' + username});
            } else {
              console.log('Registered user: ' + username);
              return res.json({ error: 'Registered user' });
            }
          });
        });
      }
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
 
  // Perform login authentication logic
  const query = 'SELECT * FROM users WHERE username = $1'
  const values = [username]
 
  pool.query(query, values, (err, resp) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).json({ error: 'Server error' });
    } else {
      if (resp.rows[0]) {
        bcrypt.compare(password, resp.rows[0]['password'], (err, result) => {
          if (err || !result) {
            if (!result) {
              console.log('Invalid credentials: ' + username);
            } else {
              console.log(err.stack);
            }
            return res.status(401).json({ error: 'Invalid credentials' });
          }
          console.log('Login: ' + username);
          return res.json({ message: 'Login successful' });
        });
      } else {
        console.log('No user: ' + username);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// Close the pool when the application exits
process.on('exit', () => {
  pool.end();
});


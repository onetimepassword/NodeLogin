
create the db tables
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR NOT NULL
);

ALTER TABLE users ADD CONSTRAINT name UNIQUE (username);
```

run app
```terminal
npm install express body-parser bcrypt pg
node app.js
```

in another terminal, call service
```terminal
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/login
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/register
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"incorrect"}' http://localhost:8080/login
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/login
```

which unique constraint the admin can force an update by setting the password to NULL

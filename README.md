
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR NOT NULL
);
```
```terminal
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/login
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/register
curl -X POST -H "Content-Type: application/json" -d '{"username":"goerge", "password":"secret"}' http://localhost:8080/login
```

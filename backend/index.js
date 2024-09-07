const express = require('express');
const app = express();
const cors = require('cors');
const { users } = require('./data');
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  //   res.send('Hello from your Node.js/Express backend!');
  if (!users) {
    res.status(404).send({ message: 'No users found' });
  }
  res.send(users);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

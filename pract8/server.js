const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

let counter = 0;

app.get('/counter', (req, res) => {
  res.json({ counter });
});

app.post('/counter', (req, res) => {
  const { action } = req.body;
  if (action === 'increment') counter++;
  else if (action === 'decrement' && counter > 0) counter--;
  else if (action === 'reset') counter = 0;

  res.json({ counter });
});

app.listen(port, () => {
  console.log(`Gym Counter app running at http://localhost:${port}`);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = 3333;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let useCacheControl = false;

app.get('/random-items', (_, res) => {
  if (useCacheControl) {
    res.set('Cache-control', 'private, max-age=5');
  }

  return res.json({
    items: [
      Math.random().toFixed(2),
      Math.random().toFixed(2),
      Math.random().toFixed(2),
    ],
  });
});

app.post('/cache-control/on', (_, res) => {
  useCacheControl = true;
  return res.send(200);
});

app.post('/cache-control/off', (_, res) => {
  useCacheControl = false;
  return res.send(200);
});

app.listen(PORT, () => {
  console.log(`Test web server listening on port ${PORT}`);
});

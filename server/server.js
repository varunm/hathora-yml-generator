const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/load', (_req, res) => {
  const data = fs.readFileSync(path.resolve(__dirname, "./hathora.yml"), "utf8");
  res.send(data);
});

app.post('/save', (req, res) => {
  // console.log(req);
  fs.writeFileSync(path.resolve(__dirname, "./hathora.yml"), req.body["yaml"], "utf8");
  res.send({});
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
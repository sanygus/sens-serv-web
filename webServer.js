const express = require('express');
const db = require('./db');
const log = require('./log');
const { httpPort } = require('./options');

const server = express();
server.use('/static', express.static('static'));
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  db.getLastValues((err, values) => {
    if (err) {
      log(err);
      res.status(500).render('error');
    } else {
      res.render('index', { values });
    }
  });
});

server.listen(httpPort, () => {
  console.log(`webserver listening on ${httpPort} port`);
});

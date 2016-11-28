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
server.get('/export', (req, res) => {
  if (req.query.json !== undefined) {
    db.exportAll((err, values) => {
      if (err) {
        log(err);
        res.type('application/json').status(500).send({'error': 1});
      } else {
        res.type('application/json').send(JSON.stringify({ values }));
      }
    });
  } else if (req.query.csv !== undefined) {
    res.status(400).send('temporary unavailable');
  } else {
    res.status(400).send('no format');
  }
});

server.listen(httpPort, () => {
  console.log(`webserver listening on ${httpPort} port`);
});

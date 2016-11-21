var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

// request to get the treats from the database
router.get('/', function(req, res) {

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM treats', function(err, result) {
      done();

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });

  });
}); // get request ends

// request to add a new treat to the database
router.post('/', function(req, res) {

  var newTreat = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'INSERT INTO treats (name, description, pic) ' +
      'VALUES ($1, $2, $3)',
      [newTreat.name, newTreat.description, newTreat.url],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

}); // post request ends

// request to get searched treats from the database
router.get('/:query', function(req, res) {

  treatQuery = req.params.query;
  console.log(treatQuery);

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM treats WHERE name ILIKE $1',
    [treatQuery],
    function(err, result) {
      done();

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });

  });
}); // get request ends

// request to delete a treat from the database
router.delete('/:id', function(req, res) {
  treatID = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'DELETE FROM treats WHERE id = $1',
      [treatID],
      function(err, result) {
        done();

        if(err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

}); // delete request ends

router.put('/:id', function(req, res) {
  treatID = req.params.id;
  treat = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE treats SET name=$1, description=$2' +
      ' WHERE id=$3',
      // array of values to use in the query above
      [treat.name, treat.description, treatID],
      function(err, result) {
        if(err) {
          console.log('update error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }); // close connect

}); // end route

module.exports = router;

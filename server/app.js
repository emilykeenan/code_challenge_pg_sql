var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var treats = require('./routes/treats');
var connectionString = "postgres://localhost:5432/sigma";

/*** Build out a module to manage our treats requests. ***/
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/treats', treats);

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./server/public/views/index.html'));
});

app.use(express.static('./server/public'));


app.listen(port, function() {
  console.log('Server running on port: ', port);
});

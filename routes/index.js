var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'songapp-db.ck7nst26eyeh.us-west-1.rds.amazonaws.com',
  user     : 'songapp_guest',
  password : 'songappguest',
  database : 'songapp_db'
});
/*****I ADDED THIS SHIT************/

/*
var MongoClient = require('mongodb').MongoClient;
  f = require('util').format;
  assert = require('assert');
  fs = require('fs');

  // Read the certificate authority
  //var ca = [fs.readFileSync(__dirname + "/ca.pem")];
  var cert = fs.readFileSync(__dirname + "/cis450.pem");

// Connection URL mongodb://{hostname}:{port}/{dbname}
var url = 'mongodb://ec2-user@ec2-54-173-244-199.compute-1.amazonaws.com/songapp_db';

// Use connect method to connect to the Server passing in
// additional options
MongoClient.connect(url,  {
  server: {
      sslValidate:true
    , sslCert:cert
  }
}, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
*/
/***************/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/popular', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'popular.html'));
});

router.get('/popular/displaySongs', function(req, res, next) {


  var q = 'SELECT Song.title, COUNT(ListensTo.userId) FROM Song JOIN ListensTo ON Song.songID = ListensTo.songID GROUP BY Song.title ORDER BY COUNT(ListensTo.userId) DESC LIMIT 20;'
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }
  });
});

router.get('/popular/displayArtists', function(req, res, next) {


  var q = 'SELECT artists.name, COUNT(ListensTo.userID) as count FROM artists JOIN PerformedBy ON artists.artistID = PerformedBy.ArtistID JOIN ListensTo ON PerformedBy.songID = ListensTo.songID GROUP BY artists.name ORDER BY COUNT(ListensTo.UserId) DESC LIMIT 20;'
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }
  });

});

router.get('/data/:song', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  //var q2 = ' GROUP BY login'
  // you may change the query during implementation
  console.log(req.params)
  var song = req.params.song;
  if (song != 'undefined') query = 'select Song.songID, title, name from Song, artists, PerformedBy where title = "' + song + '" and PerformedBy.songID = Song.songID and PerformedBy.artistID = artists.artistID GROUP BY name;';
  console.log(query);
  var q = query;
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }
    });
});

router.get('/songID/:songID', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  //var q2 = ' GROUP BY login'
  // you may change the query during implementation
  console.log(req.params);
  var songID = req.params.songID;
  if (songID != 'undefined') query = 'select * from Song where songID = "' + songID + '";';
  console.log(query);
  var q = query
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }
    });
});


module.exports = router;



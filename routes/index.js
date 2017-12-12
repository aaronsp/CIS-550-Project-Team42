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

var MongoClient = require('mongodb').MongoClient;
  f = require('util').format;
  assert = require('assert');
  fs = require('fs');

  // Read the certificate authority
  //var ca = [fs.readFileSync(__dirname + "/ca.pem")];
  var cert = fs.readFileSync(__dirname + "/../secret/cis450.pem");

// Connection URL mongodb://{hostname}:{port}/{dbname}
var url = 'mongodb://admin:songapp450@ec2-54-204-154-196.compute-1.amazonaws.com:27017/songapp_db?authSource=admin';
var db;
// Use connect method to connect to the Server passing in
// additional options
MongoClient.connect(url,  {
  server: {
      sslValidate:true
    , sslCert:cert
  }
}, function(err, database) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db = database;
  db.close();
});

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
  query = "SELECT T.title, artists.name, T.num " +
           "FROM ( " +
                    "SELECT Song.title, Song.songID, COUNT(ListensTo.userID) as num " +
                    "FROM Song " +
                    "JOIN ListensTo " +
                    "ON Song.songID = ListensTo.songID " +
                    "WHERE ListensTo.userID IN ( SELECT ListensTo.userID " +
                                                "FROM ListensTo " +
                                                "WHERE songID = '" + songID + "' ) " +
                    "GROUP BY Song.songID " +
                    "ORDER BY COUNT(ListensTo.userID) DESC " +
                    "LIMIT 21 OFFSET 1 " +
                  ") T " +
            "JOIN PerformedBy " +
            "ON T.songID = PerformedBy.songID " +
            "JOIN artists " +
            "ON PerformedBy.artistID = artists.artistID;";
  console.log(query);
  var q = query
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        //console.log(rows)
        res.json(rows);
    }
    });
});


module.exports = router;

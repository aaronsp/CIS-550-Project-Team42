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
var url = 'mongodb://admin:songapp450@ec2-52-54-193-171.compute-1.amazonaws.com:27017/songapp_db?authSource=admin';
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
  //db.close();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/similarity', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'similarity.html'));
});

router.get('/popular', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'popular.html'));
});

router.get('/popular/displaySongs', function(req, res, next) {


  var q = 'SELECT Song.title, artists.name, COUNT(ListensTo.userId) FROM Song JOIN ListensTo ON Song.songID = ListensTo.songID JOIN PerformedBy ON Song.songID = PerformedBy.songID JOIN artists ON PerformedBy.artistID = artists.artistID GROUP BY Song.title ORDER BY COUNT(ListensTo.userId) DESC LIMIT 20;'
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});

router.get('/popular/displayArtists', function(req, res, next) {

  var q = 'SELECT artists.name, artists.artistID, COUNT(ListensTo.userID) as count FROM artists JOIN PerformedBy ON artists.artistID = PerformedBy.ArtistID JOIN ListensTo ON PerformedBy.songID = ListensTo.songID GROUP BY artists.name ORDER BY COUNT(ListensTo.UserId) DESC LIMIT 20;'
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

});

router.get('/songsByArtist/:artistID', function(req, res, next) {

  var q = 'SELECT Song.title, Song.songID FROM Song JOIN PerformedBy ON Song.songID = PerformedBy.songID JOIN artists ON PerformedBy.artistID = artists.artistID WHERE artists.artistID = \'' + artistID + "\';";
  connection.query(q, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(rows);
      res.render( 'songs.html', {songs:rows})
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

router.get('/similarSongsUser/:songID', function(req, res ) {
  console.log(req.params);
  res.render('index.html', {});
})

router.get('/songID/:songID/:rec', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  //var q2 = ' GROUP BY login'
  // you may change the query during implementation
  console.log(req.params);
  var songID = req.params.songID;
  var rec = req.params.rec;
  if (rec === "0") {
    query = "SELECT T.title, artists.name, T.num, T.songID " +
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
        console.log(rows.length);
        res.json(rows);
      }
    });
  } else {
    db.collection("cynthia").find({"track_id": songID}, {"_id":0, "similars":1}, function(err, cursor) {
      if (err) {
        console.log("errror ya bish")
        console.log(err.status);
        console.log(err.message);
      } else {
        doc = cursor.next();
        doc.then(function(result) {
          result = result.similars
          console.log(result);
          q = "SELECT S.title, A.name, S.songID FROM Song S JOIN PerformedBy P on S.songID = P.songID JOIN artists A on P.artistID = A.artistID";
          for (i = 0; i < 10 && i < result.length; i++) {
            if (i == 0){
              q = q + " WHERE S.songID = '" + result[i][0] + "'";
            } else {
              q = q + " OR S.songID = '" + result[i][0] + "'";
            }
          }
          q = q + ";";
          console.log(q);
          connection.query(q, function(err, rows, fields) {
            if (err) console.log(err);
            else {
              console.log(rows);
              res.json(rows);
            }
          });

        });
      }
    });
  }
});


module.exports = router;

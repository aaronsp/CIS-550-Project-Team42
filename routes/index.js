var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

router.get('/data/:email', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var friends_count_tbl = '(SELECT login, COUNT(login) as num FROM Friends GROUP BY login)'
  var query = 'SELECT p.*, f.num from Person p LEFT OUTER JOIN ' + friends_count_tbl + ' f on p.login = f.login';
  //var q2 = ' GROUP BY login'
  // you may change the query during implementation
  var email = req.params.email;
  if (email != 'undefined') query = query + ' where p.login ="' + email + '"';
  console.log(q);
  var q = 'SELECT * FROM artists Limit 4;'
  connection.query(q, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }
    });
});

router.get('/data/:login/:name/:sex/:RelationshipStatus/:Birthyear', function(req,res) {
  var query = 'INSERT INTO Person (login, name, sex, RelationshipStatus, Birthyear) VALUES ';
  var vals = '("'+ req.params.login + '","' + req.params.name + '","' + req.params.sex + '","'
  + req.params.RelationshipStatus + '",' + req.params.Birthyear + ')';
  query = query + vals;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    });
});

/*router.post('/data2in/', function(req, res) {
    var query = 'INSERT INTO Person (login, name, sex, relationshipStatus, birthyear) VALUES(';
    alert('hi');
});

// ----Your implemention of route handler for "Insert a new record" should go here-----
/*router.post('/insert/:login', function(req, res) {
    var query = 'INSERT INTO Person (login, name, sex, relationshipStatus, birthyear) VALUES(';
    var login = req.params.login;
    var name = 'huh';
    var sex = 'f';
    var rel_status = 'Single';
    var birth_year = '1997'
    if (login != 'undefined') {
      query += name + "\', \'" + sex + "\', \'" + rel_status + "\', \'" + birth_year + + "\');";
      console.log("query= " + query);
    }
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else console.log('added');
    });
});*/

module.exports = router;

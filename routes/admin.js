var express = require('express');
var util = require('../util.js');
var router = express.Router();

/* GET admin page - list organizations */
router.get('/', function(req, res, next) {
  res.send('respond with an admin resource');
});

/* POST add organization */
router.post('/add/', util.authenticateBody, function(req, res, next) {
  if (req.body.name == null) {
    return res.status(400).send('Cannot add, missing name argument');
  } else {
    var organizations = req.db.get("organizations");
    organizations.insert({
    name :      util.sanitize(req.body.name), 
    commitment: util.sanitize(req.body.commitment), 
    location :  util.sanitize(req.body.location), 
    semester :  util.sanitize(req.body.semester),
    audience :  util.sanitize(req.body.audience), 
    interest :  util.sanitize(req.body.interest)
    }, function(err, docs) {
      if (err) {return res.status(500).send("Internal server error");}
      return res.status(200).send('Added organization named "' + req.body.name + '"');
    });
  }
});

/* POST delete organization */
router.post('/delete/', function(req, res, next) {
  if (req.body.name == null) {
    res.send('Cannot delete, missing name argument');
  } else {
    
    res.send('Deleted organization named "' + req.body.name + '"');
  }
});

/* GET list of organizations */
router.get('/list', function(req, res, next) {
  var organizations = req.db.get("organizations");

  organizations.find({}, function(err, docs) {
    if (err) { return res.status(500).send("Internal server error"); }

    return res.status(200).send(docs);
  });
});


module.exports = router;

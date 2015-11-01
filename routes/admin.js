var express = require('express');
var router = express.Router();

/* GET admin page - list organizations */
router.get('/', function(req, res, next) {
  res.send('respond with an admin resource');
});

/* POST add organization */
router.post('/add/', function(req, res, next) {
  res.send('Added organization');
});

/* POST delete organization */
router.post('/delete/', function(req, res, next) {
  res.send('Deleted organization');
});


module.exports = router;

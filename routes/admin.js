var express = require('express');
var util = require('../util.js');
var router = express.Router();

/* GET admin page - list organizations */
router.get('/', function(req, res, next) {
  return res.ridirect('/admin/index.html');
});

router.post('/changepass/', util.authenticateBody, function(req, res, next) {
  var errMessage = "";

  errMessage = util.checkKeys(req.body, ["newPass", "newPassConf"]);

  var newHash = util.hashPass(util.sanitize(String(req.body.newPass)));
  var newHashConf = util.hashPass(util.sanitize(String(req.body.newPassConf)));

  if (newHash != newHashConf) {
    errMessage += "Passwords don't match;";
  }

  if (errMessage != "") {
    return res.status(400).send(errMessage);
  } else {
    var phashes = req.db.get("phashes");
    var oldHash = util.hashPass(util.sanitize(String(req.body.pass)));

    phashes.insert({phash: newHash}, function (err, added) {
      if (err) { return res.status(500).send("Internal server error"); }

      if (oldHash != newHash) {
        phashes.remove({phash: oldHash}, function (e) {
          return res.status(200).send("Password updated");
        });
      }
    });
  }
});

/* POST add organization */
router.post('/add/', util.authenticateBody, function(req, res, next) {
  if (req.body.name == null) {
    return res.status(400).send('Cannot add, missing name argument');
  } else {
    var organizations = req.db.get("organizations");
    // organizations.insert({
    var cleanOrg = {
      name      :  util.sanitize(req.body.name), 
      commitment:  util.sanitize(req.body.commitment), 
      location  :  util.sanitize(req.body.location), 
      semester  :  util.sanitize(req.body.semester),
      audience  :  util.sanitize(req.body.audience), 
      interest  :  util.sanitize(req.body.interest),
      link      :  util.sanitizeLink(req.body.url)
    };
    organizations.find({name: cleanOrg.name}, function(e, d) {
      if (e) { return res.status(500).send("Internal server error"); }
      if (d.length > 0) { return res.status(400).send("An organization by that name already exists."); }
      organizations.insert(cleanOrg, function(err, docs) {
        if (err) {return res.status(500).send("Internal server error");}
        return res.status(200).send('Added organization named "' + req.body.name + '"');
      });
    });
  }
});


/* POST delete organization */
router.post('/delete/', util.authenticateBody, function(req, res, next) {
  if (req.body.name == null) {
      res.send('Cannot delete, missing name argument');
  } else {
    var organizations = req.db.get("organizations");
    organizations.remove({
        name : util.sanitize(req.body.name)
    }, function (err, docs) {
        if (err) {return res.status(500).send("Internal server error");}
        res.send('Deleted organization named "' + req.body.name + '"');
    });
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

/* delete page */
router.get('/delete', function (req, res) {
    req.db.get('organizations').find({}, function(err,docs) {
        if (err) { return res.status(500).send("Internal server error"); }
        var names =  [];
        for (var i = 0; i < docs.length; i++) {
            names.push(docs[i].name);
        }
        res.render('delete', organizations=names);
    });
});    

module.exports = router;

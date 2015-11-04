var express = require('express');
var util = require('../util.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/groupquery', function(req, res, next) {
	var errMessage = '';

	var qList = util.questionList;

	// Check that we have proper keys in request body
	errMessage = util.checkKeys(req.query, qList);
	if (errMessage != '') {
		return res.status(400).send("Bad request body: missing fields");
	}

	var db = req.db;
	var organizations = db.get('organizations');

	var cleanAnswers = [];

	for (var i = 0; i < qList.length; i++) {
		cleanAnswers.push(util.sanitize(req.query[qList[i]]));
	}

	var maxMatch = 0;
	var matchScores = [];
	var localScore = 0;

	// Look at all data. Only viable because we're dealing with a small dataset
	// Should eventually add weighting in params of certain questions
	organizations.find({}, {}, function (err, allDocs) {
		// Basic error checking, falls through on success
	    if ((err) || (allDocs.length < 1)) { return res.status(500).send({error:'Lookup of organizations failed'}); }

		for (var i = 0; i < allDocs.length; i++) {
			localScore = 0;
			doc = allDocs[i];
			for (var j = 0; j < qList.length; j++) {
				if (util.stringOverlap(doc[qList[j]], cleanAnswers[j])) {
					localScore++;
				}
			}
			doc.score = localScore;
		}
		topDocs = allDocs.sort(function(a, b) {
			return b.score - a.score;
		}).slice(0, util.min_results);
		res.json(topDocs);
		// Return best match scores (maybe specifying minimum number)
	});
});

module.exports = router;

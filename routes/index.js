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

	var matchScores = [];
	var matches = [];
	var localScore = 0;
	var localMatches = [];
	var retDocs = [];
	var pastScore = null;
	var currentScore = null;
	var currentIndex = 0;
	var pastIndex = 0;

	for (var i = 0; i < qList.length; i++) { localMatches.push(false); }

	// Look at all data. Only viable because we're dealing with a small dataset
	// Should eventually add weighting in params of certain questions
	organizations.find({}, {}, function (err, allDocs) {
		// Basic error checking, falls through on success
	    if ((err) || (allDocs.length < 1)) { return res.status(500).send({error:'Lookup of organizations failed'}); }

		for (var i = 0; i < allDocs.length; i++) {
			localScore = 0;
			doc = allDocs[i];

			for (var x = 0; x < qList.length; x++) { localMatches[x] = false; }

			for (var j = 0; j < qList.length; j++) {
				if (util.stringOverlap(doc[qList[j]].toUpperCase(), cleanAnswers[j].toUpperCase())) {
					localScore++;
					localMatches[j] = true;
				}
			}

			//store index of score in array
			matchScores.push([localScore, i]);
			matches.push(localMatches.slice(0));
		}

		matchScores.sort(function(a, b) { return b[0] - a[0] });
		while (currentIndex < matchScores.length && currentIndex < util.min_results) {
			currentScore = matchScores[currentIndex][0];
			while (currentIndex < matchScores.length && matchScores[currentIndex][0] == currentScore) { 
				currentIndex++; 
			}
			if (currentIndex < util.max_results) {
				pastScore = currentScore;
				pastIndex = currentIndex;
			}
		}

		for (var i = 0; i < pastIndex; i++) {
			pushDoc(allDocs[matchScores[i][1]], qList, retDocs, matches[matchScores[i][1]]);
		}

		if (currentIndex > util.max_results) {
			var toSelect = util.min_results - pastIndex;
			var selection = matchScores.slice(pastIndex, currentIndex);
			util.shuffle(selection);
			for (var i = 0; i < toSelect; i++) {
				pushDoc(allDocs[selection[i][1]], qList, retDocs, matches[selection[i][1]]);
			}
		}

		// Return best matches, specifying what is mismatched
		return res.status(200).json(retDocs);
	});
});

function pushDoc(oldDoc, qList, retDocs, matches) {
	var newDoc = {};
	newDoc.name = oldDoc.name;
	var mismatches = [];
	for (var j=0; j < qList.length; j++) {
		newDoc[qList[j]] = oldDoc[qList[j]];
		if (matches[j] == false) {
			mismatches.push(qList[j].toLowerCase());
		}
	}
	newDoc.mismatches = mismatches.slice(0);

	retDocs.push(newDoc);
}

module.exports = router;

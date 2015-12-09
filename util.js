var sha512 = require('js-sha512');

var exports = module.exports = {};

exports.sanitize = function (text) {
	var match = /[<>;&\*\\/\^_~()]/gi;
	return String(text).replace(match, '');
}

exports.sanitizeLink = function (text) {
	var match = /[<>;&\*\\/\^_~()]/gi;
	return String(text).replace(match, '');
}

exports.hashPass = function (password) {
	return sha512(password+process.env.HASHSALT);
}

exports.checkKeys = function (body, fields) {
	var errorMessage = '';
	var key = '';

	// Ensure all fields exist
	for (var i = 0; i < fields.length; i++) {
		key = fields[i];
		if (!(key in body)) {
			errorMessage += key + ' missing!;';
		}
	}

	return errorMessage;
}

exports.stringOverlap = function (left, right) {
	if (!((left) && (right))) { return ''; }
	if (left == undefined) { return ''; }
	if (right == undefined) { return ''; }

	var retString = '';

	var l = left.toLowerCase();
	var r = right.toLowerCase();

	for (var i = 0; i < l.length; i++) {
		if (r.indexOf(l[i]) != -1) {
			retString += l[i];
		}
	}

	// Fall through
	return retString;
}

exports.authenticateBody = function(req, res, next) {
	var phashes = req.db.get('phashes');

	if (! "pass" in req.body) {
		return res.status(400).send("Bad request");
	}

	// Hash a cleaned password input
	var hashedPass = exports.hashPass(exports.sanitize(String(req.body.pass)));
	console.log(hashedPass);

	// See if pass exists in phashes collection
	phashes.find({phash: hashedPass}, function(err, docs) {
		if (err) { return res.status(500).send("Internal server error"); }

		if (docs.length < 1) {
			return res.status(401).send("Not authorized");
		} else {
			next();
		}
	});
}

exports.authenticateQuery = function(req, res, next) {
	var phashes = req.db.get('phashes');

	if (! "pass" in req.query) {
		return res.status(400).send("Bad request");
	}

	// Hash a cleaned password input
	var hashedPass = exports.hashPass(exports.sanitize(String(req.query.pass)));
	console.log(hashedPass);

	// See if pass exists in phashes collection
	phashes.find({phash: hashedPass}, function(err, docs) {
		if (err) { return res.status(500).send("Internal server error"); }

		if (docs.length < 1) {
			return res.status(401).send("Not authorized");
		} else {
			next();
		}
	});
}

exports.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// All caps, all singular, all one word, all nouns
exports.questionList = ['commitment', 'location', 'semester', 'audience', 'interest'];

//number of results minimum/maximum for group query
exports.min_results = 3;
exports.max_results = 5;
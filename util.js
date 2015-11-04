var sha512 = require('js-sha512');

var exports = module.exports = {};

exports.sanitize = function (text) {
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
	var retString = '';

	var l = left.toUpperCase();
	var r = right.toUpperCase();

	for (var i = 0; i < l.length; i++) {
		if (r.indexOf(l[i]) != -1) {
			retString += l[i];
		}
	}

	// Fall through
	return retString;
}

// All caps, all singular, all one word, all nouns
exports.questionList = ['COMMITMENT', 'LOCATION', 'SEMESTER', 'AUDIENCE', 'INTEREST'];

//number of results minimum for group query
exports.min_results = 5;
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
	for (var i = 0; i < left.length; i++) {
		if (right.indexOf(left[i]) != -1) {
			return true;
		}
	}

	// Fall through
	return false;
}

// All caps, all singular, all one word, all nouns
exports.questionList = ['COMMITMENT', 'LOCATION', 'SEMESTER', 'AUDIENCE', 'INTEREST'];
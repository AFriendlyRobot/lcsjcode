var questions = ['#commitment', "#location", "#semester", "#audience", "#interest"]
var qNames = ["commitment", "location", "semester", "audience", "interest"]

$(document).ready(function () {
	$('#request-button').click(function(elem) {
		elem.preventDefault();

		// Parse parameters into query
		var params = [];
		var localParam = "";

		for (var i = 0; i < qNames.length; i++) {
			localParam = "";
			localParam += qNames[i].toUpperCase() + "=";
			localParam += $(questions[i]).val();
			params.push(localParam);
		}

		var paramString = params.join("&");

		// Send query to our API
		$.ajax({
			type:"GET",
			url:"https://shielded-atoll-8269.herokuapp.com/groupquery?"+paramString,
			// url: "http://localhost:3000/groupquery?"+paramString,
			success:successCallback,
			failure:failureCallback
		});
	});
});

function successCallback(response) {
	var fullHTML = '';

	for (var i = 0; i < response.length; i++) {
		// console.log(response[i].name);
		fullHTML += formatOrganization(response[i]);
	}

	$('#response-div').html(fullHTML);
	// console.log(response);
}

function failureCallback(response) {
	console.log(response);
}

function formatOrganization(orgDoc) {
	var html = '';
	html += '<div id="' + orgDoc.name + ', class="text-center">';
	html += '<p class="text-center">'
	html += "<b>" + orgDoc.name + "</b>";
	html += "<br />";

	if (orgDoc.mismatches && orgDoc.mismatches.length > 0) {
		html += "Mismatches: ";

		html += orgDoc.mismatches.join(', ');
	}

	html += "</p></div>";

	return html;
}
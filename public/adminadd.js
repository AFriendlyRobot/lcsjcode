var questions = ["#commitment", "#location", "#semester", "#audience", "#interest"]
var qNames = ["commitment", "location", "semester", "audience", "interest"]
var qText = ["#name", "#pass", "#url"]
var qDivs = [];

var smallToggled = false;

var smallCutoff = 900;

var questionIndex = 0;

$(document).ready(function () {
	findQuestions();
	sizeInit();
	$(window).resize(sizeHandler);
	$('#request-button').click(sendRequest);
	$('#nextBtn').click(clickNext);
	$('#backBtn').click(clickBack);
});

function findQuestions() {
	$('.form-question').each(function (i, elem) {
		qDivs.push(elem);
	});

	smallToggled = true;
}

function sizeInit() {
	if ($(window).width() < smallCutoff) {
		$(qDivs).each(function (i, elem) {
			$(elem).addClass("inactive-question");
		});

		$(qDivs[questionIndex]).removeClass("inactive-question").addClass('active-question');

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).show();
		});

		smallToggled = true;
	} else if ($(window).width() >= smallCutoff) {
		$(qDivs).each(function (i, elem) {
			$(elem).removeClass("inactive-question").removeClass("active-question");
		});

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).hide();
		});

		smallToggled = false;
	}
}

function sizeHandler() {
	if ((!smallToggled) && ($(window).width() < smallCutoff)) {
		$(qDivs).each(function (i, elem) {
			$(elem).addClass("inactive-question");
		});

		$(qDivs[questionIndex]).removeClass("inactive-question").addClass('active-question');

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).show();
		});

		smallToggled = true;
	} else if ((smallToggled) && ($(window).width() >= smallCutoff)) {
		$(qDivs).each(function (i, elem) {
			$(elem).removeClass("inactive-question").removeClass("active-question");
		});

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).hide();
		});

		smallToggled = false;
	}
}

function sendRequest(elem) {
	elem.preventDefault();

	var params = {};

	var localParam = "";

	for (var i = 0; i < qNames.length; i++) {
		localParam = "";
		$(questions[i] + ' input:checked').each(function(){localParam += $(this).val();});

		params[qNames[i].toLowerCase()] = localParam;
	}

    for (var i = 0; i < qText.length; i++) {
        // Remove '#'
        params[qText[i].slice(1)] = $(qText[i]).val();
    }

    // Clear the response div
    $('#response-div').html("");

	// Send query to our API
	$.ajax({
		type:"POST",
		// url:"http://localhost:3000/admin/add",
		// url:"https://shielded-atoll-8269.herokuapp.com/admin/add",
		url: "/admin/add",
		data: params,
		success:successCallback,
		failure:failureCallback,
		error:failureCallback
	});
}

function clickNext(elem) {
	elem.preventDefault();

	if (smallToggled) {
		activateQuestion(questionIndex + 1);
	}
}

function clickBack(elem) {
	elem.preventDefault();

	if (smallToggled) {
		activateQuestion(questionIndex - 1);
	}
}

function successCallback(response) {
	// var fullHTML = '';

	// for (var i = 0; i < response.length; i++) {
	// 	// console.log(response[i].name);
	// 	fullHTML += formatOrganization(response[i]);
	// }

	// $('#response-div').html(fullHTML);
	// // console.log(response);

	$('#response-div').html(response);
}

function failureCallback(response) {
	$('#response-div').html("ERROR: " + response.responseText);
	console.log(response);
	// console.log(response);
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

function boundIndex() {
	if (questionIndex >= qDivs.length) {
		questionIndex = qDivs.length - 1;
	}

	if (questionIndex < 0) {
		questionIndex = 0;
	}
}

function activateQuestion(newInd) {
	var oldInd = questionIndex;
	questionIndex = newInd;

	boundIndex();

	$(qDivs[oldInd]).removeClass("active-question").addClass("inactive-question");

	$(qDivs[questionIndex]).removeClass("inactive-question").addClass("active-question");
}

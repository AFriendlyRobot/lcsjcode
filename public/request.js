var questions = ['#commitment', "#location", "#semester", "#audience", "#interest"]
var qNames = ["commitment", "location", "semester", "audience", "interest"]
var qDivs = [];

var smallToggled = false;

var smallestCutoff = 550;
var smallCutoff = 900;

var questionIndex = 0;

$(document).ready(function () {
	findQuestions();
	sizeInit();
	$(window).resize(sizeHandler);
	$('.opt-img').click(selectOpt);
	$('.opt-text').click(selectTextOpt);
	$('#request-button').click(sendRequest);
	$('#nextBtn').click(clickNext);
	$('#backBtn').click(clickBack);
	$('#return-btn').click(showForm);
	$('#botBackBtn').click(clickBack);
	$('#botNextBtn').click(clickNext);
});

function findQuestions() {
	$('.form-question').each(function (i, elem) {
		qDivs.push(elem);
	});

	smallToggled = true;
}

function sizeInit() {
	if (true || ($(window).width() < smallestCutoff)) {
		$(qDivs).each(function (i, elem) {
			$(elem).addClass("inactive-question");
		});

		$(qDivs[questionIndex]).removeClass("inactive-question").addClass('active-question');

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).show();
		});

		limitButtons();

		smallToggled = true;

		setIndexString();
	} else if ($(window).width() >= smallestCutoff) {
		$(qDivs).each(function (i, elem) {
			$(elem).removeClass("inactive-question").removeClass("active-question");
		});

		$(".question-nav-btn").each(function (i, elem) {
			$(elem).hide();
		});

		smallToggled = false;
	}

	sizeHandler();
}

function sizeHandler() {
	if ($(window).width() < smallestCutoff) {
		console.log('smaller');
		// $(qDivs).each(function (i, elem) {
		// 	$(elem).addClass("inactive-question");
		// });

		// $(qDivs[questionIndex]).removeClass("inactive-question").addClass('active-question');

		// $(".question-nav-btn").each(function (i, elem) {
		// 	$(elem).show();
		// });

		// limitButtons();

		// smallToggled = true;

		$('#backBtn').hide();
		$('#nextBtn').hide();
		$('#backBtn').css('visibility', 'hidden');
		$('#nextBtn').css('visibility', 'hidden');

		$('#botBackBtn').show();
		$('#botNextBtn').show();
		$('#botBackBtn').css('visibility', 'visible');
		$('#botNextBtn').css('visibility', 'visible');

		limitButtons();
	} else if ($(window).width() >= smallestCutoff) {
		console.log('bigger');
		// $(qDivs).each(function (i, elem) {
		// 	$(elem).removeClass("inactive-question").removeClass("active-question");
		// });

		// $(".question-nav-btn").each(function (i, elem) {
		// 	$(elem).hide();
		// });

		// smallToggled = false;

		$('#backBtn').show();
		$('#nextBtn').show();
		$('#backBtn').css('visibility', 'visible');
		$('#nextBtn').css('visibility', 'visible');
		
		$('#botBackBtn').hide();
		$('#botNextBtn').hide();
		$('#botBackBtn').css('visibility', 'hidden');
		$('#botNextBtn').css('visibility', 'hidden');
		
		limitButtons();
	}
}

function selectOpt() {
	var check = $(this).siblings(".opt-input");
	check.prop("checked", !check.prop("checked"));

	$(this).toggle();
	$(this).siblings("img").toggle();
}

function selectTextOpt() {
	var check = $(this).siblings(".opt-input");
	check.prop("checked", !check.prop("checked"));

	$(this).toggleClass('opt-selected-text');
	$(this).toggleClass('opt-unselected-text');
	$(this).find('.opt-text-text').toggleClass('selected-text');
}

function sendRequest(elem) {
	elem.preventDefault();

	// Parse parameters into query
	var params = [];
	var localParam = "";

	var selected = "";
	$('#checkboxes input:checked').each(function() {
		selected.push($(this).val());
	});

	for (var i = 0; i < qNames.length; i++) {
		localParam = "";
		localParam += qNames[i].toLowerCase() + "=";
		$(questions[i] + ' input:checked').each(function(){localParam += $(this).val();});
		params.push(localParam);
	}

	var paramString = params.join("&");

	console.log (paramString);

	// Send query to our API
	$.ajax({
		type:"GET",
		// url:"https://shielded-atoll-8269.herokuapp.com/groupquery?"+paramString,
		// url: "http://localhost:3000/groupquery?"+paramString,
		url: "/groupquery?"+paramString,
		success:successCallback,
		failure:failureCallback
	});

	showResponse();
}

function clickNext(elem) {
	elem.preventDefault();
	console.log('next');

	if (smallToggled) {
		activateQuestion(questionIndex + 1);
	}
}

function clickBack(elem) {
	elem.preventDefault();
	console.log('back');

	if (smallToggled) {
		activateQuestion(questionIndex - 1);
	}
}

function successCallback(response) {
	var fullHTML = '';

	for (var i = 0; i < response.length; i++) {
		// console.log(response[i].name);
		fullHTML += formatOrganization(response[i]);
	}

	$('#response-div div.container').html(fullHTML);
	// console.log(response);
}

function failureCallback(response) {
	console.log(response);
}

function showResponse() {
	$("#question-form").removeClass("active-content").addClass("inactive-content");
	$("#response-div").removeClass("inactive-content").addClass("active-content");
}

function showForm() {
	$("#response-div").removeClass("active-content").addClass("inactive-content");
	$("#question-form").removeClass("inactive-content").addClass("active-content");	
	emptyResponse();
}

function formatOrganization(orgDoc) {
	var html = '';
	html += '<div id="' + orgDoc.name + ', class="text-center">';
	html += '<p class="text-center">'
	html += "<b><a class=\"org-link\" href=\"" + orgDoc.link + "\">" + orgDoc.name + "</a></b>";
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

	limitButtons();

	$(qDivs[oldInd]).removeClass("active-question").addClass("inactive-question");

	$(qDivs[questionIndex]).removeClass("inactive-question").addClass("active-question");

	setIndexString();
}

function setIndexString() {
	var indexString = String(questionIndex+1) + " / " + String(qDivs.length);
	$("#questionIndex").text(indexString);
}

function limitButtons() {
	$('#botBackBtn').css('visibility', 'visible');
	$('#botNextBtn').css('visibility', 'visible');
	$('#backBtn').css('visibility', 'visible');
	$('#nextBtn').css('visibility', 'visible');

	if (questionIndex == 0) {
		// Turn off back button
		$('#backBtn').css('visibility', 'hidden');
		$('#botBackBtn').css('visibility', 'hidden');
	} else if ($(window).width >= smallestCutoff) {
		$('#botBackBtn').show();
		$('#botBackBtn').css('visibility', 'hidden');
	}

	if (questionIndex == qDivs.length - 1) {
		// Turn off next button
		$('#nextBtn').css('visibility', 'hidden');
		$('#botNextBtn').hide();
		$('#request-button').show();
	} else {
		if ($(window).width < smallestCutoff) {
			$('#botNextBtn').show();
		}

		$('#request-button').hide();
	}
}

function emptyResponse() {
	$('#response-div div.container').html("Waiting for server");
}
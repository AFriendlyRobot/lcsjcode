var qText = ["#name", "#pass"]

$(document).ready(function () {
	$('#request-button').click(sendRequest);
});

function sendRequest(elem) {
	elem.preventDefault();

	var params = {};

	var localParam = "";

    for (var i = 0; i < qText.length; i++) {
        params[qText[i].slice(1)] = $(qText[i]).val();
    }
    console.log(params);

	// Send query to our API
	$.ajax({
		type:"POST",
		url:"http://localhost:3000/admin/delete",
		// url: "http://localhost:3000/groupquery?"+paramString,
		data: params,
		success:successCallback,
		failure:failureCallback
	});
}

function successCallback(response) {
	$('#response-div').html(response);
}

function failureCallback(response) {
	console.log(response);
}

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

    // Clear response div
    $('#response-div').html("");

	// Send query to our API
	$.ajax({
		type:"POST",
		// url:"http://localhost:3000/admin/delete",
		url: "/admin/delete",
		// url: "http://localhost:3000/groupquery?"+paramString,
		data: params,
		success:successCallback,
		failure:failureCallback,
		error:failureCallback
	});
}

function successCallback(response) {
	$('#response-div').html(response);
}

function failureCallback(response) {
	$('#response-div').html(response.responseText);
}

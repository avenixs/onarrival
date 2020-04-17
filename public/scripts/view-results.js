const getCompanyName = () => {
    $.ajax({
        url: "/enterprise/current-company-name",
        method: "GET",
        data: null,
        success: data => {
            $("#bar-company-name").html(data.name);
        }
    });
};

const getResults = () => {
    $("#results-info").empty();
    $("#results-rows").empty();

    $("#results-info").append('<div class="spinner-border res-spin" role="status"><span class="sr-only">Loading...</span></div>');

    $.ajax({
        url: "/enterprise/students/get-student-results",
        method: "POST",
        data: { id: $("#resultsOfStudent").val() },
        success: data => {
            $(".res-spin").remove();
            if(data.results.length > 0) {
                for(let i=0; i<data.results.length; i++) {
                    let score = eval(data.results[i].pointsReceived) / eval(data.results[i].pointsMax) * 100;
                    $("#results-rows").append("<tr><td>" + eval(i+1) + "</td><td>" + data.results[i].ComprehensionExercise.name + "</td><td>" + data.results[i].pointsReceived + "/" + data.results[i].pointsMax + "</td><td>" + score + "%" + "</td></tr>");
                }
            } else {
                $("#results-info").append('<p>This student has not completed any exercise yet.</p>');
            }
        }
    })
}


getCompanyName();

$("#resultsOfStudent").change(getResults);
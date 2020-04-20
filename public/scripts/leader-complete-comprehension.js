let retakes = 0;

const playAudio = () => {
    $("#play-audio").append('<div class="spinner-border spinner-border-sm spin-btn" role="status"><span class="sr-only">Loading...</span></div>');
    $.ajax({
        url: "/student/chapters/get-audio",
        method: "GET",
        data: { id: $("#exerciseId").val() },
        success: received => {
            $("#play-audio").replaceWith('<audio controls><source src="/recordings/' + received.file + '" type="audio/mpeg"></audio>');
        }
    });
};

const checkTranslation = () => {
    $("#check-translation").append('<div class="spinner-border spinner-border-sm spin-btn" role="status"><span class="sr-only">Loading...</span></div>');
    $.ajax({
        url: "/student/chapters/get-text-translation",
        method: "GET",
        data: { id: $("#exerciseId").val() },
        success: received => {
            $("#check-translation").replaceWith('<button class="btn btn-warning" id="hide-translation">Hide translation</button>')
            $("#listening-text").append('<div class="compreh-box" id="text-translated">' + received.translation + '</div>');

            $("#hide-translation").click(() => {
                $("#text-translated").remove();
                $("#hide-translation").replaceWith('<button class="btn btn-warning" id="check-translation">View translation</button>');

                $("#check-translation").click(checkTranslation);
            });
        }
    });
};

const answerQuestions = () => {
    $("#answer-questions").append('<div class="spinner-border spinner-border-sm spin-btn" role="status"><span class="sr-only">Loading...</span></div>');

    $.ajax({
        url: "/student/chapters/get-test-questions",
        method: "GET",
        data: { id: $("#exerciseId").val() },
        success: received => {
            $("#listening-text").append('<div class="compreh-box" id="text-questions" style="display: none"></div>');
            let que = JSON.parse(received.questions);
            if(que.length == 0) {
                alert("There are no questions in this exercise.");
                $(".spin-btn").remove();
                $("#answer-questions").prop("disabled", true);
            } else {
                for(let i=0; i<que.length; i++) {
                    let answers = "";
                    for(let a=0; a<que[i][1].length; a++) {
                        answers = answers + '<div class="answer-line"><input type="checkbox" value="' + que[i][1][a].isCorrect + '"><label>' + que[i][1][a].answerEnglish + '</label></div>';
                    };
                    $("#text-questions").append('<div class="new-que"><h3 style="text-align: left !important">' + eval(i+1) + ". " + que[i][0].questionEnglish + '</h3>' + answers + '</div>');
                };
                $("#text-questions").append('<button class="btn btn-sm btn-success" id="submit-questions" disabled>Submit</button>');
                $("#answer-questions").remove();
                $("#text-questions").css("display", "unset");
            }
        }
    });
}

$("#play-audio").click(playAudio);
$("#check-translation").click(checkTranslation);
$("#answer-questions").click(answerQuestions);
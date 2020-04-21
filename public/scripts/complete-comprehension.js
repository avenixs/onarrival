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
                $("#text-questions").append('<button class="btn btn-sm btn-success" id="submit-questions">Submit</button>');
                $("#answer-questions").remove();
                $("#text-questions").css("display", "unset");
            }

            $("#submit-questions").click(() => {
                $("body").append("<div id='popup-window' class='result-popup'><div id='window-words'><div id='word-spinner' class='spinner-border text-dark' role='status'><span class='sr-only'>Loading...</span></div></div></div>");
                
                $("#window-cover").css("display", "unset");
                $("#popup-window").css("display", "unset");

                let questions = $("#text-questions").children(".new-que");
                let maxScore = questions.length;
                let totalScore = 0;

                for(let i=0; i<questions.length; i++) {
                    let ansToQ = questions[i].children;
                    let score = 1;
                    for(let a=0; a<ansToQ.length; a++) {
                        if(ansToQ[a].getAttribute("class") == "answer-line") {
                            let answToCheck = ansToQ[a].children[0];
                            if((answToCheck.checked == true && answToCheck.value == "false") || (answToCheck.checked == false && answToCheck.value == "true")) {
                                score = 0;
                            }
                        }
                    }
                    totalScore += score;
                };

                $("#word-spinner").remove();
                let scorePercent = totalScore/maxScore*100;
                $("#window-words").append('Your result: ' + totalScore + "/" + maxScore);
                $("#window-words").append('<br />It is ' + scorePercent + "%");

                if(retakes < 1) {
                    $("#window-words").append('<button class="btn btn-warning" id="correct-questions">Retake</button>');
                    $("#window-words").append('<button class="btn btn-success" id="save-results">Save result</button>');

                    $("#correct-questions").click(() => {
                        retakes++;
                        $("#popup-window").remove();
                        $("#window-cover").css("display", "none");
                    });

                    $("#save-results").click(() => {
                        $("#correct-questions").remove();
                        $("#save-results").append('<div class="btn-spin spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>');
                        $("#window-words").append("<p id='saving-res'>Saving your results...</p>");

                        $.ajax({
                            url: "/student/chapters/save-test-result",
                            method: "GET",
                            data: { id: $("#exerciseId").val(), maxScore: maxScore, totalScore: totalScore },
                            success: received => {
                                $("#saving-res").remove();
                                $("#window-words").append("<p id='saving-res'>Results saved!</p>");
                                
                                setTimeout(() => {window.location.replace("/student/panel")}, 900);
                            }
                        });
                    });
                } else {
                    $("#window-words").append("<p id='saving-res'>Saving your results...</p>");

                    $.ajax({
                        url: "/student/chapters/save-test-result",
                        method: "GET",
                        data: { id: $("#exerciseId").val(), maxScore: maxScore, totalScore: totalScore },
                        success: received => {
                            $("#saving-res").remove();
                            $("#window-words").append('<button class="btn btn-success" id="close-exercise" style="margin-top: 1rem">Close</button>');

                            $("#window-words").click(() => {
                                window.location.replace("/student/panel");
                            })
                        }
                    })
                }
            })
        }
    });
}

$("#play-audio").click(playAudio);
$("#check-translation").click(checkTranslation);
$("#answer-questions").click(answerQuestions);
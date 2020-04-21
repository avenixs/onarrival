const getCompanyName = () => {
    $.ajax({
        url: "/enterprise/current-company-name",
        method: "GET",
        data: null,
        success: function(data){
            $("#bar-company-name").html(data.name);
        }
    });
};

$(".deleteQBtn").click(event => {
    event.target.parentElement.parentElement.remove();
});

$("#queSaveChanges").click(event => {
    $("#queSaveChanges").append('<div class="btn-spin spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>');

    let qs = $("#questionsForEx").children();
    let questions = [];
    for(let i=0; i<qs.length; i++){
        let answers = [];
        for(let a=0; a<qs[i].children.length; a++) {
            if(qs[i].children[a].className == "answerLine") {
                if(!(qs[i].children[a].children[0].value == "")) {
                    let answer = {
                        text: qs[i].children[a].children[0].value,
                        correct: qs[i].children[a].children[1].checked ? true : false,
                        id: qs[i].children[a].children[2].value
                    };
                    answers.push(answer);
                } else { 
                    $(".btn-spin").remove();
                    return alert("Please fill in all the answers.");
                }
            }
        }
        let question = {
            questionEng: qs[i].children[1].children[0].value,
            questionFor: qs[i].children[1].children[1].value,
            id: qs[i].children[1].children[2].value,
            answers: JSON.stringify(answers)
        };

        if(question.questionEng == "" || question.questionFor == "") {
            $(".btn-spin").remove();
            return alert("Please fill in all the questions.");
        }

        questions.push(question);
    };

    let dataToSend = {
        questions: questions
    };

    $.ajax({
        url: "/enterprise/exercises/comprehension/save-edited-questions",
        method: "GET",
        data: dataToSend,
        success: (data) => {
            $(".btn-spin").remove();
            $("#editQueModal").modal("show");
            window.scrollTo(0, 0);
        }
    });
})

getCompanyName();


$(".view-btn").click(event => {
    $("body").append("<div id='popup-window'><div id='top-stripe'><p id='close-popup'>&#10005;</p></div>" + 
    "<div id='window-words'><input id='ex-chosen-value' type='hidden' value='00'><div id='word-spinner' class='spinner-border text-dark' role='status'><span class='sr-only'>Loading...</span></div></div></div>");
    $("#ex-chosen-value").val($(".view-btn").val());
    $("#window-cover").css("display", "unset");
    $("#popup-window").css("display", "unset");

    let exerciseId = { id: $("#ex-chosen-value").val() };

    $.ajax({
        url: "/enterprise/exercises/vocab/get-words",
        method: "GET",
        data: exerciseId,
        success: function(data){
            let wordList = data.words;
            console.log(wordList);

            let table = '<h2>WORD LIST</h2><table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">Word</th><th scope="col">Translation</th><th scope="col">Example Sentence</th></tr></thead><tbody>';

            for(let i=0; i<wordList.length; i++) {
                table = table + "<tr><td>" + eval(i+1) + "</td><td>" + wordList[i].wordEnglish + "</td><td>" + wordList[i].wordForeign + "</td><td>" + wordList[i].exSentenceForeign + "</td></tr>";
            }

            table.concat("</tbody></table>");

            $("#word-spinner").remove();
            $("#window-words").css("justify-content", "unset");
            $("#window-words").append(table);
        }
    });

    $("#top-stripe").click(() => {
        document.getElementById("popup-window").animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], 300);
        setTimeout(() => { $("#popup-window").remove(); $("#window-cover").css("display", "none"); }, 300);
    })
});

$(".add-btn").click(event => {
    let wordCount = 0;

    $("body").append("<div id='popup-window'><div id='top-stripe'><p id='close-popup'>&#10005;</p></div>" + 
    "<div id='window-words'><input id='ex-chosen-value' type='hidden' value='00'><p id='word-counter'>" + wordCount + " new words added</p><h2>ADD A NEW WORD</h2><form id='add-word-form'><div class='form-row'><div class='form-group col-md-6'><label for='wordEng'>Word in English</label><input type='text' class='form-control' name='wordEng' id='wordEng' required></div><div class='form-group col-md-6'><label for='wordForeign'>Translation</label><input type='text' class='form-control' name='wordForeign' id='wordForeign' required></div></div><div class='form-row'><div class='form-group col-md-12'><label for='exSentEng'>Example Sentence in English</label><textarea class='form-control' row='1' name='exSentEng' id='exSentEng' required></textarea></div></div><div class='form-row'><div class='form-group col-md-12'><label for='exSentForeign'>Translated Example Sentence</label><textarea class='form-control' row='1' name='exSentForeign' id='exSentForeign' required></textarea></div></div><button type='button' id='submit-word-button' class='btn btn-success'>Save</button></form></div>");
    $("#ex-chosen-value").val($(".view-btn").val());
    $("#window-words").css("justify-content", "flex-start");
    $("#window-cover").css("display", "unset");
    $("#popup-window").css("display", "unset");

    $("#top-stripe").click(() => {
        closePopup();
    });

    $("#submit-word-button").click(() => {
        $("#window-words").append("<div id='adding-spinner' class='spinner-border text-dark' style='margin-top: 1rem;' role='status'><span class='sr-only'>Loading...</span></div>");

        let newAddedWord = {
            wordEng: $("#wordEng").val(),
            wordFor: $("#wordForeign").val(),
            exSentEng: $("#exSentEng").val(),
            exSentForeign: $("#exSentForeign").val(),
            vocabExId: $("#ex-chosen-value").val()
        };

        console.log(newAddedWord);

        $.ajax({
            url: "/enterprise/exercises/vocab/add-word",
            method: "GET",
            data: newAddedWord,
            success: data => {
                let success = data.success;
                
                if(success) {
                    document.getElementById("add-word-form").reset();
                    $("#adding-spinner").remove();

                    wordCount++;
                    if(wordCount==1) {
                        $("#word-counter").text(wordCount + " new word added");
                    } else {
                        $("#word-counter").text(wordCount + " new words added");
                    }
                }
            }
        });
    }); 
});

$("#window-cover").click(() => {
    closePopup();
})

const closePopup = () => {
    document.getElementById("popup-window").animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], 300);
    setTimeout(() => { $("#popup-window").remove(); $("#window-cover").css("display", "none"); }, 300);
};
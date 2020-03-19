let wordIDs = [];
let wordsEng = [];
let wordsFor = [];
let sentencesEng = [];
let sentencesFor = [];
let count = 0;

$("#start-btn").click(() => {
    $("#learning-words-window").append("<div id='white-cover'><div id='update-word-spinner' class='spinner-border text-dark' role='status'><span class='sr-only'>Loading...</span></div></div>");
    $("#content-to-blur").css("filter", "blur(2px)");
    $("#content-to-blur").css("-webkit-filter", "blur(2px)");

    let exId = { id: $("#id-of-ex").val() };

    $.ajax({
        url: "/student/chapters/find-exercise-words",
        method: "GET",
        data: exId,
        success: data => {
            let entries = data.words;
            for(let i=0; i<entries.length; i++) {
                wordIDs.push(entries[i].id);
                wordsEng.push(entries[i].wordEnglish);
                wordsFor.push(entries[i].wordForeign);
                sentencesEng.push(entries[i].exSentenceEng);
                sentencesFor.push(entries[i].exSentenceForeign);
            };

            $("#content-to-blur").fadeOut("slow", () => {
                $("#content-to-blur").remove();
                if(!(wordsEng.length == 0)) {
                    $("#learning-words-window").append("<div class='word-presentation' id='word-in-eng'><p class='main-word'>" + wordsEng[count] + "</p><p class='sentence-presentation'>" + sentencesEng[count] + "</p></div>");
                } else {
                    $("#learning-words-window").append("<div class='word-presentation'><img id='thick-tick' src='/media/icons/thick-tick.png' alt='Tick'><p class='sentence-presentation'>There are no more words to learn in this exercise.</p><a href='../learn'><img src='/media/icons/return.png' alt='Return'></a></div>");
                }

                $("#white-cover").fadeOut("slow", () => {
                    $("#white-cover").remove();
                });

                $("#learning-words-window").click(() => {
                    if((!($("#learning-words-window").children().length > 1)) && (wordsEng.length > 0)) {
                        $("#learning-words-window").append("<div class='word-presentation' id='word-in-for'><input type='hidden' id='shown-word-id' value='" + wordIDs[count] + "'><p class='main-word'>" + wordsFor[count] + "</p><p class='sentence-presentation'>" + sentencesFor[count] + "</p></div><div class='correct-btns'><img src='/media/icons/dislike.png' alt='Incorrect' id='incorrect-word'><img src='/media/icons/like.png' alt='Correct' id='correct-word'></div>");

                        $("#incorrect-word").click(() => {
                            document.getElementById("incorrect-word").animate([{ transform: "scale(1)" }, { transform: "scale(1.5)" }], 150);
                            setTimeout(() => { 
                                document.getElementById("incorrect-word").animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], 200);
                            }, 150);

                            setTimeout(() => { 
                                $("#incorrect-word").remove();
                                document.getElementById("learning-words-window").animate([{ transform: "scale(1) rotate(0deg)" }, { transform: "scale(0) rotate(140deg)" }], 600);
                            }, 350);
                            
                            setTimeout(() => { 
                                $("#learning-words-window").children().remove();
                                setTimeout(() => { 
                                    count++;
                                    if(count == wordsEng.length) { count = 0 };
                                    $("#learning-words-window").append("<div class='word-presentation' id='word-in-eng'><p class='main-word'>" + wordsEng[count] + "</p><p class='sentence-presentation'>" + sentencesEng[count] + "</p></div>");
                                }, 100);
                            }, 950);
                        });
                        
                        $("#correct-word").click(() => {
                            let shownWordId = { id: $("#shown-word-id").val() };

                            document.getElementById("correct-word").animate([{ transform: "scale(1)" }, { transform: "scale(1.5)" }], 150);
                            setTimeout(() => { 
                                document.getElementById("correct-word").animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], 200);
                            }, 150);

                            setTimeout(() => { 
                                $("#correct-word").remove();
                                document.getElementById("learning-words-window").animate([{ transform: "scale(1) rotate(0deg)" }, { transform: "scale(0) rotate(140deg)" }], 600);
                            }, 350);
                            
                            setTimeout(() => { 
                                $("#learning-words-window").children().remove();
                                setTimeout(() => { 
                                    wordsEng.splice(count, 1);
                                    wordsFor.splice(count, 1);
                                    sentencesEng.splice(count, 1);
                                    sentencesFor.splice(count, 1);
                                    wordIDs.splice(count, 1);
                                    if((count == wordsEng.length) && (wordsEng != 0)) { count = 0 };
                                    if(wordsEng == 0) {
                                        $("#learning-words-window").append("<div class='word-presentation'><img src='/media/icons/confetti.png' id='confetti'><p class='main-word'>Congratulations!</p><p class='sentence-presentation'>You have completed this exercise.</p><a href='../' class='btn btn-success'>Back</a></div>");
                                    } else {
                                        $("#learning-words-window").append("<div class='word-presentation' id='word-in-eng'><p class='main-word'>" + wordsEng[count] + "</p><p class='sentence-presentation'>" + sentencesEng[count] + "</p></div>");
                                    }
                                }, 100);
                            }, 950);

                            $.ajax({
                                url: "/student/chapters/set-word-remembered",
                                method: "GET",
                                data: shownWordId,
                                success: data => { console.log("Remembered"); }
                            });
                        });

                    }
                })

            });
        }
    });
})
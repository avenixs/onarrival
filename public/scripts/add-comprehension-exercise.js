let seconds = 0;
let intervalID = "";
let currentBlob = null;
let questionCount = 0;

function showModal() {
    $("#userAdded").modal("show");
};

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

// This code is to record a voice
// following documentation of mic-recorder-to-mp3

const button = document.getElementById("recordingButton");
const recorder = new MicRecorder({
    bitRate: 128
});

const startRecording = event => {
    $("#recordingBox").append('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
    event.preventDefault();
    seconds = 0;
    recorder.start()
        .then(() => {
            setTimeout(() => {
                $(".spinner-border").remove();
                $("#recordingLength").text("Recording length: " + seconds + " sec.")
                button.textContent = 'Stop';
                button.classList.toggle('btn-danger');
                button.removeEventListener('click', startRecording);
                button.addEventListener('click', stopRecording);
                intervalID = setInterval(() => {
                    seconds++;
                    $("#recordingLength").text("Recording length: " + seconds + " sec.")
                }, 1000);
            }, 300);
        })
        .catch(error => {
            console.log(error);
        });
}

const stopRecording = event => {
    event.preventDefault();
    seconds = 0;
    $("#recordingLength").text("");
    clearInterval(intervalID);

    recorder.stop().getMp3()
        .then(([buffer, blob]) => {
            const file = new File(buffer, 'music.mp3', {
                type: blob.type,
                lastModified: Date.now()
            });

            const li = document.createElement('li');
            const player = new Audio(URL.createObjectURL(file));
            player.controls = true;
            li.appendChild(player);
            $("#listOfRecordings").append(li);
            $("#recordingBox").append('<img src="/media/icons/bin.png" alt="Delete" class="deleteRecording">');

            currentBlob = blob;

            button.textContent = 'Start';
            button.classList.replace("btn-danger", "btn-success");
            button.disabled = true;

            button.removeEventListener('click', stopRecording);
            button.addEventListener('click', startRecording);

            $(".deleteRecording").click(() => {
                button.disabled = false;
                currentBlob = null;
                $("#listOfRecordings").empty();
                $(".deleteRecording").remove();
            })
        })
        .catch(error => {
            console.log(error);
        });
};

$("#addQbtn").click(event => {
    if(!(questionCount >= 10)) {
        questionCount++;
        $("#queCount").text(questionCount + "/10");
        $("#questionsForEx").append('<div class="questionAdded"><div class="queDelLine"><h3>New Question</h3><button class="btn btn-danger btn-sm deleteQBtn">Delete</button></div><div class="queRow"><input type="text" class="form-control" id="queEng' + questionCount + '" placeholder="Question in English..."><input type="text" class="form-control" id="queFor' + questionCount + '" placeholder="Translated question..."></div><div class="answerLine"><input type="text" class="form-control answerInput" placeholder="Answer (obligatory)" required><input type="checkbox">Correct?</div><div class="answerLine"><input type="text" class="form-control answerInput" placeholder="Answer (obligatory)" required><input type="checkbox">Correct?</div><div class="answerLine"><input type="text" class="form-control answerInput" placeholder="Answer... Delete if not needed"><input type="checkbox">Correct?<img class="deleteAnsBtn" src="/media/icons/bin.png" alt="Delete"></div><div class="answerLine"><input type="text" class="form-control answerInput" placeholder="Answer... Delete if not needed"><input type="checkbox">Correct?<img class="deleteAnsBtn" src="/media/icons/bin.png" alt="Delete"></div></div>');
    };

    $(".deleteQBtn").click(event => {
        questionCount = event.target.parentElement.parentElement.parentElement.childElementCount - 1;
        $("#queCount").text(questionCount + "/10");
        event.target.parentElement.parentElement.remove();
    });

    $(".deleteAnsBtn").click(event => {
        event.target.parentElement.remove();
    })
    
})

$("#submitButton").click(async event => {
    $("#window-cover").append('<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>');
    $("#window-cover").css({ "display": "flex", "align-items": "center", "justify-content": "center"} );
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if(this.readyState === 4) {
            let fileName = JSON.parse(e.target.responseText).fileName;
            tinyMCE.triggerSave();
            
            let formDetails = {
                chapterId: $("#chapterSelected").val(),
                title: $("#title").val(),
                description: $("#description").val(),
                textEng: $("#textEng").val(),
                textFor: $("#textFor").val(),
                file: fileName
            };

            $.ajax({
                url: "/enterprise/exercises/comprehension/add-article",
                method: "GET",
                data: formDetails,
                success: (data) => {
                    $("#window-cover").css("display", "none");
                }
            });
        }
    };
    var fd = new FormData();
    fd.append("audio_data", currentBlob, "recording");
    xhr.open("POST", "/enterprise/exercises/comprehension/upload-recording", true);
    xhr.send(fd);
})

getCompanyName();

button.addEventListener("click", startRecording);
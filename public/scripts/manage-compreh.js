let currentBlob = null;

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

const submitChanges = event => {
    event.preventDefault();

    $("#submitButton").append('<div class="btn-spin spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>');

    if(!(currentBlob == null)) {
        let formData = new FormData();
        formData.append("audio_data", currentBlob, "recording");

        $.ajax({
            url: "/enterprise/exercises/comprehension/upload-recording",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: file => {
                tinyMCE.triggerSave();
                
                $("#audioFileName").val(file.fileName);

                document.getElementById("comprehension-form").submit();
            }

        })
    } else {
        document.getElementById("comprehension-form").submit();
    }
    
};

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

function showModal() {
    $("#editComprehModal").modal("show");
};

getCompanyName();

$("#submitButton").click(submitChanges);
button.addEventListener("click", startRecording);
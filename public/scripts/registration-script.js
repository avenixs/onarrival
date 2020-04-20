// When page loads, both conditions are false
let passwordOverChar = false;
let passwordMatch = false;
let uniqueEmail = false;

// Function that verifies password length and checks 
// if the Register button can be enabled
const confirmPassLength = () => {
    if($("#adminPassword").val().length >= 8){
        $("#passEightChar").html("All good.");
        $("#passEightChar").css("color", "#006d02");
        passwordOverChar = true;
        enableButton();
    } else {
        $("#passEightChar").html("At least 8 characters!");
        $("#passEightChar").css("color", "#8b0000");
        passwordOverChar = false;
    };
};

// Function that verifies repeated password match 
// if the Register button can be enabled
const confirmPassMatch = () => {
    if(($("#repeatPassword").val() == $("#adminPassword").val()) && $("#adminPassword").val().length >= 8){
        $("#passMatch").html("Passwords matching.");
        $("#passMatch").css("color", "#006d02");
        passwordMatch = true;
        enableButton();
    } else {
        $("#passMatch").html("Passwords do not match!");
        $("#passMatch").css("color", "#8b0000");
        passwordMatch = false;
    };
};

const enableButton = () => {
    if(passwordOverChar && passwordMatch && uniqueEmail) {
        $("#register-button").prop("disabled", false);
        $("#register-button").css("cursor", "pointer");
    } else {
        $("#register-button").prop("disabled", true);
        $("#register-button").css("cursor", "not-allowed");
    }
}

$("#adminPassword").keyup(() => {
    confirmPassLength();
    confirmPassMatch();
    enableButton();
});

$("#repeatPassword").keyup(() => {
    confirmPassLength();
    confirmPassMatch();
    enableButton();
});

$("#adminEmail").change(() => {
    $("#register-button").append('<div class="btn-spin spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>');

    $.ajax({
        url: "/register/confirm-unique-email",
        method: "POST",
        data: { email: $("#adminEmail").val() },
        success: received => {
            $(".spinner-border").remove();
            if(received.unique) {
                uniqueEmail = true;
                enableButton();
            } else {
                uniqueEmail = false;
                alert("This email address is already in use!")
                enableButton();
            }
        }
    })
});

function showModal() {
    $("#registeredModal").modal("show");
};
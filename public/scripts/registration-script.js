// When page loads, both conditions are false
let passwordOverChar = false;
let passwordMatch = false;

// Function that verifies password length and checks 
// if the Register button can be enabled
const confirmPassLength = () => {
    if($("#adminPassword").val().length >= 8){
        $("#passEightChar").html("Over 8 characters.");
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
    if(passwordOverChar && passwordMatch) {
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

function showModal() {
    $("#registeredModal").modal("show");
};
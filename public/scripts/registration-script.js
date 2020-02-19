let passwordOverChar = false;
let passwordMatch = false;

const enableRegisterButton = function() {
    if(passwordOverChar && passwordMatch) {
        $("#register-button").prop("disabled", false);
    } else {
        $("#register-button").prop("disabled", true);
        $("#register-button").css("cursor", "not-allowed");
    };
};

const confirmPassLength = function() {
    if($("#adminPassword").val().length >= 8){
        $("#passEightChar").html("Over 8 characters.");
        $("#passEightChar").css("color", "#006d02");
        passwordOverChar = true;
        if(passwordOverChar && passwordMatch) {
            $("#register-button").prop("disabled", false);
            $("#register-button").css("cursor", "pointer");
        } else {
            $("#register-button").prop("disabled", true);
            $("#register-button").css("cursor", "not-allowed");
        }
    } else {
        $("#passEightChar").html("At least 8 characters!");
        $("#passEightChar").css("color", "#8b0000");
        passwordOverChar = false;
    };
};

const confirmPassMatch = function() {
    if(($("#repeatPassword").val() == $("#adminPassword").val()) && $("#adminPassword").val().length >= 8){
        $("#passMatch").html("Passwords matching.");
        $("#passMatch").css("color", "#006d02");
        passwordMatch = true;
        if(passwordOverChar && passwordMatch) {
            $("#register-button").prop("disabled", false);
            $("#register-button").css("cursor", "pointer");
        } else {
            $("#register-button").prop("disabled", true);
            $("#register-button").css("cursor", "not-allowed");
        }
    } else {
        $("#passMatch").html("Passwords do not match!");
        $("#passMatch").css("color", "#8b0000");
        passwordMatch = false;
    };
};

$("#adminPassword").keyup(() => {
    confirmPassLength();
    confirmPassMatch();
    enableRegisterButton();
});

$("#repeatPassword").keyup(() => {
    confirmPassLength();
    confirmPassMatch();
    enableRegisterButton();
});
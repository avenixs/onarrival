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

$("#email").change(() => {
    $("#add-btn").append('<div class="btn-spin spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>');

    $.ajax({
        url: "/enterprise/students/confirm-unique-email",
        method: "POST",
        data: { email: $("#email").val() },
        success: data => {
            $(".spinner-border").remove();
            if(data.unique) {
                $("#add-btn").prop("disabled", false);
                $("#add-btn").css("cursor", "pointer");
            } else {
                alert("This email address is already in use!")
                $("#add-btn").prop("disabled", true);
                $("#add-btn").css("cursor", "not-allowed");
            }
        }
    })
})

getCompanyName();
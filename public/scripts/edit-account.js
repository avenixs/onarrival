$("#updateCompanyBtn").click(event => {
    event.preventDefault();

    let details = {
        name: $("#companyName").val(),
        email: $("#companyEmail").val(),
        telNum: $("#companyTel").val()
    };

    if(details.name == "" || details.email == "" || details.telNum == "") {
        alert("Please fill in all the required fields.");
    } else {
        $.ajax({
            url: "/enterprise/account/update-company",
            method: "GET",
            data: details,
            success: function(data){
                getCompanyName();
                $(".course-content").append("<img src='/media/icons/ajax-tick.png' id='small-tick'>");
                document.getElementById("small-tick").animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], 700);
                setTimeout(() => { $("#small-tick").fadeOut(); }, 800);
                setTimeout(() => { $("#small-tick").remove(); }, 1200);
            }
        });
    }
});

$("#updateUserBtn").click(event => {
    event.preventDefault();

    let details = {
        name: $("#adminName").val(),
        surname: $("#adminSurname").val(),
        email: $("#adminEmail").val(),
        department: $("#adminDep").val(),
        password: $("#adminPassword").val()
    };

    if(details.name == "" || details.surname == "" || details.email == "" || details.department == "") {
        alert("Please fill in all the required fields.");
    } else {
        $.ajax({
            url: "/enterprise/account/update-user",
            method: "GET",
            data: details,
            success: function(data){
                $("#name-surname").text($("#adminName").val() + " " + $("#adminSurname").val());
                $(".course-content").append("<img src='/media/icons/ajax-tick.png' id='small-tick'>");
                document.getElementById("small-tick").animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], 700);
                setTimeout(() => { $("#small-tick").fadeOut(); }, 800);
                setTimeout(() => { $("#small-tick").remove(); }, 1200);
            }
        });
    }
});

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

getCompanyName();


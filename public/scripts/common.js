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

getCompanyName();
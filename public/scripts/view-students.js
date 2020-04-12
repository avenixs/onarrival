const getCompanyName = () => {
    $.ajax({
        url: "/enterprise/current-company-name",
        method: "GET",
        data: null,
        success: data => {
            $("#bar-company-name").html(data.name);
        }
    });
};

const disableUser = event => {
    $.ajax({
        url: "/enterprise/disable-student",
        method: "GET",
        data: { id: event.target.value },
        success: () => {
            event.target.parentNode.parentNode.classList.toggle("disabled-row");
            let newButton = document.createElement("button");
            newButton.classList = "btn btn-success enable-user";
            newButton.value = event.target.value;
            newButton.innerHTML = "Enable";
            event.target.parentNode.appendChild(newButton);
            event.target.remove();

            $(".enable-user").click(enableUser);
        }
    });
};

const enableUser = event => {
    $.ajax({
        url: "/enterprise/enable-student",
        method: "GET",
        data: { id: event.target.value },
        success: () => {
            event.target.parentNode.parentNode.classList.remove("disabled-row");
            let newButton = document.createElement("button");
            newButton.classList = "btn btn-warning disable-user";
            newButton.value = event.target.value;
            newButton.innerHTML = "Disable";
            event.target.parentNode.appendChild(newButton);
            event.target.remove();

            $(".disable-user").click(disableUser);
        }
    });
};

getCompanyName();

$(".disable-user").click(disableUser);
$(".enable-user").click(enableUser);

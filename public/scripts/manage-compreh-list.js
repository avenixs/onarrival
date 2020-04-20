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

// This function disables a comprehension exercise
const disableCompEx = event => {
    $.ajax({
        url: "/enterprise/disable-comprehension-ex",
        method: "GET",
        data: { id: event.target.value },
        success: () => {
            event.target.parentNode.parentNode.classList.toggle("disabled-row");
            let newButton = document.createElement("button");
            newButton.classList = "btn btn-success enable-ex";
            newButton.value = event.target.value;
            newButton.innerHTML = "Enable";
            event.target.parentNode.appendChild(newButton);
            event.target.remove();

            $(".enable-ex").click(enableCompEx);
        }
    });
};

const enableCompEx = event => {
    $.ajax({
        url: "/enterprise/enable-comprehension-ex",
        method: "GET",
        data: { id: event.target.value },
        success: () => {
            event.target.parentNode.parentNode.classList.remove("disabled-row");
            let newButton = document.createElement("button");
            newButton.classList = "btn btn-warning disable-ex";
            newButton.value = event.target.value;
            newButton.innerHTML = "Disable";
            event.target.parentNode.appendChild(newButton);
            event.target.remove();

            $(".disable-ex").click(disableCompEx);
        }
    });
};

getCompanyName();

$(".disable-ex").click(disableCompEx);
$(".enable-ex").click(enableCompEx);
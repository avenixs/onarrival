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

const retrieveExercises = () => {
    let chapterSelected = { id: $("#chapterSelected").val() };
    $.ajax({
        url: "/enterprise/exercises/get-vocab-chapter",
        method: "GET",
        data: chapterSelected,
        success: (data) => {
            let exercises = data.exercises;
            $("#table-body").empty();
            for(let i=0; i<exercises.length; i++) {
                let count = i+1;
                $("#table-body").append("<tr><td>" + count + "</td><td>" + exercises[i].name + "</td><td>" + exercises[i].level + "</td><td>" + exercises[i].type + "</td><td>" + exercises[i].description + "</td></tr>")
            }
        }
    });
};

$("#chapterSelected").change(retrieveExercises);

getCompanyName();

retrieveExercises();

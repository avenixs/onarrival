function showModal() {
    $("#userAdded").modal("show");
};

const retrieveMaterials = () => {
    let chapterSelected = { id: $("#chapterSelected").val() };
    $.ajax({
        url: "/enterprise/exercises/get-chapter-materials",
        method: "GET",
        data: chapterSelected,
        success: (data) => {
            let materials = data.materials;
            $("#table-body").empty();
            for(let i=0; i<materials.length; i++) {
                let count = i+1;
                $("#table-body").append("<tr><td>" + count + "</td><td>" + materials[i].title + "</td><td>" + materials[i].description + "</td></tr>")
            }
        }
    });
};

$("#chapterSelected").change(retrieveMaterials);

$(document).ready(function () {
    bsCustomFileInput.init(); 
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

retrieveMaterials();
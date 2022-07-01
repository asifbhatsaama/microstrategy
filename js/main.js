 function startLibrary() {
    const token = sessionStorage.getItem("token");
    const baseURL = sessionStorage.getItem("baseURL");

    getSession(baseURL, token)
    .then((session) => {

        extendSession(baseURL,token)
        getLibrary(baseURL, token).then((library)=> {

            console.log(library)
            var table = document.getElementById("dossierTable");
            for (i = 0; i < library.length; i++) {
                var row = table.insertRow(i + 1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                cell1.innerHTML = library[i].name;
                cell2.innerHTML = library[i].target.id;
                cell3.innerHTML = library[i].target.owner.name;
                cell4.innerHTML= library[i].lastViewedTime;
                cell5.innerHTML= library[i].projectId;
                cell6.innerHTML = library[i].target.lastModifiedTime;
                cell7.innerHTML= library[i].description;
                row.setAttribute("onmouseover","style='background-color:#C0C0C0';");
                row.setAttribute("onmouseout","style='background-color:default';");
                (function () {
                    const id = library[i].target.id;
                    const title = library[i].name;
                    const project_id = library[i].projectId;
                    row.addEventListener("click", function() {
                        sessionStorage.setItem ("dossierid",document.querySelector(".highlight").children[1].innerHTML);
                        sessionStorage.setItem ("projid",document.querySelector(".highlight").children[4].innerHTML);
                        console.log(document.querySelector(".highlight").children[1].innerHTML);
                        console.log(document.querySelector(".highlight").children[4].innerHTML);
                        window.location.href = "dashboard.html";
                    });  
                }());
            }
            $("#dossierTable tr").click(function() {
                var selected = $(this).hasClass("highlight");
                $("#dossierTable tr").removeClass("highlight");
                if(!selected)
                    $(this).addClass("highlight");
            });        
        });
    })
    .catch((error)=> {
        location.href="login.html";
    })

    
}
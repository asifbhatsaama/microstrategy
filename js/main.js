 function startLibrary() {
    const token = sessionStorage.getItem("token");
    const baseURL = sessionStorage.getItem("baseURL");
    getSession(baseURL, token)
    .then((session) => {

        extendSession(baseURL,token);
        // console.log("CONTENT GROUPS LIST - ",getContentGroups(baseURL,token));
        // for (let i = 0;i<getContentGroups(baseURL,token).length;i++){
        //     console.log(i.name);
        // }

        getContentGroups(baseURL,token).then((focus)=>{
            let row = "";
            for (i=0;i<focus.contentBundles.length;i++){
                const name = focus.contentBundles[i].name;
                const content_group_id = focus.contentBundles[i].id;
                row+=` <option value="${name}" id = "${content_group_id}" class="focus">${name}</option>`;
            }
            document.querySelector(".focus").innerHTML= row;
            }
        );

        // console.log("CONTENT GROUPS CHILD - ",getContentGroupsChild(baseURL,token));
        getLibrary(baseURL, token).then((library)=> {
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


function populateAnalytics(test) {
    const baseURL= sessionStorage.getItem("baseURL");
    const token = sessionStorage.getItem("token");

    groupid = document.querySelector('option:checked').id

    getProjects(baseURL,token).then((projects)=>{
        console.log(projects);
        let row = "";
    for (let j =0;j<projects.projects.length;j++){
        const projectId = projects.projects[j].id
       
    getContentGroupsChild(baseURL,token,groupid,projectId).then((analytics)=>{
        console.log(analytics);
        for (let i =0;i< analytics[projectId].length;i++){
            let name = analytics[projectId][i].name;
            let dossierid = analytics[projectId].id;
            row+=` <option value="${name}" id = "${dossierid}" class="analytics">${name}</option>`;
        }

        document.querySelector(".analytics").innerHTML= row;        

    })
    }
  })
}
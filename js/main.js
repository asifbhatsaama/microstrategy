var baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"
var dossierID = ""
var projectID = ""
var dossier = ""


function startLibrary() {
    const token = sessionStorage.getItem("token");
    const baseURL = sessionStorage.getItem("baseURL");
    getSession(baseURL, token)
        .then((session) => {

            extendSession(baseURL, token);

            getContentGroups(baseURL, token).then((focus) => {
                let row = "";
                $("#focus").chosen();
                $("#analytics").chosen();
                for (i = 0; i < focus.contentBundles.length; i++) {
                    const name = focus.contentBundles[i].name;
                    const content_group_id = focus.contentBundles[i].id;
                    row += ` <option value="${name}" id = "${content_group_id}" class="focus">${name}</option>`;
                }
                document.querySelector(".focus").innerHTML = row;
                $("#focus").trigger("chosen:updated");
            });

            // console.log("CONTENT GROUPS CHILD - ",getContentGroupsChild(baseURL,token));
            getLibrary(baseURL, token).then((library) => {
                //  console.log(library);
                let table = document.getElementById("dossierTable");
                let libraryDossierList = "";
                // let dossierList = "";
                for (let i = 0; i < library.length; i++) {
                    let row = table.insertRow(i + 1);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);
                    let cell5 = row.insertCell(4);
                    let cell6 = row.insertCell(5);
                    cell1.innerHTML = library[i].name;
                    cell2.innerHTML = library[i].target.id;
                    cell3.innerHTML = library[i].target.owner.name;
                    cell4.innerHTML = library[i].lastViewedTime;
                    cell5.innerHTML = library[i].projectId;
                    cell6.innerHTML = library[i].target.lastModifiedTime;
                    row.setAttribute("onmouseover", "style='background-color:#C0C0C0';");
                    row.setAttribute("onmouseout", "style='background-color:default';");

                    $("#libraryDropdown").chosen();
                    const dashboardId = library[i].target.id
                    const projectId = library[i].projectId;
                    const dashboardName = library[i].name;
                    libraryDossierList += '<option className="" value="' + projectId + '" id="' + dashboardId + '" />' + dashboardName + '</option>';
                    document.querySelector("#libraryDropdown").innerHTML = libraryDossierList;
                    $('#libraryDropdown').trigger("chosen:updated");


                    (function() {
                        const id = library[i].target.id;
                        const title = library[i].name;
                        const project_id = library[i].projectId;
                        row.addEventListener("click", function() {
                            sessionStorage.setItem("dossierid", document.querySelector(".highlight").children[1].innerHTML);
                            sessionStorage.setItem("projid", document.querySelector(".highlight").children[4].innerHTML);
                            console.log(document.querySelector(".highlight").children[1].innerHTML);
                            console.log(document.querySelector(".highlight").children[4].innerHTML);
                            window.location.href = "dashboard.html";
                        });
                    }());

                }

                $("#dossierTable tr").click(function() {
                    var selected = $(this).hasClass("highlight");
                    $("#dossierTable tr").removeClass("highlight");
                    if (!selected)
                        $(this).addClass("highlight");
                });

            });
        })
        .catch((error) => {
            location.href = "login.html";
        })


}


async function getFavorites() {
    const token = await getAuthToken(baseURL)
    const library = await getLibrary(baseURL, token).then((library) => library)
    let favoriteJson = await getFavoritesAPI(token).then((response) => response);
    let dossierList = "";
    for (let i in favoriteJson['FAVORITES'].itemKeys) {
        let dossierID = favoriteJson['FAVORITES'].itemKeys[i].split("_")[0];
        // let cnt = 0;
        for (let j in library) {
            if (dossierID == library[j].target.id) {
                let fav = "fav";
                dossierList += $('.dashboard-tabs').append(`<li class=""><a href = "#" id = ` + fav + library[j].target.id + ` class="fav-dash" onclick="openfavouriteDossier(this)" projectId =` + library[j].projectId + ` dossierId = ` + library[j].target.id + ` >` + library[j].name +
                    `</a></li>`);

            }

        }

    }

}


async function addFavorite(selectedDossier) {
    console.log("Adding Dossier in HomePage..")
    const token = await getAuthToken(baseURL)
    console.log(`Dossier ID -  ${dossierID} & Project ID - ${projectID}`)
    const res = await addFavoriteAPI(token, dossierID, projectID).then((res) => res)
}


async function removeFavorite(selectedDossier) {
    console.log("Remove Dossier from HomePage..")
    const token = await getAuthToken(baseURL)
    console.log(`Dossier ID -  ${dossierID} & Project ID - ${projectID}`)
    const res = await removeFavoriteAPI(token, dossierID, projectID).then((res) => res)

}


function dossierDetails(selectedDossier) {
    projectID = selectedDossier[selectedDossier.selectedIndex].value
    dossierID = selectedDossier[selectedDossier.selectedIndex].id
}



setTimeout(test, 4000);

function test() {
    $(document).ready(function() {
        $("ul.tab li a").click(function() {
            let projid = $(this).attr("projectId");
            let dossierid = $(this).attr("dossierId");
        });

        $("ul.tab li:first-child a").click();
    });
}


function openfavouriteDossier(dossierDetails) {
    let projid = dossierDetails.getAttribute("projectId");
    let dossierid = dossierDetails.getAttribute("dossierId");
    let favbaseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" + "/" + projid + "/" + dossierid;

    $('.dashboard-tabs li').click(function() {
        $('.dashboard-tabs li').removeClass('activedash');
        $(this).addClass('activedash');
    });


    console.log(favbaseURL);

    async function favrunCode(favbaseURL) {
        config = {
            url: favbaseURL,
            placeholder: document.getElementById("embedding-dossier-container"),
            containerHeight: "700px",
            containerWidth: "600px",
            navigationBar: {
                enabled: true,
                gotoLibrary: true,
                title: true,
                toc: true,
                reset: true,
                reprompt: true,
                share: true,
                comment: true,
                notification: true,
                filter: true,
                options: true,
                search: true,
                bookmark: false
            },

            filterFeature: {
                enabled: true,
                edit: true,
                summary: false,
            },

            enableResponsive: true,
        };

        try {
            dossier = await window.microstrategy.dossier.create(config);
        } catch (error) {
            console.error(error);
        }
    }
    favrunCode(favbaseURL);
}


async function populateAnalytics(test) {
    const baseURL = sessionStorage.getItem("baseURL");
    const token = sessionStorage.getItem("token");

    groupid = document.querySelector('option:checked').id
    const projects = sessionStorage.getItem("projects")
    const analytics = await getContentGroupsChildUpdated(baseURL, token, groupid, projects).then((analytics)=> analytics)
    console.log("Analytics List -",analytics)
    let row = ""
    for (i in analytics) {
        for (let j =0; j<analytics[i].length;j++)
        {
            let name = analytics[i][j].name;
            let dossierid = analytics[i][j].id;
            console.log(name,dossierid)
            row += ` <option value="${name}" id = "${dossierid}" class="analytics">${name}</option>`;
        }
    }

    document.querySelector(".analytics").innerHTML = row;
    $("#analytics").trigger("chosen:updated");

}
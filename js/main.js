// var baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"
var dossierID = ""
var projectID = ""

$("#focus").chosen();
$("#analytics").chosen();
$("#libraryDropdown").chosen();


function startLibrary() {
    const token = sessionStorage.getItem("token");
    const baseURL = sessionStorage.getItem("baseURL");
    getSession(baseURL, token)
        .then((session) => {

            extendSession(baseURL, token);

            // Get list of content Groups
            getContentGroups(baseURL, token).then((focus) => {
                let row = "";
                for (i = 0; i < focus.contentBundles.length; i++) {
                    const name = focus.contentBundles[i].name;
                    const content_group_id = focus.contentBundles[i].id;
                    row += ` <option value="${name}" id = "${content_group_id}" class="focus">${name}</option>`;
                }
                document.querySelector(".focus").innerHTML = row;
                $("#focus").trigger("chosen:updated");
            });

            // Get list of all library contents
            getLibrary(baseURL, token).then((library) => {
                let table = document.getElementById("dossierTable");
                let libraryDossierList = "";
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

setTimeout(loadfirstDossier, 5000);

function loadfirstDossier() {
    $("ul.tab li:first-child a").click();
}

function openfavouriteDossier(dossierDetails) {
    let projid = dossierDetails.getAttribute("projectId");
    let dossierid = dossierDetails.getAttribute("dossierId");
    let favbaseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" + "/" + projid + "/" + dossierid;

    $('.dashboard-tabs li').click(function() {
        $('.dashboard-tabs li').removeClass('activedash');
        $(this).addClass('activedash');
    });
    runCode(favbaseURL);

    $(".filterpanelFilter-btn").show();
    $(".filterIcon").hide();

}

// Show contents Groups
async function populateAnalytics(test) {
    const baseURL = sessionStorage.getItem("baseURL");
    const token = sessionStorage.getItem("token");

    groupid = document.querySelector('option:checked').id

    const projects = sessionStorage.getItem("projects")

    // Show child contents of content Groups
    const analytics = await getContentGroupsChildUpdated(baseURL, token, groupid, projects).then((analytics) => analytics)
    let row = ""
    for (i in analytics) {
        for (let j = 0; j < analytics[i].length; j++) {
            let name = analytics[i][j].name;
            let dossierid = analytics[i][j].id;

            row += ` <option value="${name}" id = "${dossierid}" class="analytics">${name}</option>`;
        }
    }

    document.querySelector(".analytics").innerHTML = row;
    $("#analytics").trigger("chosen:updated");

}

startLibrary();

// Get list of all Favourites 
async function activeFavourite() {
    document.querySelector(".home-btn").classList.remove("active")
    document.querySelector(".dash-lib").classList.add("active")
    getFavorites()
    const baseURL = sessionStorage.getItem("baseURL");
    const token = sessionStorage.getItem("token");
    const proj = await getProjects(baseURL, token).then((projects) => projects)
    let arr = new Array()
    for (let i in proj.projects) {
        arr.push(proj.projects[i].id)
    }
    projects = arr.join('&projectId=')
    sessionStorage.setItem("projects", projects)
}

// Show Home tab contents 
$(".home-btn").click(function() {
    $(".library-list").hide();
    $(".favourite-list").show();
    document.querySelector(".dash-lib").classList.add("active");
    document.querySelector(".home-btn").classList.remove("active");
    $(".dashboard-tabs").show();
    $(".filter-dossier-container").show();
    $(".homepage-filter-show-hide").show();

})

// Show list of Libraries by on click of Dashboard Library Button
$(".dash-lib").click(function() {
    $(".favourite-list").hide();
    $(".library-list").show();
    document.querySelector(".home-btn").classList.add("active");
    document.querySelector(".dash-lib").classList.remove("active");
    $(".dashboard-tabs").hide();
    $(".filter-dossier-container").hide();
    $(".homepage-filter-show-hide").hide();

})

// Show filters icon on Top-Nav bar
function hideshowFilters() {
    // $("#filterContainer").toggle();
    $("#filterContainer").show();
    $(".filterIcon").hide();
}

// Hide filters Icon in Filter panel
function hideshowfilterIcon() {
    $(".homepage-filter-show-hide").show();
    $("#filterContainer").hide();
}
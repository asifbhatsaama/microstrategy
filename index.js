// let baseurl = "https://mobiledossier.microstrategy.com/MicroStrategyLibrary/app"
// let projid = localStorage.setItem ("projid");
// let dossierid = localStorage.setItem ("dossierid");

let url = "";
let dossier; // Variable to store the dossier created. Used by Event Handler do not remove!
let config; // Variable to store the configuration settings for dossier.
const attributeSelector = "attributeSelector"; // Variable to store string for attributeSelector filter type

var projectID = sessionStorage.getItem("projid")
var dossierID = sessionStorage.getItem("dossierid")
const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"

// Function to update filters will be called in runCode() after dossier is created and onclick from Update Filters by default.
async function updateFilters() {
    let filterList = await dossier.getFilterList();
    console.log("The list of filters is:", filterList);
    let filterListContainer = $(".filterListContainer");
    let filterListRow = "";
    if (filterList && filterList.length >= 0) {
        for (filter of filterList) {
            if (filter && filter.filterKey) {
                const filterValueElement = showFilterValues(filter);
                const filterKey = filter.filterKey;

                if (filter.filterDetail.supportMultiple === true) {
                    // filterListRow += `<div class="filterListRow"><div class="filterRowHeader"><div class="filterName">${filter.filterName}</div><div class="rowFilterControl"><a href="#" class="filterControlLink" onclick="selectAllAttributeValues('filter${filterKey}',true)" >Select All</a><a href="#" class="filterControlLink" onclick="selectAllAttributeValues('filter${filterKey}', false)" >Clear All</a></div></div>${filterValueElement}</div>`;

                    filterListRow += `<div class="filterListRow"><div class="filterRowHeader"><div class="filterName">${filter.filterName}</div><div class="rowFilterControl"><a href="#" class="filterControlLink" onclick="selectAllAttributeValues('filter${filterKey}',true)" ><i class="fa-solid fa-check fa-2x"></i></a><a href="#" class="clearfilterControlLink" onclick="selectAllAttributeValues('filter${filterKey}', false)" ><i class="fa fa-remove fa-2x"></i></a></div></div>${filterValueElement}</div>`;

                } else {
                    filterListRow += `<div class="filterListRow"><div class="filterRowHeader"><div class="filterName">${filter.filterName}</div><div class="rowFilterControl"></div></div>${filterValueElement}</div>`;
                }
            }
        }
        filterListContainer.html(filterListRow);
        for (filter of filterList) {
            $('#filter' + filter.filterKey).chosen({
                disable_search_threshold: 0,
                no_results_text: "Oops, nothing found!",
                width: "100%"
            });

        }
        for (filter of filterList) {
            const filterName = filter.filterName;
            for (item of filter.filterDetail.items) {
                if (item.selected === true) {
                    const filterValue = item.value;
                    setDefaultFilter(filterName, filterValue);

                }
            }

        }
    }
}

function setDefaultFilter(selectedFilterName, selectedFilterValue) {
    let filterListRow = $(".filterListRow select");
    for (filter of filterListRow) {
        const filterName = filter.getAttribute("name");
        const filterKey = "#filter" + filter.getAttribute("key");
        if (selectedFilterName === filterName) {
            const options = filter.children;
            for (opt of options) {
                if (selectedFilterValue === opt.value) {
                    opt.setAttribute('selected', "selected");
                }
            }
            $(filterKey).trigger('chosen:updated');
        }
    }
}

function showFilterValues(filter) {
    let filterValueDiv = "";
    const filterKey = filter.filterKey;
    const filterName = filter.filterName;

    if (!filter.filterDetail.items || filter.filterDetail.items.length === 0) {
        filterValueDiv = "<span>No values found</span>";
        return filterValueDiv;
    }


    if (filter.filterDetail.supportMultiple) {
        filterValueDiv = '<select multiple key="' + filterKey + '" name="' + filterName + '" class="chosen-select" id="filter' + filterKey + '">';
    } else {
        filterValueDiv = '<select key="' + filterKey + '" name="' + filterName + '" class="chosen-select" id="filter' + filterKey + '">';
    }


    for (item of filter.filterDetail.items) {
        filterValueDiv += '<option className="attributeSelectorValues" value="' + item.value + '" />' + item.name + '</option>';
    }
    filterValueDiv += '</select>';
    return filterValueDiv;
}

// Function called when you change or submit changes to values of the selected filter
function applyFilter(type) {
    let filterListRow = $(".filterListRow select");
    for (filter of filterListRow) {
        const key = filter.getAttribute("key");
        const values = $("#filter" + key).val();
        const multiselect = filter.hasAttribute("multiple");
        if (multiselect) {
            let selections = [];
            for (val of values) {
                selections.push({ value: val });
            }
            if (values.length >= 0) {
                let filterJson = {
                    filterInfo: {
                        key: key
                    },
                    selections: selections,
                    holdSubmit: true
                }
                dossier.filterSelectMultiAttributes(filterJson);
            }

        } else {
            let filterJson = {
                filterInfo: {
                    key: key
                },
                selection: { value: values },
                holdSubmit: true
            }
            dossier.filterSelectSingleAttribute(filterJson);
        }

    }
    dossier.filterApplyAll();
    updateFilters();
}

// Function to set all attribute filter checkboxes to be true(checked) or false(unchecked)
function selectAllAttributeValues(filterKey, checked) {
    filterKey = "#" + filterKey;
    if (checked) {
        // $(filterKey + ' option').attr('selected', true);
        // $(filterKey).trigger('chosen:updated');

        $(filterKey + ' option').prop('selected', true);
        $(filterKey).trigger('chosen:updated');

    } else {
        $(filterKey + ' option:selected').removeAttr('selected');
        $(filterKey).val('').trigger('chosen:updated');
    }
}

// Function to select all attributes and submit for the filter
function selectAllAndSubmit() {
    let filterListRow = $(".filterListRow select");
    for (filter of filterListRow) {
        const key = filter.getAttribute("key");
        dossier.filterSelectAllAttributes({
            filterInfo: {
                key: key, // Replace with the key of the filter that is being edited.
            },
            holdSubmit: true,
        });
        selectAllAttributeValues("filter" + key, true);
    }
    // dossier.filterApplyAll();
}

// Function to deselect all attributes and submit for the filter
function deselectAllAndSubmit() {
    let filterListRow = $(".filterListRow select");
    for (filter of filterListRow) {
        const key = filter.getAttribute("key");
        dossier.filterSelectAllAttributes({
            filterInfo: {
                key: key, // Replace with the key of the filter that is being edited.
            },
            holdSubmit: true,
        });
        selectAllAttributeValues("filter" + key, false);
    }
    // dossier.filterApplyAll();
}



/* On Graphics Selected Event Start*/
function eventGraphicsSelectedFunction(e) {
    // Add any functionality for event needed here
    let filterListRow = $(".filterListRow select");
    for (filter of filterListRow) {
        const filterName = filter.getAttribute("name");
        const filterKey = "#filter" + filter.getAttribute("key");
        const selectedFilterName = e.graphics[0][0].n;
        const selectedFilterValue = e.graphics[0][0].vid;
        if (selectedFilterName === filterName) {
            const options = filter.children;
            for (opt of options) {
                if (selectedFilterValue === opt.value) {
                    opt.setAttribute('selected', "selected");

                } else {
                    opt.removeAttribute("selected");
                }
            }
            $(filterKey).trigger('chosen:updated');
        }
    }
}

$(".filterswitchvertically").on("click", function() {
    $(".mainContainer").removeClass("mainContainer").addClass("mainContainerhrz");
    $(".filterContainer").removeClass("filterContainer").addClass("filterContainerhrz");
    $(".filterHeader").removeClass(".filterHeader").addClass(".filterHeaderhrz");
    $(".filterListContainer").removeClass("filterListContainer").addClass("filterListContainerhrz");
    // $("#embedding-dossier-container").removeClass("embedding-dossier-container").addClass("embedding-dossier-containerhrz");
    $(".filterControlList").removeClass("filterControlList").addClass("filterControlListhrz");
    $("#embedding-dossier-container").toggleClass("hrz");
    $(".filterControlList ").toggleClass("hrz");
    $(".filterControl").removeClass("filterControl").addClass("filterControlLinkshrz");
    $(".filterlinks").removeClass("filterlinks");
});


$(".filterswitchhorizontally").on("click", function() {
    $(".mainContainerhrz").removeClass("mainContainerhrz").addClass("mainContainer");
    $(".filterContainerhrz").removeClass("filterContainerhrz").addClass("filterContainer");
    $(".filterHeaderhrz").removeClass(".filterHeaderhrz").addClass(".filterHeader");
    $(".filterListContainerhrz").removeClass("filterListContainerhrz").addClass("filterListContainer");
    // $("#embedding-dossier-containerhrz").removeClass("embedding-dossier-containerhrz").addClass("embedding-dossier-container");
    $(".filterControlListhrz").removeClass("filterControlListhrz").addClass("filterControlList");
    $("#embedding-dossier-container").toggleClass("hrz");
    $(".filterControlList ").toggleClass("hrz");
});

// Function to render the dossier
async function runCode(url) {
    // For more details on configuration properties, see https://www2.microstrategy.com/producthelp/Current/EmbeddingSDK/Content/topics/dossier_properties.htm
    config = {
        url: url,
        placeholder: document.getElementById("embedding-dossier-container"),
        // containerHeight: "700px",
        // containerWidth: "600px",
        navigationBar: {
            enabled: true,
            gotoLibrary: true,
            title: false,
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
    // INSERT PROPERTIES BELOW HERE

    // INSERT PROPERTIES ABOVE HERE

    // Embed the dossier with the configuration settings
    try {
        dossier = await window.microstrategy.dossier.create(config);
        dossier.getCurrentPagePanelStacks()
            .then((currentPagePanelStacks) => {
                console.log(
                    "Get Current Page Panel Stacks:",
                    currentPagePanelStacks
                );
                return currentPagePanelStacks;
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }


    // const container = document.getElementById("embedding-dossier-container");
    // const marginBottom = 5;
    // container.style.minHeight = "calc(100vh - " + (container.offsetTop + marginBottom) + "px)";

    responsiveHeight()


    // INSERT METHODS BELOW HERE
    updateFilters();

    function eventPageSwitchedFunction(e) {
        /* Add any functionality for event needed here */
        updateFilters();
        getPanels();

    }


    updateWidgetList();

    function eventPageSwitchedFunction(e) {
        /* Add any functionality for event needed here */
        updateWidgetList();
        // getPanels();
    }

    // Update filters when page switches
    dossier.registerEventHandler(
        microstrategy.dossier.EventType.ON_PAGE_SWITCHED,
        eventPageSwitchedFunction
    );

    // Update filters when page finishes loading
    dossier.registerEventHandler(
        microstrategy.dossier.EventType.ON_PAGE_LOADED,
        eventPageSwitchedFunction
    );

    dossier.registerEventHandler(
        microstrategy.dossier.EventType.ON_GRAPHICS_SELECTED,
        eventGraphicsSelectedFunction
    );


    /* On Filter Updated Event Start*/
    function eventFilterUpdatedFunction(e) {
        //  console.log(e);
        // Add any functionality for event needed here
        console.log("Filter Updated Event");
        updateFilters();
    }
    dossier.registerEventHandler(
        microstrategy.dossier.EventType.ON_FILTER_UPDATED,
        eventFilterUpdatedFunction
    );

    getPanels();
    populateProjects();

    document.querySelector("#masterstudyFilter").innerHTML = "";
    masterstudyFilter();

    // Get all pages
    var toc = dossier.getTableContent();
    var listOfChapters = dossier.getChapterList();

    // Reset Page Panel 
    document.querySelector(".button-holder").innerHTML = ""

    for (let i = 0; i < listOfChapters.length; i++) {
        for (let j = 0; j < listOfChapters[i].children.length; j++) {
            node = "dossier.navigateToPage(dossier.getPageByNodeKey(" + `'` + listOfChapters[i].children[j].nodeKey + `'` + "))"
            $('.button-holder').append(`<button class="basic-button btn-basic subtab" onclick="` + node + `">` + listOfChapters[i].children[j].name +
                `</button>`);
        }
    }
}

function dosparam() {
    let url = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" + "/" + sessionStorage.getItem("projid") + "/" + sessionStorage.getItem("dossierid");
    runCode(url);
    $("#masterstudyFilter").chosen();
}


function authoring() {
    delete config["instance"];
    delete config["filters"];
    delete config["visualizationAppearances"];
    delete config["visualizationSelectedElements"];

    config.dossierRenderingMode = "authoring";

    config.authoring = {
        menubar: {
            library: {
                visible: true,
            },
        },


        toolbar: {

            addData: { visible: false },
            addChapter: { visible: false },
            addPage: { visible: false },
            pauseDataRetrieval: { visible: false },
            insertVisualization: { visible: false },
            insertFilter: { visible: false },
            tableOfContents: { visible: false },


        },

        panelVisibility: {
            contents: true,
            datasets: false,
            editor: true,
            filter: true,
            format: true,
            layers: true,
        },
    };
    // console.log()
    // debugger;

    // dossier
    //     .switchToMode("authoring")
    //     .then((e) => console.log(e))
    //     .catch((error) => console.error(error));

    dossier = window.microstrategy.dossier.create(config);

}

function getPanels() {

    dossier.getCurrentPagePanelStacks().then((currentPagePanelStacks) => {
        let row = "";
        $("#panellist").chosen();
        for (let i = 0; i < currentPagePanelStacks.length; i++) {
            for (let j = 0; j < currentPagePanelStacks[i].panels.length; j++) {
                row += `<option value="${currentPagePanelStacks[i].panels[j].key}" id = "${currentPagePanelStacks[i].panels[j].key}" class="${currentPagePanelStacks[i].panels[j].name}">${currentPagePanelStacks[i].panels[j].name}</option>`;
            }
        }
        console.log(row);
        document.querySelector(".panel").innerHTML = row;
        $('#panellist').trigger("chosen:updated");

        if (row.length > 0) {
            console.log("Wow, panel found!");
            $(".panel").show();
        } else {
            console.log("Oops, panel not found!");
            $(".panel").hide();
        }
        return currentPagePanelStacks;
    })
}


function selectChanged(tag) {
    dossier.switchPanel(document.getElementById("panellist").value).then((switchPanel) => {
        console.log("Panel switched to ", switchPanel);
        updateWidgetList();
        $("#panellist_chosen").hide();
        // $("#panelListDropdown").hide();
        // $("#panellist").hide();
    })

    // dossier.switchPanel(document.querySelector('option:checked').value).then((switchPanel) => {
    //     console.log("Panel switched to ", switchPanel);
    // })
}



function responsiveHeight() {
    const container = document.getElementById("embedding-dossier-container");
    const marginBottom = 14;
    container.style.minHeight = "calc(100vh - " + (container.offsetTop + marginBottom) + "px)";
    console.log("Container Top  Offset - ", container.offsetTop)
}


function fullscreen() {
    const container = document.getElementById("embedding-dossier-container");
    container.requestFullscreen();
}



function resizeWidget(size) {
    if (dossier) {
        const vizListElement = document.getElementById("vizList");
        const selectedKey = vizListElement.value;
        dossier.changeVisualizationSize({
                visualizationKey: selectedKey,
                size: size,
                // size: 'maximized'
            })
            .then((visualization) => { console.log("Following Widget Resized:", visualization); }).catch((error) => { console.error(error); });
        // $("#maximizeIcon").hide();
        document.querySelector(".dropdown-content").style.display = "none";
        console.log(size);
        if (size === "maximized") {
            console.log(size);
            // $("#maximizeIcon").hide();
            // console.log($("#maximizeIcon"));
            // let a = document.querySelector("maximizeIcon");
            // console.log(a);
            document.querySelector(".dropdown-content").style.display = "none";
        }
    }
}



function updateWidgetList() {
    // getPanels();
    if (dossier) {
        dossier.getCurrentPageVisualizationList().then((visualizations) => {

            console.log("Widget List : ", visualizations);
            let row = "";

            for (viz of visualizations) {
                $("#vizList").chosen();
                // console.log(viz.key, viz.name)
                row += `<option value="${viz.key}" id = "${viz.key}" class="${viz.name}">${viz.name}</option>`;
            }
            document.querySelector(".vizList").innerHTML = row;

            // $("#vizList").append(row);

            $('#vizList').trigger("chosen:updated");
        });
    }
    updateFilters();
}



//  PDF & Excel Export
async function exportPDFExcel(type, allSingle) {
    const exptype = allSingle === "SINGLE" ? false : true;
    console.log(allSingle);
    console.log(exptype);
    const pdfExportBody = JSON.stringify({
        includeOverview: true,
        includeDetailedPages: exptype, // All or Single pages //true or false /* each visualization printed on an individual page */
        includeHeader: true,
        includeFooter: true,
        includeToc: false,
        orientation: "NONE",
        pageOption: allSingle, //"SINGLE", //"ALL", /* to export all of the pages of the document */
        pageHeight: 8.5,
        pageWidth: 11,
        viewportHeight: 0,
        viewportWidth: 0,
        filterSummary: "PAGE",
        gridPagingMode: "none",
        fitToPage: true,
        repeatColumnHeader: true,
        responsiveView: false,
    });


    const excelExportBody = JSON.stringify({
        sliceId: 0,
        pageOption: "ALL", // All pages or current page
    });

    const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary";
    const dossierId = sessionStorage.getItem("dossierid");
    const token = await getAuthToken(baseURL);


    let instanceId = await dossier.getDossierInstanceId().then((id) => id)
        .catch((error) => { console.error(error); return null; });

    console.log("Dossier Instance ID :", instanceId)

    const exportBody = type === "pdf" ? pdfExportBody : excelExportBody;


    let options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
            "content-type": "application/json",
            "x-mstr-authtoken": token,
            "x-mstr-projectid": sessionStorage.getItem("projid"),
        },
        body: exportBody,
    };

    console.log("EXPORT STARTED");
    await fetch(baseURL + "/api/documents/" + dossierId + "/instances/" + instanceId + "/" + type, options)
        .then((response) => {
            console.log("Yay!! Export Completed");
            if (type === "pdf") {
                response.json().then((responseJson) => {

                    const byteCharacters = atob(responseJson.data);
                    console.log("byteCharacters", byteCharacters);

                    const byteNumbers = [];
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers.push(byteCharacters.charCodeAt(i));
                    }
                    console.log("byteNumbers", byteNumbers)

                    const byteArray = new Uint8Array(byteNumbers);
                    console.log("byteArray", byteArray)

                    const file = new Blob([byteArray], {
                        type: "application/pdf;base64",
                    });
                    console.log("file", file);

                    const link = document.createElement("a");
                    const url = URL.createObjectURL(file);

                    link.href = url;

                    link.download = "PDF EXport File";

                    link.click();
                });
            } else {
                response.blob().then((blob) => {
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.href = url;
                    link.download = "excelExportFile.xlsx";
                    link.click();
                });
            }
        })
        .catch((error) => {
            console.error("Exporting has failed with error:", error);
        });

}


async function userSync() {

    const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary";
    const token = await getAuthToken(baseURL);

    var authUsers = [{
            "fullName": "Saama UserSync",
            "username": "UserSync",
            "description": "User Sync Test",
            "password": ""
        },

        {
            "fullName": "Saama1 UserSync1",
            "username": "UserSync1",
            "description": "User1 Sync1 Test1",
            "password": ""
        }
    ]


    for (let i = 0; i < authUsers.length; i++) {

        const raw = JSON.stringify(authUsers[i]);
        createUser(token, raw, baseURL);

    }


    var users = "";

    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    await fetch(baseURL + "/api/users", options)
        .then(response => response.text())
        .then(result => {
            users = result;

        })
        .catch(error => console.log('error', error));

    users = JSON.parse(users);

    console.log("MSTR User List - ", users);

}


async function populateProjects() {
    const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"
    const token = await getAuthToken(baseURL)
    getProjects(baseURL, token).then((projectList) => {

        let row = "";
        for (project of projectList.projects) {
            $("#projectList").chosen();
            // console.log(project.name, project.id)
            row += `<option value="${project.id}" id = "${project.id}">${project.name}</option>`;
        }

        document.querySelector(".projectList").innerHTML = row;

        $('#projectList').trigger("chosen:updated");
    })
}


async function createDossier(project) {

    let projectID = document.querySelector(".projectList").value
    const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"
    const token = await getAuthToken(baseURL)
    searchDossier(projectID, token).then((dossierTemplate) => {

        let dossierID = dossierTemplate.result[0].id
        console.log("Dossier ID ", dossierID)
        console.log("Project ID ", projectID)
        let url = baseURL + "/app" + "/" + projectID + "/" + dossierID;
        runCode(url);
        authoring();
        $("#projectList_chosen").hide();

    })
}


async function saveStory() {
    let bookmarkName = document.querySelector(".bookmark-name").value;

    const token = await getAuthToken(baseURL)

    console.log("Saving Filter Story...")

    let dossierInstanceID = await createDossierInstance(token, baseURL, projectID, dossierID).then((dossierInstanceID) => dossierInstanceID)
    dossierInstanceID = dossierInstanceID.mid
    console.log("New Dossier Instance - ", dossierInstanceID)

    let instanceDetails = await dossierInstanceInfo(token, baseURL, projectID, dossierID, dossierInstanceID).then((instanceDetails) => instanceDetails)
    console.log("Instance Details with Shortcut - ", instanceDetails)

    let shortcutID = instanceDetails.shortcut.id
    console.log("Shortcut ID -", shortcutID)

    let bookmarkID = await createBookmark(token, baseURL, projectID, dossierInstanceID, bookmarkName).then((bookmark) => bookmark.id)
    console.log("New Bookmark with ID ", bookmarkID, " created")

    let bookmarks = await getBookmarks(token, baseURL, projectID, shortcutID).then((bookmarks) => bookmarks)
    console.log("All Dossier Bookmarks - ", bookmarks)

    let bookmarkURL = baseURL + "/app/" + projectID + "/" + dossierID + "/" + "bookmarks?ids=" + bookmarkID
    console.log("Bookmark URL ", bookmarkURL)

    sessionStorage.setItem("shortcutID", shortcutID);
    sessionStorage.setItem("bookmarkid", bookmarkID);
    sessionStorage.setItem("bookmarkURL", bookmarkURL);

    console.log("Filter Story saved succcessfully!!!")

    $(".dropdown-content-create-bm").hide();
    listUserStories();

}


async function deleteFilterStory(ele) {

    let bookmarkID = ele.getAttribute("bookmarkID")
    let shortcutID = ele.getAttribute("shortcutID")

    const token = await getAuthToken(baseURL)

    let status = await deleteBookmarkApi(token, baseURL, projectID, shortcutID, bookmarkID).then((response) => response)

    console.log("Bookmark with name & id deleted", status)

}


async function listUserStories() {

    const token = await getAuthToken(baseURL)

    let dossierInstanceID = await createDossierInstance(token, baseURL, projectID, dossierID).then((dossierInstanceID) => dossierInstanceID)
    dossierInstanceID = dossierInstanceID.mid

    let instanceDetails = await dossierInstanceInfo(token, baseURL, projectID, dossierID, dossierInstanceID).then((instanceDetails) => instanceDetails)

    let shortcutID = instanceDetails.shortcut.id

    let filterStories = await getBookmarks(token, baseURL, projectID, shortcutID).then((bookmarks) => bookmarks)

    console.log("User Filter Story List ", filterStories)

    document.querySelector(".filterStoryList").innerHTML = "";

    let row = "";
    for (let i in filterStories) {
        let bookmarkURL = baseURL + "/app/" + projectID + "/" + dossierID + "/" + "bookmarks?ids=" + filterStories[i].id
            // row += `<option value="${filterStories[i].name}" id = "${filterStories[i].id}" class="${filterStories[i].name}">${filterStories[i].id}</option>`;
        row += `<ul class="bookmarkList"><button class="bookmarkButton" url ="${bookmarkURL}" onclick = "embedBookmark(this)">${filterStories[i].name}</button><button class="shareBookmark-Icon"><i class='fas fa-share' style='font-size:24px; font-size: 9px'></i></button><button class="editBookmark-Icon" bookmarkID = "${filterStories[i].id}" shortcutID = "${shortcutID}"><i class='fas fa-pen' style='font-size:24px; font-size: 9px'></i></button><button class="deleteBookmark-Icon" bookmarkID = "${filterStories[i].id}" shortcutID = "${shortcutID}" onclick = "deleteFilterStory(this)"><i class='far fa-trash-alt' style='font-size:24px; font-size: 9px'></i></button></ul>`
    }

    $(".filterStoryList").append(row)
}



// document.querySelector(".deleteBookmark-Icon").addEventListener("click", function () {
//     console.log("Hello")
//     let b_id = $(".deleteBookmark-Icon").attr("bookmarkID")
//     let s_id = $(".deleteBookmark-Icon").attr("shortcutID")
//     deleteStory(b_id,s_id)
//   });



function embedBookmark(ele) {
    $(".dropdown-centre-bm").hide();
    let url = ele.getAttribute("url")
    runCode(url);
}

function masterstudyFilter() {
    let dossierFilters = dossier.getFilterList();
    var studyfilterKey = "";
    var studyfiltervalueList = "";
    $("#masterstudyFilter").chosen();
    // $("#masterstudyFilter").append($('<option></option>'));
    dossierFilters.then((filters) => {

        for (let i = 0; i < filters.length; i++) {
            if (filters[i].filterName === "studyname" || filters[i].filterName === "StudyName" || filters[i].filterName === "Study Name" || filters[i].filterName === "Studyname") {
                // console.log(filters[i]);
                studyfilterKey = filters[i].filterKey;
                for (let j = 0; j < filters[i].filterDetail.items.length; j++) {
                    let filterValues = filters[i].filterDetail.items[j];
                    // console.log(filterValues);
                    // debugger
                    let valueName = filters[i].filterDetail.items[j].name
                    let valueId = filters[i].filterDetail.items[j].value

                    studyfiltervalueList += '<option class="filterValues" value="' + valueId + '" studyfilterKey="' + studyfilterKey + '" />' + valueName + '</option>';
                }
            }
        }
        $("#masterstudyFilter").append(studyfiltervalueList);

        $('#masterstudyFilter').trigger("chosen:updated");
    })

}
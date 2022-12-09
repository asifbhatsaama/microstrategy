let url = "";
let dossier; // Variable to store the dossier created. Used by Event Handler do not remove!
let config; // Variable to store the configuration settings for dossier.
const attributeSelector = "attributeSelector"; // Variable to store string for attributeSelector filter type

var projectID = sessionStorage.getItem("projid"); // Get selected project ID from session storage
var dossierID = sessionStorage.getItem("dossierid"); // Get selected dossier ID from session storage
const baseURL =
  "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"; // Env. base URL

// Function to update filters will be called in runCode() after dossier is created and onclick from Update Filters by default.
async function updateFilters() {
  let filterList = await dossier.getFilterList(); // Get list of all filters
  let filterListContainer = $(".filterListContainer");
  let filterListRow = "";
  if (filterList && filterList.length >= 0) {
    for (filter of filterList) {
      if (filter && filter.filterKey) {
        const filterValueElement = showFilterValues(filter);
        const filterKey = filter.filterKey;

        if (filter.filterDetail.supportMultiple === true) {
          filterListRow += `<div class="filterListRow"><div class="filterRowHeader"><div class="filterName">${filter.filterName}</div><div class="rowFilterControl"><a href="#" class="filterControlLink" onclick="selectAllAttributeValues('filter${filterKey}',true)" ><i class="fa-solid fa-check fa-2x"></i></a><a href="#" class="clearfilterControlLink" onclick="selectAllAttributeValues('filter${filterKey}', false)" ><i class="fa fa-remove fa-2x"></i></a></div></div>${filterValueElement}</div>`;
        } else {
          filterListRow += `<div class="filterListRow"><div class="filterRowHeader"><div class="filterName">${filter.filterName}</div><div class="rowFilterControl"></div></div>${filterValueElement}</div>`;
        }
      }
    }
    filterListContainer.html(filterListRow);
    for (filter of filterList) {
      $("#filter" + filter.filterKey).chosen({
        disable_search_threshold: 0,
        no_results_text: "Oops, nothing found!",
        width: "100%",
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

// Show selected filter values with respected filter dropdown
function setDefaultFilter(selectedFilterName, selectedFilterValue) {
  let filterListRow = $(".filterListRow select");
  for (filter of filterListRow) {
    const filterName = filter.getAttribute("name");
    const filterKey = "#filter" + filter.getAttribute("key");
    if (selectedFilterName === filterName) {
      const options = filter.children;
      for (opt of options) {
        if (selectedFilterValue === opt.value) {
          opt.setAttribute("selected", "selected");
        }
      }
      $(filterKey).trigger("chosen:updated");
    }
  }
}

// Show all filter values in dropdown
function showFilterValues(filter) {
  let filterValueDiv = "";
  const filterKey = filter.filterKey;
  const filterName = filter.filterName;

  if (!filter.filterDetail.items || filter.filterDetail.items.length === 0) {
    filterValueDiv = "<span>No values found</span>";
    return filterValueDiv;
  }

  if (filter.filterDetail.supportMultiple) {
    filterValueDiv =
      '<select multiple key="' +
      filterKey +
      '" name="' +
      filterName +
      '" class="chosen-select" id="filter' +
      filterKey +
      '">';
  } else {
    filterValueDiv =
      '<select key="' +
      filterKey +
      '" name="' +
      filterName +
      '" class="chosen-select" id="filter' +
      filterKey +
      '">';
  }

  for (item of filter.filterDetail.items) {
    filterValueDiv +=
      '<option className="attributeSelectorValues" value="' +
      item.value +
      '" />' +
      item.name +
      "</option>";
  }
  filterValueDiv += "</select>";
  return filterValueDiv;
}

// Function called when you change or submit changes to values of the selected filter
function applyFilter(type) {
  console.log("Holaaaaaaa");
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
        // For Multi value selection
        let filterJson = {
          filterInfo: {
            key: key,
          },
          selections: selections,
          holdSubmit: true,
        };
        dossier.filterSelectMultiAttributes(filterJson); // MSTR method for multiselection
      }
    } else {
      // For Single value selection
      let filterJson = {
        filterInfo: {
          key: key,
        },
        selection: { value: values },
        holdSubmit: true,
      };
      dossier.filterSelectSingleAttribute(filterJson); // MSTR method for single selection
    }
  }
  dossier.filterApplyAll();
  updateFilters();
}

// Function to set all attribute filter checkboxes to be true(checked) or false(unchecked)
function selectAllAttributeValues(filterKey, checked) {
  filterKey = "#" + filterKey;
  if (checked) {
    $(filterKey + " option").prop("selected", true);
    $(filterKey).trigger("chosen:updated");
  } else {
    $(filterKey + " option:selected").removeAttr("selected");
    $(filterKey).val("").trigger("chosen:updated");
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
          opt.setAttribute("selected", "selected");
        } else {
          opt.removeAttribute("selected");
        }
      }
      $(filterKey).trigger("chosen:updated");
    }
  }
}

graphicaltabular = true; // Pass true to Insert Visualization in authoring mode

// Edit current open dossier after click on edit button
function edit() {
  flag = "authoring";
  url =
    "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" +
    "/" +
    sessionStorage.getItem("projid") +
    "/" +
    sessionStorage.getItem("dossierid");
  runCode(url, flag, graphicaltabular);
}

// Function to render the dossier
async function runCode(url, flag, graphicaltabular) {
  // For more details on configuration properties, see https://www2.microstrategy.com/producthelp/Current/EmbeddingSDK/Content/topics/dossier_properties.htm
  config = {
    url: url,
    placeholder: document.getElementById("embedding-dossier-container"),
    // containerHeight: "700px",
    // containerWidth: "600px",

    // Dossier Top Navigation bar properties
    // toc: false
    //bookmark: false
    // reset : false
    //
    navigationBar: {
      enabled: true,
      gotoLibrary: false,
      title: false,
      toc: false,
      reset: false,
      reprompt: true,
      share: true,
      comment: true,
      notification: true,
      filter: true,
      options: true,
      search: true,
      bookmark: false,
      undo: false,
      // edit: true
    },

    // Dossier filter properties
    filterFeature: {
      enabled: true,
      edit: true,
      summary: false,
    },

    enableResponsive: true,
  };

  // Authoring start if condition is true
  if (flag === "authoring") {
    delete config["instance"];
    delete config["filters"];
    delete config["visualizationAppearances"];
    delete config["visualizationSelectedElements"];

    config.dossierRenderingMode = "authoring";

    config.authoring = {
      menubar: {
        library: {
          visible: false,
        },
      },

      // Authoring toolbar properties
      toolbar: {
        addData: { visible: false },
        addChapter: { visible: true },
        addPage: { visible: true },
        pauseDataRetrieval: { visible: false },
        insertVisualization: { visible: graphicaltabular },
        insertFilter: { visible: true },
        tableOfContents: { visible: false },
      },

      // Authoring panel visibility properties
      panelVisibility: {
        contents: true,
        datasets: false,
        editor: true,
        filter: true,
        format: true,
        layers: true,
      },
    };

    document.querySelector(".button-holder").innerHTML = ""; // Reset page buttons from button holder class in auth mode
    document.querySelector(".filterListContainer").innerHTML = ""; // Reset filters
    $(".dropdown-menu-right").hide(); // Hide Tabular / Graphical dropdown in edit mode
  }

  // Embed the dossier with the configuration settings
  try {
    dossier = await window.microstrategy.dossier.create(config);
  } catch (error) {
    console.error(error);
  }

  responsiveHeight(); // Call responsive height function

  updateFilters(); // Call update filter function

  updateWidgetList(); // call update widget list function
  $("#filterContainer").show(); // Show filters on top of dossier

  function eventPageSwitchedFunction(e) {
    updateFilters(); // Update filters when page switches
    updateWidgetList(); // Update widget when page switches
    document.querySelector("#masterstudyFilter").innerHTML = ""; // Reset MSF
    masterstudyFilter(); // Update MST filters when page switches
    $("#filterContainer").show(); // Show filters when page switches
  }

  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_PAGE_SWITCHED,
    eventPageSwitchedFunction
  );

  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_PAGE_LOADED,
    eventPageSwitchedFunction
  );

  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_GRAPHICS_SELECTED,
    eventGraphicsSelectedFunction
  );

  function eventFilterUpdatedFunction(e) {
    updateFilters(); // Update filters when filter update event call
  }
  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_FILTER_UPDATED,
    eventFilterUpdatedFunction
  );

  /* On Dossier Authoring Saved Event Start */
  function eventDossierAuthoringSavedFunction(e) {
    runCode(url);
  }
  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_DOSSIER_AUTHORING_SAVED,
    eventDossierAuthoringSavedFunction
  );

  /* On Dossier Authoring Saved Event End */

  /* On Dossier Authoring Closed Event Start */
  function eventDossierAuthoringClosedFunction(e) {
    runCode(url);
    masterstudyFilter();
  }
  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_DOSSIER_AUTHORING_CLOSED,
    eventDossierAuthoringClosedFunction
  );

  /* On Dossier Authoring Closed Event End */

  function eventPageRenderFinishedFunction(e) {}
  dossier.registerEventHandler(
    microstrategy.dossier.EventType.ON_PAGE_RENDER_FINISHED,
    eventPageRenderFinishedFunction
  );

  getPanels();
  populateProjects();

  document.querySelector("#masterstudyFilter").innerHTML = ""; // Reset MSF
  masterstudyFilter();

  // Show page buttons if dossier not in Authoring mode
  if (flag != "authoring") {
    // Get all pages
    var toc = dossier.getTableContent();
    var listOfChapters = dossier.getChapterList(); // Get all chapter list

    // Reset Page Panel
    document.querySelector(".button-holder").innerHTML = "";

    for (let i = 0; i < listOfChapters.length; i++) {
      for (let j = 0; j < listOfChapters[i].children.length; j++) {
        node =
          "dossier.navigateToPage(dossier.getPageByNodeKey(" +
          `'` +
          listOfChapters[i].children[j].nodeKey +
          `'` +
          "))";
        $(".button-holder").append(
          `<button class="basic-button btn-basic subtab" onclick="` +
            node +
            `">` +
            listOfChapters[i].children[j].name +
            `</button>`
        );
      }
    }
  }
}

function dosparam() {
  let url =
    "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" +
    "/" +
    sessionStorage.getItem("projid") +
    "/" +
    sessionStorage.getItem("dossierid");
  runCode(url);
  $("#masterstudyFilter")
    .chosen()
    .change(function () {
      let msftotalSelected = $("#masterstudyFilter :selected").length;
      let showmoreSelected = msftotalSelected - 2;
      if (msftotalSelected > 2) {
        $("#masterstudyFilter_chosen ul li").not(":eq(0), :eq(1)").hide();
        $(this)
          .next()
          .find(".chosen-choices")
          .append(
            '<li class="search-choice msfselect" <span> + ' +
              showmoreSelected +
              " selected. </li>"
          );
      }
    });
}

// Get panel list function
function getPanels() {
  dossier.getCurrentPagePanelStacks().then((currentPagePanelStacks) => {
    let row = "";
    $("#panellist").chosen();
    for (let i = 0; i < currentPagePanelStacks.length; i++) {
      for (let j = 0; j < currentPagePanelStacks[i].panels.length; j++) {
        row += `<option value="${currentPagePanelStacks[i].panels[j].key}" id = "${currentPagePanelStacks[i].panels[j].key}" class="${currentPagePanelStacks[i].panels[j].name}">${currentPagePanelStacks[i].panels[j].name}</option>`;
      }
    }

    document.querySelector(".panel").innerHTML = row;
    $("#panellist").trigger("chosen:updated");

    if (row.length > 0) {
      $(".panel").show();
    } else {
      $(".panel").hide();
    }
    return currentPagePanelStacks;
  });
}

// Switch to panel function
function selectChanged(tag) {
  dossier
    .switchPanel(document.getElementById("panellist").value)
    .then((switchPanel) => {
      updateWidgetList();
      $("#panellist_chosen").hide();
    });
}

// Responsive dossier container function
function responsiveHeight() {
  const container = document.getElementById("embedding-dossier-container");
  const marginBottom = 14;
  container.style.minHeight =
    "calc(100vh - " + (container.offsetTop + marginBottom) + "px)";
}

// Goto fullscreen mode
function fullscreen() {
  const container = document.getElementById("embedding-dossier-container");
  container.requestFullscreen();
}

// Maximized and Minimize specific widget
function resizeWidget(size) {
  if (dossier) {
    const vizListElement = document.getElementById("vizList");
    const selectedKey = vizListElement.value;
    dossier
      .changeVisualizationSize({
        visualizationKey: selectedKey,
        size: size,
      })
      .then((visualization) => {
        document.querySelector(".dropdown-content").style.display = "none";
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

// Update widgets
function updateWidgetList() {
  if (dossier) {
    dossier.getCurrentPageVisualizationList().then((visualizations) => {
      let row = "";
      for (viz of visualizations) {
        $("#vizList").chosen();
        row += `<option value="${viz.key}" id = "${viz.key}" class="${viz.name}">${viz.name}</option>`;
      }
      document.querySelector(".vizList").innerHTML = row;

      $("#vizList").trigger("chosen:updated");
    });
  }
  updateFilters();
}

// export Dossier in PDF or Excel format
function exportDossier(type, allSingle) {
  exportPDFExcel(type, allSingle).then((response) => {
    if (type === "pdf") {
      response.json().then((responseJson) => {
        const byteCharacters = atob(responseJson.data);

        const byteNumbers = [];
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers.push(byteCharacters.charCodeAt(i));
        }

        const byteArray = new Uint8Array(byteNumbers);

        const file = new Blob([byteArray], {
          type: "application/pdf;base64",
        });

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
  });
}

// Populate Empty project list
async function populateProjects() {
  const baseURL =
    "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary";
  const token = await getAuthToken(baseURL);
  getProjects(baseURL, token).then((projectList) => {
    let row = "";
    let row1 = "";
    for (project of projectList.projects) {
      $("#projectList").chosen();
      $("#projectList1").chosen();
      row += `<option value="${project.id}" id = "${project.id}">${project.name}</option>`;
      row1 += `<option value="${project.id}" id = "${project.id}">${project.name}</option>`;
    }

    document.querySelector(".projectList").innerHTML = row;
    document.querySelector(".projectList1").innerHTML = row1;

    $("#projectList").trigger("chosen:updated");
    $("#projectList1").trigger("chosen:updated");
  });
}

// Create new Dossier
async function createDossier(project, graphicaltabular) {
  const graphtab = graphicaltabular === "graph" ? true : false;

  let projectID = document.querySelector(".projectList").value;
  const baseURL =
    "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary";
  const token = await getAuthToken(baseURL);
  searchDossier(projectID, token).then((dossierTemplate) => {
    let dossierID = dossierTemplate.result[0].id;

    sessionStorage.setItem("dossierid", dossierID);
    sessionStorage.setItem("projid", projectID);

    let url = baseURL + "/app" + "/" + projectID + "/" + dossierID;
    flag = "authoring";
    runCode(url, flag, graphtab);
    $("#projectList_chosen").hide();
  });
}

async function saveStory() {
  let bookmarkName = document.querySelector(".bookmark-name").value;

  const token = await getAuthToken(baseURL);

  let dossierInstanceID = await createDossierInstance(
    token,
    baseURL,
    projectID,
    dossierID
  ).then((dossierInstanceID) => dossierInstanceID);
  dossierInstanceID = dossierInstanceID.mid;

  let instanceDetails = await dossierInstanceInfo(
    token,
    baseURL,
    projectID,
    dossierID,
    dossierInstanceID
  ).then((instanceDetails) => instanceDetails);

  let shortcutID = instanceDetails.shortcut.id;

  let bookmarkID = await createBookmark(
    token,
    baseURL,
    projectID,
    dossierInstanceID,
    bookmarkName
  ).then((bookmark) => bookmark.id);

  let bookmarks = await getBookmarks(
    token,
    baseURL,
    projectID,
    shortcutID
  ).then((bookmarks) => bookmarks);

  let bookmarkURL =
    baseURL +
    "/app/" +
    projectID +
    "/" +
    dossierID +
    "/" +
    "bookmarks?ids=" +
    bookmarkID;

  $(".dropdown-content-create-bm").hide();
  listUserStories();
}

async function deleteFilterStory(ele) {
  let bookmarkID = ele.getAttribute("bookmarkID");
  let shortcutID = ele.getAttribute("shortcutID");

  const token = await getAuthToken(baseURL);

  let status = await deleteBookmarkApi(
    token,
    baseURL,
    projectID,
    shortcutID,
    bookmarkID
  ).then((response) => response);
}

async function listUserStories() {
  const token = await getAuthToken(baseURL);

  let dossierInstanceID = await createDossierInstance(
    token,
    baseURL,
    projectID,
    dossierID
  ).then((dossierInstanceID) => dossierInstanceID);
  dossierInstanceID = dossierInstanceID.mid;

  let instanceDetails = await dossierInstanceInfo(
    token,
    baseURL,
    projectID,
    dossierID,
    dossierInstanceID
  ).then((instanceDetails) => instanceDetails);

  let shortcutID = instanceDetails.shortcut.id;

  let filterStories = await getBookmarks(
    token,
    baseURL,
    projectID,
    shortcutID
  ).then((bookmarks) => bookmarks);

  document.querySelector(".filterStoryList").innerHTML = "";

  let row = "";
  for (let i in filterStories) {
    let bookmarkURL =
      baseURL +
      "/app/" +
      projectID +
      "/" +
      dossierID +
      "/" +
      "bookmarks?ids=" +
      filterStories[i].id;
    row += `<ul class="bookmarkList"><button class="bookmarkButton" url ="${bookmarkURL}" onclick = "embedBookmark(this)">${filterStories[i].name}</button><button class="shareBookmark-Icon"><i class='fas fa-share' style='font-size:24px; font-size: 9px'></i></button><button class="editBookmark-Icon" bookmarkID = "${filterStories[i].id}" shortcutID = "${shortcutID}"><i class='fas fa-pen' style='font-size:24px; font-size: 9px'></i></button><button class="deleteBookmark-Icon" bookmarkID = "${filterStories[i].id}" shortcutID = "${shortcutID}" onclick = "deleteFilterStory(this)"><i class='far fa-trash-alt' style='font-size:24px; font-size: 9px'></i></button></ul>`;
  }

  $(".filterStoryList").append(row);
}

function embedBookmark(ele) {
  $(".dropdown-content-bm").hide();
  let url = ele.getAttribute("url");
  runCode(url);
}

// MSF
function masterstudyFilter() {
  let dossierFilters = dossier.getFilterList();
  var studyfilterKey = "";
  var studyfiltervalueList = "";
  $("#masterstudyFilter").chosen();
  dossierFilters.then((filters) => {
    for (let i = 0; i < filters.length; i++) {
      if (
        filters[i].filterName === "studyname" ||
        filters[i].filterName === "StudyName" ||
        filters[i].filterName === "Study Name" ||
        filters[i].filterName === "Studyname"
      ) {
        studyfilterKey = filters[i].filterKey;
        for (let j = 0; j < filters[i].filterDetail.items.length; j++) {
          let filterValues = filters[i].filterDetail.items[j];
          let valueName = filters[i].filterDetail.items[j].name;
          let valueId = filters[i].filterDetail.items[j].value;

          studyfiltervalueList +=
            '<option class="filterValues" value="' +
            valueId +
            '" studyfilterKey="' +
            studyfilterKey +
            '" />' +
            valueName +
            "</option>";
        }
      }
    }
    $("#masterstudyFilter").append(studyfiltervalueList);

    $("#masterstudyFilter").trigger("chosen:updated");
  });
}

// Apply Study Filter value using MSF
async function applyMSF() {
  let filterList = await dossier.getFilterList();
  // debugger
  let selection = [];
  for (i = 0; i < filterList.length; i++) {
    if (
      filterList[i].filterName.replace(" ", "").toLowerCase() == "studyname"
    ) {
      for (let j = 0; j < filterList[i].filterDetail.items.length; j++) {
        if (
          filterList[i].filterDetail.items[j].name ==
          document
            .querySelector(".msf")
            .querySelector(".chosen-container")
            .querySelector(".chosen-choices")
            .querySelectorAll(".search-choice")[0].children[0].innerHTML
        ) {
          console.log(
            `Ready to apply ${filterList[i].filterDetail.items[j].name} value in ${filterList[i].filterName} filter`
          );
          dossier.filterSelectSingleAttribute({
            filterInfo: {
              key: filterList[i].filterKey, // Replace with the key of the filter that is being edited.
            },
            selection: {
              value: filterList[i].filterDetail.items[j].value,
            },
            holdSubmit: false,
          });
          dossier.filterApplyAll();
          break;
        }
      }
    }
  }
}

function enterarchitectMode() {
  location.replace("architectmode.html");
}

// DaLIA
$("#daliaDossierList").chosen();
getLibrary(baseURL, token).then((library) => {
  var daliaDossierList = "";
  $("#daliaDossierList").append($("<option></option>"));

  for (let i = 0; i < library.length; i++) {
    const dashboardId = library[i].target.id;
    const projectId = library[i].projectId;
    const dashboardName = library[i].name;

    daliaDossierList +=
      '<option className="dossier" value="' +
      projectId +
      '" id="' +
      dashboardId +
      '" />' +
      dashboardName +
      "</option>";
  }

  $("#daliaDossierList").append(daliaDossierList);

  $("#daliaDossierList").trigger("chosen:updated");
});

// Search & Open Dossier using Dalia
function daliaDossier(selecteddossier) {
  var projid = selecteddossier[selecteddossier.selectedIndex].value;
  var dossierid = selecteddossier[selecteddossier.selectedIndex].id;
  sessionStorage.setItem("projid", projid);
  sessionStorage.setItem("dossierid", dossierid);
  dosparam();
  updateFilters();
}

async function clearFilterExcludeMSF() {
  let filterList = await dossier.getFilterList();
  console.log(filterList);
  for (i = 0; i < filterList.length; i++) {
    if (
      filterList[i].filterName.replace(" ", "").toLowerCase() != "studyname"
    ) {
      dossier.filterClear({
        filterInfo: {
          key: filterList[i].filterKey,
        },
        holdSubmit: true,
      });
    }
  }

  dossier.filterApplyAll();
}

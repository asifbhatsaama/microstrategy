// let baseurl = "https://mobiledossier.microstrategy.com/MicroStrategyLibrary/app"
// let projid = localStorage.setItem ("projid");
// let dossierid = localStorage.setItem ("dossierid");

let url = "";
let dossier; // Variable to store the dossier created. Used by Event Handler do not remove!
let config; // Variable to store the configuration settings for dossier.
const attributeSelector = "attributeSelector"; // Variable to store string for attributeSelector filter type
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

    // if (filter.filterDetail.supportMultiple) {
    //     filterValueDiv = '<select multiple key="' + filterKey + '" class="chosen-select" id="filter' + filterKey + '">';
    // } else {
    //     filterValueDiv = '<select key="' + filterKey + '" class="chosen-select" id="filter' + filterKey + '">';
    // }

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
            //    else if (values.length >= 0) {
            //         let filterJson = {
            //             filterInfo: {
            //                 key: key
            //             },
            //             selections: selections,
            //             holdSubmit: true
            //         }
            //         dossier.filterSelectMultiAttributes(filterJson);
            //     }
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
    // updateFilters();
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

$(".filterswitchvertically").on("click", function () {
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


$(".filterswitchhorizontally").on("click", function () {
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
            bookmark: true,
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
    // INSERT METHODS BELOW HERE
    updateFilters();
    function eventPageSwitchedFunction(e) {
        /* Add any functionality for event needed here */
        updateFilters();

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

    /* On Filter Updated Event End */

    var toc = dossier.getTableContent();

    for (let j = 0; j < toc.chapters.length; j++) {
        $('.button-holder').append(`<button class="basic-button btn-basic subtab" onclick="dossier.navigateToPage(dossier.getChapterList()[` + j + `].getFirstPage())">` + toc.chapters[j].name +
            `</button>`);
    }

}



function dosparam() {
    let url = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/app" + "/" + sessionStorage.getItem("projid") + "/" + sessionStorage.getItem("dossierid");
    runCode(url);
}
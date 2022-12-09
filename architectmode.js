// Active Schema tab on page load
function activeSchemas() {
    document.querySelector(".users-lib").classList.add("active"); // Add active class to users tab
    document.querySelector(".sharekpis-lib").classList.add("active"); // Add active class to share kpis tab
    document.querySelector(".schemas-btn").classList.remove("active"); // Remove active class from schemas tab
    $(".users").hide(); // Hide Users tab
    $(".sharekpis-container").hide(); // Hide Share KPIs tab
    $(".schemas").show(); // Show Schemas tab
}

// Show Schemas tab content on click and hide other tab contents
$(".schemas-btn").click(function() {
    document.querySelector(".users-lib").classList.add("active"); // Add active class to users tab
    document.querySelector(".sharekpis-lib").classList.add("active"); // Add active class to share kpis tab
    document.querySelector(".schemas-btn").classList.remove("active"); // Remove active class from schemas tab
    $(".users").hide(); // Hide Users tab
    $(".sharekpis-container").hide(); // Hide Share KPIs tab
    $(".schemas").show(); // Show Schemas tab
})

// Show Users tab content on click and hide other tab contents
$(".users-lib").click(function() {
    document.querySelector(".schemas-btn").classList.add("active"); // Add active class to schemas tab
    document.querySelector(".sharekpis-lib").classList.add("active"); // Add active class to share kpis tab
    document.querySelector(".users-lib").classList.remove("active"); // Remove active class from users tab
    $(".sharekpis-container").hide(); // Hide Share KPIs tab
    $(".schemas").hide(); // Hide Schemas tab
    $(".users").show(); // Show users tab
})

// Show Share KPIs tab content on click and hide other tab contents
$(".sharekpis-lib").click(function() {
    document.querySelector(".schemas-btn").classList.add("active"); // Add active class to schemas tab
    document.querySelector(".users-lib").classList.add("active"); // Add active class to users tab
    document.querySelector(".sharekpis-lib").classList.remove("active"); // Remove active class from share kpis tab
    $(".schemas").hide(); // Hide schemas tab
    $(".users").hide(); // Hide users tab
    $(".sharekpis-container").show(); // Show share kpis tab

    document.querySelector(".teamcontainer").innerHTML = ""; // Null the Team Container

    getalluserGroups().then((response) => {

        let row = "";

        for (let i = 0; i < response.length; i++) {

            if (response[i].description == null) {
                response[i].description = ""; // Assign null value as null if team description is blank
            }

            row += '<ul class="team" id="' + response[i].id + '" onclick="getAllContentFolders(this)" ><li class="teamnamedesc" id="teamnamedesc"><a class="team-name" id="' + response[i].id + '" href="#">Team Name: ' + response[i].name + '</a></br><a class="team-desc" href="#">Description: ' + response[i].description + '</a></li></ul>'
        }
        $(".teamcontainer").append(row); // Add team list to team container class
    });

    $(".team-head-sharekpis").show(); // Show All Team Names and Descriptions
    $(".content-folder-subfolder-and-btn-container").hide(); // Hide Folder and Subfolder

})

// Get list of all Content folders & Subfolders
async function getAllContentFolders(selectedGroup) {
    document.querySelector(".selectedgroupinfo").innerHTML = ""; 
    document.querySelector(".content-folder-subfoler-container").innerHTML = "";
    let selectteam = selectedGroup.children[0].children[0].innerHTML;
    selectedteam = "Selected " + selectteam;

    let selectedteamid = selectedGroup.children[0].children[0].id;
    sessionStorage.setItem("selectedteamid", selectedteamid);

    $(".selectedgroupinfo").append(selectedteam);

    getFolderDetails(token, searchprojectID, searchfolderName).then((folder) => {
        let row = "";
        let folderid = folder.result[0].id;
        let projectid = folder.result[0].projectId;

        row += `<div class="contentgroup" id=${folder.result[0].id}>  <div class="contentfoldername-and-selectall-container"> <div class="content-group-name" value=${folder.result[0].id}>${folder.result[0].name}</div><div><input class="selectAll content-group-select-all-item-checkbox" type="checkbox" onclick="selectallFolders(this)">Select All</div></div>`

        getChildFolderDetails(token, projectid, folderid).then((folderDetails) => {
            for (let i = 0; i < folderDetails.length; i++) {
                row += `<div class="content-subfolder-item-container"><input class="content-subfolder-item-checkbox" type="checkbox" foldername=${folderDetails[i].name} focusid=${folder.result[0].id} value=${folderDetails[i].id} name="access">${folderDetails[i].name}</div>`
            }
            row += `</div>`
            $(".content-folder-subfoler-container").append(row);
        })
    });
    $(".team-head-sharekpis").hide();
    $(".content-folder-subfolder-and-btn-container").show();
}

// Get all selected folder id's
function getChecked() {
    selectallFolders();
    var selectedele = [];
    $.each($("input[name='access']:checked"), function() {
        selectedele.push($(this).val());
    });

    let userGroupid = sessionStorage.getItem("selectedteamid");

    let projectID = "00008A405A4F07AF829B4AB7C265A695"; // Study Project ID

    for (let i = 0; i < selectedele.length; i++) {
        selectedFolderId = selectedele[i];

        // Add team in folder access
        updateAccess(token, projectID, selectedFolderId, userGroupid).then((response) => {
            console.log(response);
        })

    }

    $(".content-folder-subfolder-and-btn-container").hide(); // Hide folder and Subfolder Container
    $(".team-head-sharekpis").show(); // Show Team Container
}

// Select all check boxes
function selectallFolders(t) {
    let isSelected = $(t).is(':checked');
    $(t).parents('.contentgroup').find('input[name="access"]').each(function() {
        if (isSelected) {
            $(this).prop('checked', true);
        } else {
            $(this).prop('checked', false);
        }
    })

    $('input:not(".selectAll")').on('click', function() {
        let selectAllChecked = $(t).parents('.contentgroup').find('.selectAll')[0].checked;
        let numberInput = $(t).parents('.contentgroup').find('input').not('.selectAll').length;
        let numberInputChecked = $(t).parents('.contentgroup').find('input:checked').not('.selectAll').length;

        if (selectAllChecked)
            $(t).parents('.contentgroup').find('.selectAll')[0].checked = false;

        if (numberInput == numberInputChecked)
            $(t).parents('.contentgroup').find('.selectAll')[0].checked = true;

    })
}

// Cancel button function
function cancel() {
    $(".content-folder-subfolder-and-btn-container").hide();
    $(".team-head-sharekpis").show();
}

// Back to dashboard.html page
function gotoDashboard() {
    location.replace("./dashboard.html");
}
// $(document).ready(function() {
//     // Show hide popover
//     $(".migrationListDropdown").click(function() {
//         $(this).find(".dropdown-content-ml").slideToggle("fast");
//     });
// });


// $(document).on("click", function(event) {
//     var $trigger = $(".migrationListDropdown");
//     if ($trigger !== event.target && !$trigger.has(event.target).length) {
//         $(".dropdown-content-ml").slideUp("fast");
//     }
// });

/*
         // $(".createBookmark-Icon").css("display", "block");
         // $("#bookmarkListDropdown").css("display", "block");
*/
/*
$(document).ready(function() {
    // Show hide popover
    $(".createBookmarkListDropdown").click(function() {
        $(this).find(".dropdown-content-create-bm").slideToggle("fast");

    });
});


$(document).on("click", function(event) {
    var $trigger = $(".createBookmarkListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content-create-bm").slideUp("fast");

    }
});



$(document).ready(function() {
    // Show hide popover
    $(".bookmarkListDropdown").click(function() {
        $(this).find(".dropdown-content-bm").slideToggle("fast");
    });
});


$(document).on("click", function(event) {
    var $trigger = $(".bookmarkListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content-bm").slideUp("fast");
    }
});
*/


// $(document).ready(function() {
//     // Show hide popover
//     $(".maximizeIcon").click(function() {
//         $(this).find(".dropdown-content").slideToggle("fast");
//     });
// });


// $(document).on("click", function(event) {
//     var $trigger = $(".maximizeIcon");
//     if ($trigger !== event.target && !$trigger.has(event.target).length) {
//         $(".dropdown-content").slideUp("fast");
//     }
// });


// $(document).ready(function() {
//     // Show hide popover
//     $(".projectListDropdown").click(function() {
//         $(this).find(".dropdown-content-pl").slideToggle("fast");
//     });
// });


// $(document).on("click", function(event) {
//     var $trigger = $(".projectListDropdown");
//     if ($trigger !== event.target && !$trigger.has(event.target).length) {
//         $(".dropdown-content-pl").slideUp("fast");
//     }
// });



// $(document).ready(function() {
//     // Show hide popover
//     $(".panelListDropdown").click(function() {
//         $(this).find(".dropdown-content-panellist").slideToggle("fast");
//     });
// });


// $(document).on("click", function(event) {
//     var $trigger = $(".panelListDropdown");
//     if ($trigger !== event.target && !$trigger.has(event.target).length) {
//         $(".dropdown-content-panellist").slideUp("fast");
//     }
// });


$(document).ready(function() {
    // Show hide popover
    $(".userDropdown").click(function() {
        $(this).find(".dropdown-content-usericon").slideToggle("fast");
    });
});


$(document).on("click", function(event) {
    var $trigger = $(".userDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content-usericon").slideUp("fast");
    }
});


$('.dropdown-menu button.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
        $('.dropdown-submenu .show').removeClass('show');
    });


    return false;
});

let currentLoggedUser = sessionStorage.getItem('username');
$("#username").append(currentLoggedUser);


// $(document).ready(function() {
//     $('.dropdown-submenu a.test').on("click", function(e) {
//         $(this).next('ul').toggle();
//         e.stopPropagation();
//         e.preventDefault();
//     });
// });


function openbmtab() {
    $(".dropdown-content-bm").toggle();
    $(".dropdown-content-create-bm").hide();
}


$(document).on("click ", function(event) {
    var $trigger = $(".bookmarkListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content-bm").hide();
    }
});

function createbm() {
    $(".dropdown-content-create-bm").toggle();
}

function cancel() {
    $(".dropdown-content-create-bm").toggle();
}

function hideshowfilters() {
    $("#filterContainer").toggle();
    responsiveHeight();
}

$(".maximizeIcon").click(function() {
    $("#maximizeIcon").show();
    $("#vizList_chosen").toggle();
    $("#vizList_chosen").css("width", "200");
    $("#vizList_chosen").css("display", "block");
})

$(document).on("click ", function(event) {
    var $trigger = $(".maximizeIcon");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $("#vizList_chosen").hide();
    }
});


$(".projectListDropdown").click(function() {
    $("#projectListDropdown").show();
    $("#projectList_chosen").toggle();
    $("#projectList_chosen").css("width", "200");
    $("#projectList_chosen").css("display", "block");
})

$(document).on("click ", function(event) {
    var $trigger = $(".projectListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $("#projectList_chosen").hide();
    }
});


$(".panelListDropdown").click(function() {
    $("#panellist").hide();
    $("#panelListDropdown").show();
    $("#panellist_chosen").toggle();
    $("#panellist_chosen").css("width", "200");
    $("#panellist_chosen").css("display", "block");
    // $("#panellist_chosen").addClass("chosen-with-drop");
    // $("#panellist_chosen").addClass("chosen-container-active");
})

$(document).on("click ", function(event) {
    var $trigger = $(".panelListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $("#panellist_chosen").hide();
    }
});

$(".taskIcon").click(function() {
    // $(".task-container").toggle();
    $("#popupForm").toggle();
})


// function openForm() {
//     document.getElementById("popupForm").style.display = "block";
// }

// function closeForm() {
//     document.getElementById("popupForm").style.display = "none";
// }
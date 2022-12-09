// User Icon Menu
$(document).ready(function() {
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

// Current login username
let currentLoggedUser = sessionStorage.getItem('username');
$("#username").append(currentLoggedUser);

// Export Icon Submenu Menu Items Whole Dossier, Current Page
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

// Open Bookmark Menu Items
function openbmtab() {
    $(".dropdown-content-bm").toggle();
    $(".dropdown-content-create-bm").hide();
}

// Close Bookmark Menu Items after clicking on outside of Bookmark Icon
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

// Maximize Visualization Item dropdown
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

// Panel List Item dropdown
$(".panelListDropdown").click(function() {
    $("#panellist").hide();
    $("#panelListDropdown").show();
    $("#panellist_chosen").toggle();
    $("#panellist_chosen").css("width", "200");
    $("#panellist_chosen").css("display", "block");
})

$(document).on("click ", function(event) {
    var $trigger = $(".panelListDropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $("#panellist_chosen").hide();
    }
});

// Task Form show / hide
$(".taskIcon").click(function() {
    $("#popupForm").toggle();
})

$(document).ready(function() {
    $(".dossier-type").click(function() {
        $(this).find(".dropdown-content-dossiertypeicon").show();
    });
});


$(document).on("click", function(event) {
    var $trigger = $(".dossier-type");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content-dossiertypeicon").slideUp("fast");
        $("#projectList1_chosen").hide();
        $("#projectList_chosen").hide();
    }
});


$(".tabular").click(function() {
    $("#projectList_chosen").show();
    $("#projectList_chosen").css("display", "block");
    $(".dropdown-menu > li:hover > .submenu-gt , #projectList_chosen").show();
    $("#projectList_chosen").css("width", "200");
    $("#projectList1_chosen").hide();

})

$(".graphical").click(function() {
    $("#projectList1_chosen").show();
    $(".dropdown-menu > li:hover > .submenu-gt , #projectList1_chosen").show();
    $("#projectList1_chosen").css("width", "200");
    $("#projectList_chosen").hide();
})


$(".create-dossier-icon").click(function() {
    $(".dropdown-menu-right").show();
})

$(document).on("click", function(event) {
    var $trigger = $(".create-dossier-icon");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-menu-right").hide();
    }
});

// Create Tabular / Graphical dossier dropdown start
$(document).ready(function() {
    $(document).on('click', '.dropdown-menu', function(e) {
        e.stopPropagation();
    });
    if ($(window).width() < 992) {
        $('.dropdown-menu a').click(function(e) {
            e.preventDefault();
            if ($(this).next('.submenu-gt').length) {
                $(this).next('.submenu-gt').toggle();
            }
            $('.dropdown-gt').on('hide.bs.dropdown-gt', function() {
                $(this).find('.submenu-gt').hide();
            })
        });
    }
});
// Create Tabular / Graphical dossier dropdown End
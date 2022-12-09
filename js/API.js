const token = sessionStorage.getItem("token");
// const baseURL = sessionStorage.getItem("baseURL");

// Login to MSTR 
async function login(baseURL, user, pass, loginMode) {
    var options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: user,
            password: pass,
            loginMode: loginMode
        })
    }

    return fetch(baseURL + '/api/auth/login', options)
        .then(function(response) {
            if (response.ok) {
                console.log("Cookieee Info")
                console.log(response.headers.get('x-mstr-authToken'));
                return response.headers.get('x-mstr-authToken')
            } else {
                throw (new Error("Login Error"))
            }
        })
}

// Get Session 
async function getSession(baseURL, token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/sessions', options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                console.log(response.json());
                throw (new Error("Get Session Error"));
            }
        })

}

// Extend Session
async function extendSession(baseURL, token) {
    var options = {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/sessions', options)
        .then(function(response) {
            if (response.ok) {
                return true
            } else {
                return false
            }
        })
}

// Get list of libraries
async function getLibrary(baseURL, token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/library', options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get Library Error"));
            }
        })
}

// Get Content Groups
async function getContentGroups(baseURL, token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/contentBundles', options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get content groups Error"));
            }
        })
}

// Get List of available projects
async function getProjects(baseURL, token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/monitors/projects', options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get project Error"));
            }
        })
}

// Get child contents of content group
async function getContentGroupsChild(baseURL, token, groupid, projectid) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/contentBundles/' + groupid + '/contents?projectId=' + projectid, options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get content group child Error"));
            }
        })
}

// Generate AUthentication token
async function getAuthToken(baseUrl) {
    const options = {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: { "content-type": "application/json" },
    };
    return await fetch(
            baseUrl + "/api/auth/token",
            options
        )
        .then((response) => {
            if (response.ok) {
                return response.headers.get("x-mstr-authtoken");
            } else {
                response.json().then((json) => console.log(json));
            }
        })
        .catch((error) =>
            console.error("Failed to retrieve authToken with error:", error)
        );
}

// Create new User
async function createUser(token, raw, baseURL) {
    let options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
            "content-type": "application/json",
            "x-mstr-authtoken": token,
        },
        body: raw,
        redirect: 'follow'
    };

    return await fetch(baseURL + "/api/users", options)
        .then(response => response.text())
        .then(result => console.log("UserSync Result :", result))
        .catch(error => console.log("UserSync Failed :", error));
}

// Get availbale MSTR users
async function getUsersMSTR(token, baseURL) {

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
        .then(result => { return result })
        .catch(error => console.log('error', error));

}

// Logout from MSTR
async function userLogout(token, baseURL) {
    var options = {
        method: 'POST',
        redirect: 'follow',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': sessionStorage.getItem('token'),
        }
    }
    fetch("https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/api/auth/logout", options)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    sessionStorage.clear();
    location.href = "login.html";

}


// Search Dossier 
async function searchDossier(projectID, token) {
    const baseURL = "https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary"

    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        }
    }

    return fetch(baseURL + "/api/searches/results?type=55&name=DossierTemplate", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Fetching Dossier List Error"));
            }
        })

}

// Create dossier instance
async function createDossierInstance(token, baseURL, projectID, dossierID) {

    var raw = JSON.stringify({
        "filters": null,
        "persistViewState": true,
        "resolveOnly": false
    });


    var options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        },
        body: raw
    }


    return fetch(baseURL + "/api/dossiers/" + dossierID + "/instances", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Create Dossier Instance Error"));
            }
        })

}


// Get dossier instance info
async function dossierInstanceInfo(token, baseURL, projectID, dossierID, dossierInstanceID) {

    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        }
    }

    return fetch(baseURL + "/api/dossiers/" + dossierID + "/instances/" + dossierInstanceID + "?includeTOC=true&includeShortcutInfo=true&resultFlag=3&checkPrompted=true", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error(" Dossier Instance Info Error"));
            }
        })
}


// Get list of bookmarks
async function getBookmarks(token, baseURL, projectID, shortcutID) {

    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        }
    }

    return fetch(baseURL + "/api/shortcuts/" + shortcutID + "/bookmarks", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get Bookmarks Error"));
            }
        })
}

// Create new bookmark
async function createBookmark(token, baseURL, projectID, dossierInstanceID, bookmarkName) {

    var raw = JSON.stringify({
        "name": bookmarkName,
        "instanceId": dossierInstanceID
    });


    var options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        },
        body: raw
    }

    return fetch(baseURL + "/api/bookmarks", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Create Bookmark Error"));
            }
        })
}

// Delete existing bookmark
async function deleteBookmarkApi(token, baseURL, projectID, shortcutID, bookmarkID) {

    var raw = JSON.stringify({
        "shortcutId": shortcutID
    });

    var options = {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        },
        body: raw
    }


    return fetch(baseURL + "/api/bookmarks/" + bookmarkID, options)
        .then(function(response) {
            if (response.ok) {
                return response
            } else {
                throw (new Error("Delete Bookmark Error"));
            }
        })

}

// Get list of favourite Dossier
async function getFavoritesAPI(token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
        }
    }

    return fetch(baseURL + "/api/library/shortcutGroups", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get favourite list Error"));
            }
        })
}

// Add Dossier to favourite list
async function addFavoriteAPI(token, dossierID, projectID) {
    var raw = JSON.stringify({
        "operationList": [{
            "op": "addElements",
            "path": "/itemKeys",
            "value": [
                dossierID + "_" + projectID
            ]
        }]
    });

    var options = {
        method: 'PATCH',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
        },
        body: raw
    }

    fetch("https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/api/library/shortcutGroups/favorites", options)
        .then(function(response) {
            if (response.ok) {
                console.log("Dossier Added to Homepage successfully!!!")
                location.reload(true);
            } else {
                throw (new Error("Add favourite list Error"));
            }
        })
}

// Remove dossier from favourite list
async function removeFavoriteAPI(token, dossierID, projectID) {
    var raw = JSON.stringify({
        "operationList": [{
            "op": "removeElements",
            "path": "/itemKeys",
            "value": [
                dossierID + "_" + projectID
            ]
        }]
    });

    var options = {
        method: 'PATCH',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
        },
        body: raw
    }

    fetch("https://env-292687.trial.cloud.microstrategy.com/MicroStrategyLibrary/api/library/shortcutGroups/favorites", options)
        .then(function(response) {
            if (response.ok) {
                console.log("Dossier removed from Homepage successfully!!!")
                location.reload(true);
            } else {
                throw (new Error("Remove favourite Error"));
            }
        })
}

// Get list of child contents from content groups
async function getContentGroupsChildUpdated(baseURL, token, groupid, projects) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        }
    }

    return fetch(baseURL + '/api/contentGroups/' + groupid + '/contents?projectId=' + projects, options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Get content group child Error"));
            }
        })
}

// Get list of all User groups
async function getalluserGroups() {
    let token = sessionStorage.getItem("token");
    let baseURL = sessionStorage.getItem("baseURL");
    var options = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-mstr-authtoken': token
        },
        mode: 'cors',
        redirect: 'follow',
    }

    return fetch(baseURL + "/api/usergroups", options)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw (new Error("Fetching user group"));
            }
        })

}
var searchprojectID = "00008A405A4F07AF829B4AB7C265A695";
var searchfolderName = "Comprehend";

// Get Folder details 
async function getFolderDetails(token, searchprojectID, searchfolderName) {
    let baseURL = sessionStorage.getItem("baseURL");
    // let projectID = "00008A405A4F07AF829B4AB7C265A695";
    // let folderName = "Comprehend";
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': searchprojectID
        }
    }

    return fetch(baseURL + "/api/searches/results?name=" + searchfolderName + "&pattern=2&type=8", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Fetching Folder Details"));
            }
        })
}

// Get child folder details
async function getChildFolderDetails(token, projectID, folderID) {
    let baseURL = sessionStorage.getItem("baseURL");

    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        }
    }

    return fetch(baseURL + "/api/folders/" + folderID, options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Fetching child folder Details"));
            }
        })
}

// Give access to specific user group on a specific dossier
async function updateAccess(token, projectID, selectedFolderId, userGroupid) {
    let baseURL = sessionStorage.getItem("baseURL");

    var raw = JSON.stringify({
        "acl": [{
            "op": "ADD",
            // "op": "Remove",
            "trustee": userGroupid,
            "rights": 199,
            "denied": false,
            "inheritable": false,
            "type": 1
        }],
        "propagateACLToChildren": false
    });

    var options = {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': token,
            'X-MSTR-ProjectID': projectID
        },
        body: raw,
        redirect: 'follow'
    };



    return fetch(baseURL + "/api/objects/" + selectedFolderId + "?type=8&flags=70", options)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                throw (new Error("Update Folder access"));
            }
        })
}

//  PDF & Excel Export
async function exportPDFExcel(type, allSingle) {
    const exptype = allSingle === "SINGLE" ? false : true;
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

    return fetch(baseURL + "/api/documents/" + dossierId + "/instances/" + instanceId + "/" + type, options)
        .then(function(response) {
            if (response.ok) {
                return response;
            } else {
                throw (new Error("Update Folder access"));
            }
        })


}

// User synchronization
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
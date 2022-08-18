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
                throw (new Error("Get Library Error"));
            }
        })
}


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
                throw (new Error("Get Library Error"));
            }
        })
}




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
                throw (new Error("Get Library Error"));
            }
        })
}


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
                console.log("AUTH TOKEN", response.headers.get("x-mstr-authtoken"))
                return response.headers.get("x-mstr-authtoken");
            } else {
                response.json().then((json) => console.log(json));
            }
        })
        .catch((error) =>
            console.error("Failed to retrieve authToken with error:", error)
        );
}

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

async function userLogout(token, baseURL) {
    var options = {
        method: 'POST',
        redirect: 'follow',
        credentials: 'include',
        // mode: 'cors',
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
                throw (new Error("Fetching Dossier List Error"));
            }
        })

}


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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}



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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}


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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}




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
                throw (new Error("Fetching Dossier List Error"));
            }
        })

}


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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}


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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}


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
                throw (new Error("Fetching Dossier List Error"));
            }
        })
}


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
                throw (new Error("Get Library Error"));
            }
        })
}
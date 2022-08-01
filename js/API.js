async function login(baseURL,user,pass, loginMode) {
    var options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username:user,
            password:pass,
            loginMode: loginMode
        })
    }

    return fetch(baseURL + '/api/auth/login', options)
    .then(function (response) {
        if (response.ok) {
            console.log("Cookieee Info")
            console.log(response.headers.get('x-mstr-authToken'));
            return response.headers.get('x-mstr-authToken')
        } else {
            throw(new Error("Login Error"))
        }
    })
}


 async function getSession(baseURL,token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/sessions', options)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            console.log(response.json());
            throw(new Error("Get Session Error"));
        }
    })

}


async function extendSession(baseURL,token) {
    var options = {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/sessions', options)
        .then(function (response) {
            if (response.ok) {
                return true
            } else {
                return false
            }
        })
}


async function getLibrary(baseURL,token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/library', options)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw(new Error("Get Library Error"));
        }
    })    
}


async function getContentGroups(baseURL,token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/contentBundles', options)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw(new Error("Get Library Error"));
        }
    })    
}


async function getProjects(baseURL,token) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/monitors/projects', options)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw(new Error("Get Library Error"));
        }
    })    
}




async function getContentGroupsChild(baseURL,token,groupid,projectid) {
    var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    return fetch(baseURL + '/api/contentBundles/'+ groupid+ '/contents?projectId='+ projectid, options)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw(new Error("Get Library Error"));
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
        if (response.ok) 
        {
            console.log("AUTH TOKEN",response.headers.get("x-mstr-authtoken"))
            return response.headers.get("x-mstr-authtoken");
        }
        else {
            response.json().then((json) => console.log(json));
        }
      })
      .catch((error) =>
        console.error("Failed to retrieve authToken with error:", error)
      );
  }

async function createUser(token,raw,baseURL){
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

     return await fetch(baseURL+ "/api/users", options)
    .then(response => response.text())
    .then(result => console.log("UserSync Result :", result))
    .catch(error => console.log("UserSync Failed :", error));
}


async function getUsersMSTR(token,baseURL){

      var options = {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {'Content-Type': 'application/json',
                  'x-mstr-authtoken': token
                 }
    }

    await fetch(baseURL+ "/api/users", options)
    .then(response => response.text())
    .then(result => {return result})
    .catch(error => console.log('error', error));

}
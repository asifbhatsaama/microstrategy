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
            console.log(response.headers.get('x-mstr-authToken'));
            return response.headers.get('x-mstr-authToken')
        } else {
            throw(new Error("Login Error"))
        }
    })
}


 async function getSession(baseURL,token) {
    console.log("Inside get session method", token);
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
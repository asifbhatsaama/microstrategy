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

// async function main() {
//     const baseURL = "https://demo.microstrategy.com/MicroStrategyLibrary";
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
//     const loginMode = 8;

//     login(baseURL, username, password, loginMode)
//     .then((token)=> {
//         sessionStorage.setItem("baseURL", baseURL);
//         sessionStorage.setItem("token", token);
//         location.href = "dossiers.html";
    
//     }).catch(function (error) {
//         console.log(error);
//     })
    
// }

// main();
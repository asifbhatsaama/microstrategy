baseURL = 'https://demo.microstrategy.com/MicroStrategyLibrary';
username = 'Guest';
password = '';
loginMode = 8;


// async function login(baseURL, username, password, loginMode) {
async function login(baseURL, username, password, loginMode) {
    var options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'guest',
            password: '',
            loginMode: 8
        })
    }
    fetch('https://demo.microstrategy.com/MicroStrategyLibrary' + '/api/auth/login', options)
        .then(function (response) {
            if (response.ok) {
                console.log("Auth Token :")
                console.log(response.headers.get('x-mstr-authToken'));
                // return response.headers.get('x-mstr-authToken')

                let urls = 'https://demo.microstrategy.com/MicroStrategyLibrary'
                let token = response.headers.get('x-mstr-authToken');

                async function getSession(urls, token) {
                    var options1 = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    return fetch('https://demo.microstrategy.com/MicroStrategyLibrary' + '/api/sessions', options1)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Get current Session :")
                                console.log(response.json());
                                // return response.json()
                            } else {
                                throw (new Error("Get Session Error"));
                            }
                        })
                }

                async function extendSession(urls, token) {
                    var options = {
                        method: 'PUT',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch('https://demo.microstrategy.com/MicroStrategyLibrary' + '/api/sessions', options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Extend session");
                                return true
                            } else {
                                return false
                            }
                        })
                }

                async function getLibrary(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    return fetch('https://demo.microstrategy.com/MicroStrategyLibrary' + '/api/library', options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of Libraries :")
                                console.log(response.json());
                                // return response.json()
                            } else {
                                throw (new Error("Get Library Error"));
                            }
                        })
                }

                async function getsingleapplications(urls, token) {
                    var options2 = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/v2/applications/C2B2023642F6753A2EF159A75E0CFF29", options2)
                        // .then(response => response.text())
                        // .then(result => console.log(result))
                        // .catch(error => console.log('error', error));
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Single application details :")
                                console.log(response.json());
                            } else {
                                console.log("Error to fetch application");
                            }

                        })

                }


                async function getallapplications(urls, token) {
                    var options2 = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/v2/applications", options2)
                        // .then(response => response.text())
                        // .then(result => console.log(result))
                        // .catch(error => console.log('error', error));
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of all Applications :")
                                console.log(response.json());
                            } else {
                                console.log("Error to fetch application");
                            }
                        })

                }


                async function projectSession(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token,
                            'X-MSTR-ProjectID': 'A728B9A98C420236E6C825AAB4A812D6'
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/sessions/projectId", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Project Session");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })
                }

                async function authenticatedUser(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/sessions/userInfo", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Authenticated user Info");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                    // fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/sessions/userInfo", options)
                    //     .then(response => response.text())
                    //     .then(result => console.log(result))
                    //     .catch(error => console.log('error', error));
                }


                async function listofPrivileges(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/sessions/privileges", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Privileges :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                }

                // async function baseFormula(urls, token) {
                //     var options = {
                //         method: 'GET',
                //         credentials: 'include',
                //         mode: 'cors',
                //         redirect: 'follow',
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'x-mstr-authtoken': token,
                //             "X-MSTR-MS-Changeset": 'rd_changesetId'
                //         }
                //     }

                //     fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/model/formulas/rd_baseFormulaId", options)
                //         .then(function (response) {
                //             if (response.ok) {
                //                 console.log("Base Formula :");
                //                 console.log(response.json());
                //                 return true
                //             } else {
                //                 return false
                //             }
                //         })

                // }


                async function contentFolders(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token,
                            'X-MSTR-ProjectID': 'A728B9A98C420236E6C825AAB4A812D6'
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/folders", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of Folders :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                }

                async function getcontentsofFolders(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token,
                            'X-MSTR-ProjectID': 'A728B9A98C420236E6C825AAB4A812D6'
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/folders/42EEDD41A6954F7485453C170AA3F8BE", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Contents of Folders :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                }

                async function getSearchResults(baseURL, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        },
                    }

                    return fetch('https://demo.microstrategy.com/MicroStrategyLibrary/api/searches/results?name=' + 'Office Royale Sales', options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("Search Result");
                                console.log(response.json());
                                // return response.json();
                            } else {
                                throw (new Error("Search Error"));
                            }
                        })

                }


                async function getcontactGroups(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/contactGroups", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of all contact Groups :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                }

                async function getcontactList(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/contacts", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of all contact :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })
                }

                async function listofsecurityFilters(urls, token) {
                    var options = {
                        method: 'GET',
                        credentials: 'include',
                        mode: 'cors',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-mstr-authtoken': token,
                            'X-MSTR-ProjectID': 'A728B9A98C420236E6C825AAB4A812D6'
                        }
                    }

                    fetch("https://demo.microstrategy.com/MicroStrategyLibrary/api/securityFilters", options)
                        .then(function (response) {
                            if (response.ok) {
                                console.log("List of security Filters :");
                                console.log(response.json());
                                return true
                            } else {
                                return false
                            }
                        })

                }


                getSession(urls, token);
                extendSession(urls, token);
                getLibrary(urls, token);
                getsingleapplications(urls, token);
                getallapplications(urls, token);
                projectSession(urls, token);
                authenticatedUser(urls, token);
                listofPrivileges(urls, token);
                // baseFormula(urls, token);
                contentFolders(urls, token);
                getcontentsofFolders(urls, token);
                getSearchResults(baseURL, token);
                // getcontactGroups(urls, token);
                // getcontactList(urls, token);
                listofsecurityFilters(urls, token);


            } else {
                throw (new Error("Login Error"))
            }
        })
}

login();
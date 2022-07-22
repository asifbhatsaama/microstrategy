/* Standard Authentication Start */
config.customAuthenticationType =
window.microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN;
config.enableCustomAuthentication = true;
config.getLoginToken = async function login() {
// Check if the user has an existing login session through getting the authToken
async function getAuthToken(options, baseServerUrl, libraryName) {
  return await fetch(
    baseServerUrl + "/" + libraryName + "/api/auth/token",
    options
  )
    .then((response) => {
      if (response.ok)
        return response.headers.get("x-mstr-authtoken");
      else response.json().then((json) => console.log(json));
    })
    .catch((error) =>
      console.error("Failed to retrieve authToken with error:", error)
    );
}
let options = {
  method: "GET",
  credentials: "include", // Including cookie
  mode: "cors", // Setting as cors mode for cross origin
  headers: { "content-type": "application/json" },
};
// Need to parse the libraryName and baseServerUrl from the url to make api calls
const urlRegExp = new RegExp(
  "(https?://[-a-zA-Z0-9@:%_.~#=+/]+)/([-a-zA-Z0-9@:%_.~#=+]+)/app/([A-Z0-9]+)/([A-Z0-9]+)"
);
const urlMatched = url.match(urlRegExp);
const baseServerUrl = urlMatched?.[1] || "";
const libraryName = urlMatched?.[2] || "";

let authToken = await getAuthToken(
  options,
  baseServerUrl,
  libraryName
).catch((error) => console.error(error));
// If the authToken is available, return it
if (!!authToken) {
  console.log("An existing login session has been found, logging in");
  return authToken;
}

// Make a call to REST API to log the user in, if there is not a valid authToken
options = {
  method: "POST",
  credentials: "include", // Including cookie
  mode: "cors", // Setting as cors mode for cross origin
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    loginMode: 1, // 1 means Standard login
    username: prompt("Please enter your username"),
    password: prompt("Please enter your password"),
  }),
};
return fetch(
  baseServerUrl + "/" + libraryName + "/api/auth/login",
  options
)
  .then((response) => {
    if (response.ok) {
      console.log(
        "A new standard login session has been created successfully, logging in"
      );
      return response.headers.get("x-mstr-authtoken");
    } else response.json().then((json) => console.log(json));
  })
  .catch((error) =>
    console.error("Failed Standard Login with error:", error)
  );
};
/* Standard Authentication End */
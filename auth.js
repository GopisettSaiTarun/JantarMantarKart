// =========================================
// JANTARMANTARKART AUTHENTICATION
// =========================================


// Get registered users
function getUsers() {

    return JSON.parse(
        localStorage.getItem("jantarMantarKartUsers")
    ) || [];

}


// Save users
function saveUsers(users) {

    localStorage.setItem(
        "jantarMantarKartUsers",
        JSON.stringify(users)
    );

}


// Get current logged-in user
function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("jantarMantarKartCurrentUser")
    );

}


// Check whether user is logged in
function isLoggedIn() {

    return getCurrentUser() !== null;

}


// Sign out
function logout() {

    localStorage.removeItem(
        "jantarMantarKartCurrentUser"
    );

    window.location.href = "index.html";

}
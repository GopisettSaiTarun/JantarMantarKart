// =========================================
// JANTARMANTARKART AUTHENTICATION
// =========================================


// Get registered users

function getUsers() {

    const users =
        localStorage.getItem(
            "jantarMantarKartUsers"
        );

    return users
        ? JSON.parse(users)
        : [];

}


// Save registered users

function saveUsers(users) {

    localStorage.setItem(
        "jantarMantarKartUsers",
        JSON.stringify(users)
    );

}


// Get current logged-in user

function getCurrentUser() {

    const user =
        localStorage.getItem(
            "jantarMantarKartCurrentUser"
        );

    return user
        ? JSON.parse(user)
        : null;

}


// Check login

function isLoggedIn() {

    return getCurrentUser() !== null;

}


// Logout

function logout() {

    localStorage.removeItem(
        "jantarMantarKartCurrentUser"
    );

    window.location.href =
        "signin.html";

}
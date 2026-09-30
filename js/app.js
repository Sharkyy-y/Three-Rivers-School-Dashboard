// ===============================
// DEMO LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const message =
            document.getElementById("loginMessage");


        if (!username || !password) {

            message.textContent =
                "Please enter your Student ID and password.";

            return;
        }


        /*
            DEMO LOGIN

            We will replace this with
            Firebase Authentication.
        */

        if (
            username === "student" &&
            password === "1234"
        ) {

            localStorage.setItem(
                "studentLoggedIn",
                "true"
            );

            localStorage.setItem(
                "studentName",
                "Meshack"
            );

            window.location.href =
                "dashboard.html";

        } else {

            message.textContent =
                "Incorrect Student ID or password.";

        }

    });

}


// ===============================
// PROTECT DASHBOARD
// ===============================

function checkLogin() {

    const isLoggedIn =
        localStorage.getItem("studentLoggedIn");

    const currentPage =
        window.location.pathname;


    if (
        !isLoggedIn &&
        currentPage.includes("dashboard.html")
    ) {

        window.location.href =
            "index.html";

    }

}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem(
        "studentLoggedIn"
    );

    localStorage.removeItem(
        "studentName"
    );

    window.location.href =
        "index.html";
}


// ===============================
// DISPLAY STUDENT NAME
// ===============================

function displayStudentName() {

    const studentName =
        localStorage.getItem("studentName");

    const nameElements =
        document.querySelectorAll(
            "#studentName, #welcomeName"
        );

    nameElements.forEach(element => {

        if (studentName) {
            element.textContent =
                studentName;
        }

    });

}


// RUN

checkLogin();
displayStudentName();

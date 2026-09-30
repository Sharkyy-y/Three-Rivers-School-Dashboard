// ==========================================
// THREE RIVERS SCHOOL DASHBOARD
// Demo JavaScript
// ==========================================


// -----------------------------
// PAGE NAVIGATION
// -----------------------------

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const pageName = item.dataset.page;

        if (!pageName) return;

        // Remove active navigation
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        // Activate selected navigation
        item.classList.add("active");

        // Hide all pages
        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        // Show selected page
        const selectedPage = document.getElementById(pageName);

        if (selectedPage) {
            selectedPage.classList.add("active-page");
        }

        // Change page title
        const title = item.innerText.trim();

        pageTitle.textContent = title;

        // Close mobile menu
        closeMobileMenu();

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// -----------------------------
// VIEW ALL BUTTONS
// -----------------------------

const pageLinks = document.querySelectorAll("[data-page-link]");

pageLinks.forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.pageLink;

        const navButton =
            document.querySelector(
                `.nav-item[data-page="${target}"]`
            );

        if (navButton) {
            navButton.click();
        }

    });

});


// -----------------------------
// CURRENT DATE
// -----------------------------

const currentDate = document.getElementById("currentDate");

function updateDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    currentDate.textContent =
        today.toLocaleDateString("en-US", options);

}

updateDate();


// -----------------------------
// MOBILE MENU
// -----------------------------

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openMobileMenu() {

    sidebar.classList.add("open");
    overlay.classList.add("show");

}

function closeMobileMenu() {

    sidebar.classList.remove("open");
    overlay.classList.remove("show");

}

menuButton.addEventListener("click", openMobileMenu);

overlay.addEventListener("click", closeMobileMenu);


// -----------------------------
// NOTIFICATIONS
// -----------------------------

const notificationButton =
    document.getElementById("notificationButton");

const notificationPopup =
    document.getElementById("notificationPopup");

const closeNotification =
    document.getElementById("closeNotification");


notificationButton.addEventListener("click", () => {

    notificationPopup.classList.toggle("show");

});


closeNotification.addEventListener("click", () => {

    notificationPopup.classList.remove("show");

});


// Close notification when clicking outside

document.addEventListener("click", event => {

    const clickedInside =
        notificationPopup.contains(event.target);

    const clickedButton =
        notificationButton.contains(event.target);

    if (!clickedInside && !clickedButton) {

        notificationPopup.classList.remove("show");

    }

});


// -----------------------------
// DARK MODE
// -----------------------------

const darkModeToggle =
    document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {

    darkModeToggle.classList.toggle("active");

    document.body.classList.toggle("dark-mode");

});


// -----------------------------
// WELCOME MESSAGE
// -----------------------------

const hour = new Date().getHours();

const welcomeHeading =
    document.querySelector(".welcome h2");

if (welcomeHeading) {

    if (hour < 12) {

        welcomeHeading.innerHTML =
            "Good morning, Alex! 👋";

    } else if (hour < 18) {

        welcomeHeading.innerHTML =
            "Good afternoon, Alex! 👋";

    } else {

        welcomeHeading.innerHTML =
            "Good evening, Alex! 👋";

    }

}


// -----------------------------
// SIMPLE ASSIGNMENT COUNTER
// -----------------------------

const assignmentCards =
    document.querySelectorAll(".assignment-card");

console.log(
    `Loaded ${assignmentCards.length} demo assignments.`
);


// -----------------------------
// DASHBOARD LOADED
// -----------------------------

console.log(
    "Three Rivers School Dashboard loaded successfully."
);


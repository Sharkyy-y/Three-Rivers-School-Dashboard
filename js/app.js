// ========================================
// THREE RIVERS ACADEMY - AUTHENTICATION
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        if (message) {
            message.textContent = "Signing in...";
        }

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error(error);

            if (message) {
                message.textContent = error.message;
            }

            return;
        }

        console.log("Login successful:", data);

        window.location.href = "dashboard.html";
    });
}


// ========================================
// PROTECT DASHBOARD
// ========================================

async function checkLogin() {
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "index.html";
    }

    return session;
}


// ========================================
// LOGOUT
// ========================================

async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return;
    }

    window.location.href = "index.html";
}


// ========================================
// RUN LOGIN CHECK ON DASHBOARD
// ========================================

if (window.location.pathname.includes("dashboard.html")) {
    checkLogin();
}

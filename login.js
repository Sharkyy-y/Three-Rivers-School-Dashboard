const SUPABASE_URL = "https://glyqggtzjbsppgngrymv.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_0G3U6g24oiEqjIrcCuD-RA_ffXwgILl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const loginForm = document.getElementById("loginForm");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");


loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginButton.disabled = true;

    loginButton.textContent = "Logging in...";

    loginMessage.textContent = "";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        loginMessage.textContent =
            "Login failed: " + error.message;

        loginMessage.style.color = "#dc2626";

        loginButton.disabled = false;

        loginButton.textContent = "Login";

        return;
    }


    loginMessage.textContent =
        "Login successful!";

    loginMessage.style.color = "#16a34a";


    setTimeout(() => {

        window.location.href = "index.html";

    }, 700);

});

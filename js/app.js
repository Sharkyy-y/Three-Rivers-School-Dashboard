// ========================================
// THREE RIVERS ACADEMY - AUTHENTICATION
// ========================================

const loginForm = document.getElementById("loginForm");

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("loginMessage");

            message.textContent = "Signing in...";

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                console.error("LOGIN ERROR:", error);
                message.textContent = error.message;
                return;
            }

            console.log("LOGIN SUCCESS:", data);

            window.location.href = "dashboard.html";
        });
    }
});

async function loadStudentProfile() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    const userId = session.user.id;

    const { data: student, error } = await supabaseClient
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Could not load student:", error);
        return;
    }

    console.log("Student profile:", student);

    const nameElement =
        document.getElementById("studentName");

    if (nameElement) {
        nameElement.textContent =
            `${student.first_name} ${student.last_name}`;
    }
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

async function loadTimetable() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    const { data, error } = await supabaseClient
        .from("timetables")
        .select(`
            id,
            day_of_week,
            start_time,
            end_time,
            room,
            teacher_name,
            subjects (
                name,
                code
            )
        `)
        .eq("student_id", session.user.id)
        .order("start_time");

    if (error) {
        console.error("Timetable error:", error);
        return;
    }

    console.log("Timetable:", data);

    const timetableContainer =
        document.getElementById("timetableContainer");

    if (!timetableContainer) return;

    timetableContainer.innerHTML = "";

    data.forEach(item => {

        const row = document.createElement("div");

        row.className = "timetable-row";

        row.innerHTML = `
            <div>
                <strong>${item.day_of_week}</strong>
            </div>

            <div>
                ${item.start_time} - ${item.end_time}
            </div>

            <div>
                <strong>${item.subjects.name}</strong>
                <br>
                <small>${item.teacher_name || ""}</small>
            </div>

            <div>
                ${item.room || ""}
            </div>
        `;

        timetableContainer.appendChild(row);
    });
}

if (window.location.pathname.includes("timetable.html")) {
    loadTimetable();
}

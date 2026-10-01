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


async function loadStudentProfile() {
  const { data: { user }, error: authError } =
    await supabaseClient.auth.getUser();

  if (authError || !user) {
    window.location.href = "login.html";
    return;
  }

  const { data: student, error } = await supabaseClient
    .from("students")
    .select("student_id, first_name, last_name, email, class_name, admission_year")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Could not load student profile:", error.message);
    return;
  }

  if (!student) {
    console.log("No student profile is linked to this account yet.");
    return;
  }

  const nameElement = document.getElementById("studentName");
  const classElement = document.getElementById("studentClass");
  const idElement = document.getElementById("studentId");

  if (nameElement) {
    nameElement.textContent =
      `${student.first_name} ${student.last_name}`;
  }

  if (classElement) {
    classElement.textContent = student.class_name || "Not assigned";
  }

  if (idElement) {
    idElement.textContent = student.student_id;
  }
}

async function loadDashboardStats() {
    try {
        // Get the currently logged-in student
        const { data: { user }, error: authError } =
            await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error("User not logged in.");
            return;
        }

        // ==========================================
        // 1. LOAD GRADES
        // ==========================================

        const { data: grades, error: gradesError } =
            await supabaseClient
                .from("grades")
                .select("score, max_score")
                .eq("student_id", user.id);

        if (gradesError) {
            console.error("Could not load grades:", gradesError.message);
        } else {

            let totalScore = 0;
            let totalMaxScore = 0;

            grades.forEach(grade => {
                if (
                    grade.score !== null &&
                    grade.max_score !== null &&
                    Number(grade.max_score) > 0
                ) {
                    totalScore += Number(grade.score);
                    totalMaxScore += Number(grade.max_score);
                }
            });

            let academicAverage = 0;

            if (totalMaxScore > 0) {
                academicAverage =
                    Math.round((totalScore / totalMaxScore) * 100);
            }

            const academicElement =
                document.getElementById("academicAverage");

            if (academicElement) {
                academicElement.textContent =
                    `${academicAverage}%`;
            }
        }


        // ==========================================
        // 2. LOAD ATTENDANCE
        // ==========================================

        const { data: attendance, error: attendanceError } =
            await supabaseClient
                .from("attendance")
                .select("status")
                .eq("student_id", user.id);

        if (attendanceError) {
            console.error(
                "Could not load attendance:",
                attendanceError.message
            );
        } else {

            let attendancePercentage = 0;

            if (attendance.length > 0) {

                const presentCount = attendance.filter(record => {
                    const status =
                        String(record.status).toLowerCase().trim();

                    return status === "present";
                }).length;

                attendancePercentage =
                    Math.round(
                        (presentCount / attendance.length) * 100
                    );
            }

            const attendanceElement =
                document.getElementById("attendancePercentage");

            if (attendanceElement) {
                attendanceElement.textContent =
                    `${attendancePercentage}%`;
            }
        }


        // ==========================================
        // 3. LOAD ASSIGNMENTS
        // ==========================================

        const { count: assignmentCount, error: assignmentsError } =
            await supabaseClient
                .from("assignments")
                .select("*", {
                    count: "exact",
                    head: true
                });

        if (assignmentsError) {
            console.error(
                "Could not load assignments:",
                assignmentsError.message
            );
        } else {

            const assignmentElement =
                document.getElementById("assignmentCount");

            if (assignmentElement) {
                assignmentElement.textContent =
                    assignmentCount ?? 0;
            }
        }

    } catch (error) {
        console.error(
            "Dashboard statistics error:",
            error
        );
    }
}

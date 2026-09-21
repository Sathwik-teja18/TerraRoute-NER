document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const splash = document.getElementById("splash-screen");
    const entry = document.getElementById("entry-screen");
    const login = document.getElementById("login-screen");
    const app = document.getElementById("main-app");

    const roleButtons = document.querySelectorAll(".role-card");

    const selectedRole =
        document.getElementById("selected-role");

    const loginForm =
        document.getElementById("login-form");

    const robotCheckbox =
        document.getElementById("robot-checkbox");

    const loginError =
        document.getElementById("login-error");

    const backEntry =
        document.getElementById("back-entry");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");


    let currentRole = "";


    /* =========================================================
       DEMO LOGIN CREDENTIALS
       ========================================================= */

    const DEMO_CREDENTIALS = {

        "Disaster Management Team": {
            username: "dmt_admin",
            password: "DMT@12345"
        },

        "Government": {
            username: "gov_admin",
            password: "GOV@12345"
        }

    };


    /* =========================================================
       SCREEN CONTROL
       ========================================================= */

    function showScreen(screen) {

        [entry, login].forEach(item => {

            if (item) {
                item.classList.add("hidden");
            }

        });


        if (screen) {
            screen.classList.remove("hidden");
        }

    }


    /* =========================================================
       ROLE STYLING
       ========================================================= */

    function setRoleStyling(role) {

        if (!login) {
            return;
        }


        login.classList.remove(
            "role-government",
            "role-disaster"
        );


        if (role === "Government") {

            login.classList.add(
                "role-government"
            );

        }


        if (
            role ===
            "Disaster Management Team"
        ) {

            login.classList.add(
                "role-disaster"
            );

        }

    }


    /* =========================================================
       SPLASH SCREEN
       ========================================================= */

    window.setTimeout(() => {

        if (splash) {
            splash.classList.add("fade-out");
        }


        window.setTimeout(() => {

            if (splash) {
                splash.classList.add("hidden");
            }

            showScreen(entry);

        }, 900);

    }, 2600);


    /* =========================================================
       ROLE SELECTION
       ========================================================= */

    roleButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentRole =
                    button.dataset.role || "";


                if (selectedRole) {

                    selectedRole.textContent =
                        `Access: ${currentRole}`;

                }


                if (loginError) {

                    loginError.textContent = "";

                }


                if (loginForm) {

                    loginForm.reset();

                }


                setRoleStyling(
                    currentRole
                );


                showScreen(login);

            }
        );

    });


    /* =========================================================
       BACK TO ROLE SELECTION
       ========================================================= */

    if (backEntry) {

        backEntry.addEventListener(
            "click",
            () => {

                if (loginForm) {
                    loginForm.reset();
                }


                if (loginError) {
                    loginError.textContent = "";
                }


                if (login) {

                    login.classList.remove(
                        "role-government",
                        "role-disaster"
                    );

                }


                currentRole = "";


                showScreen(entry);

            }
        );

    }


    /* =========================================================
       LOGIN
       ========================================================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (loginError) {
                    loginError.textContent = "";
                }


                /* -----------------------------------------
                   ROBOT CHECK
                   ----------------------------------------- */

                if (
                    !robotCheckbox ||
                    !robotCheckbox.checked
                ) {

                    if (loginError) {

                        loginError.textContent =
                            "Please complete the “I am not a robot” verification.";

                    }

                    return;

                }


                /* -----------------------------------------
                   GET INPUT
                   ----------------------------------------- */

                const username =
                    usernameInput
                        ? usernameInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* -----------------------------------------
                   VALIDATE CREDENTIALS
                   ----------------------------------------- */

                if (
                    DEMO_CREDENTIALS[currentRole]
                ) {

                    const expected =
                        DEMO_CREDENTIALS[
                            currentRole
                        ];


                    if (
                        username !==
                            expected.username ||

                        password !==
                            expected.password
                    ) {

                        if (loginError) {

                            loginError.textContent =
                                "Invalid username or password for this role.";

                        }

                        return;

                    }

                }


                /* -----------------------------------------
                   AUTHENTICATION SUCCESS
                   ----------------------------------------- */

                sessionStorage.setItem(
                    "nerUserRole",
                    currentRole
                );


                sessionStorage.setItem(
                    "nerAuthenticated",
                    "true"
                );


                sessionStorage.setItem(
                    "nerUsername",
                    username
                );


                /* -----------------------------------------
                   SHOW MAIN APP
                   ----------------------------------------- */

                if (app) {

                    app.style.display =
                        "flex";

                }


                showScreen(null);


                /* -----------------------------------------
                   TELL ROLE MODULES
                   ----------------------------------------- */

                document.dispatchEvent(
                    new CustomEvent(
                        "nerRoleAuthenticated",
                        {
                            detail: {
                                role:
                                    currentRole,

                                username:
                                    username
                            }
                        }
                    )
                );


            }
        );

    }

});
(function () {

    "use strict";

    /*
    ============================================================
    NER SMART LOGISTICS
    GOVERNMENT INTERFACE
    ============================================================

    This file ONLY adds Government functionality.

    Existing files are NOT modified:
    - app.js
    - auth.js
    - map.js
    - route-engine.js
    - weather.js
    - schedule.js

    Government role is detected using:

        sessionStorage.nerUserRole === "Government"

    ============================================================
    */

    let governmentStarted = false;


    /* =========================================================
       ROLE
       ========================================================= */

    function isGovernment() {

        return sessionStorage.getItem("nerUserRole")
            === "Government";

    }


    /* =========================================================
       STORAGE KEYS
       ========================================================= */

    const ALERT_KEY =
        "ner_government_alerts";

    const HISTORY_KEY =
        "ner_government_history";

    const CHECKPOST_KEY =
        "ner_government_checkposts";

    const QUEUE_KEY =
        "ner_government_queue";


    /* =========================================================
       START GOVERNMENT INTERFACE
       ========================================================= */

    function startGovernment() {

        if (governmentStarted) {
            return;
        }

        if (!isGovernment()) {
            return;
        }

        governmentStarted = true;

        console.log(
            "[Government] Interface activated"
        );

        initialiseGovernmentData();

        createGovernmentSections();

        modifyExistingSidebar();

        modifyDashboard();

        setupGovernmentNavigation();

        setupDashboardLinks();

        renderGovernmentAlerts();

        renderScheduling();

        renderCheckposts();

        renderWarnings();

        renderHistory();

        createGovernmentModal();

    }


    /* =========================================================
       WAIT FOR AUTHENTICATION
       ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            startGovernment();

            const watcher =
                setInterval(function () {

                    if (isGovernment()) {

                        startGovernment();

                        clearInterval(watcher);

                    }

                }, 200);

            setTimeout(function () {

                clearInterval(watcher);

            }, 30000);

        }
    );


    /* =========================================================
       INITIAL DEMO DATA
       ========================================================= */

    function initialiseGovernmentData() {

        if (!localStorage.getItem(ALERT_KEY)) {

            const alerts = [

                {
                    id: "ALT-001",
                    type: "Landslide",
                    location: "Dima Hasao, Assam",
                    route: "NH-27",
                    severity: "High",
                    status: "Active",
                    source: "Field Report",
                    reportedBy: "Disaster Management Team",
                    description:
                        "Landslide reported near a vulnerable road section. Movement requires monitoring.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },

                {
                    id: "ALT-002",
                    type: "Heavy Rainfall",
                    location: "East Siang, Arunachal Pradesh",
                    route: "Regional Road Network",
                    severity: "Moderate",
                    status: "Active",
                    source: "Weather Intelligence",
                    reportedBy: "System",
                    description:
                        "Heavy rainfall may reduce road accessibility and increase travel time.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },

                {
                    id: "ALT-003",
                    type: "Road Blockage",
                    location: "Senapati, Manipur",
                    route: "NH-102",
                    severity: "Critical",
                    status: "Active",
                    source: "Field Report",
                    reportedBy: "Disaster Management Team",
                    description:
                        "Road blockage affecting movement through the corridor.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }

            ];

            localStorage.setItem(
                ALERT_KEY,
                JSON.stringify(alerts)
            );

        }


        if (!localStorage.getItem(HISTORY_KEY)) {

            localStorage.setItem(
                HISTORY_KEY,
                JSON.stringify([])
            );

        }


        if (!localStorage.getItem(CHECKPOST_KEY)) {

            const checkposts = [

                {
                    id: "CP-01",
                    name: "Guwahati Check-post",
                    location: "Guwahati, Assam",
                    status: "Operational",
                    vehicles: 27,
                    personnel: 4
                },

                {
                    id: "CP-02",
                    name: "Kohima Check-post",
                    location: "Kohima, Nagaland",
                    status: "Operational",
                    vehicles: 19,
                    personnel: 2
                },

                {
                    id: "CP-03",
                    name: "Senapati Check-post",
                    location: "Senapati, Manipur",
                    status: "Alert",
                    vehicles: 34,
                    personnel: 4
                }

            ];

            localStorage.setItem(
                CHECKPOST_KEY,
                JSON.stringify(checkposts)
            );

        }


        if (!localStorage.getItem(QUEUE_KEY)) {

            const queue = [

                {
                    vehicle: "NER-CARGO-104",
                    type: "Essential Cargo",
                    route: "Guwahati → Shillong",
                    priority: "High",
                    status: "In Transit",
                    eta: "02:15 hrs"
                },

                {
                    vehicle: "NER-CARGO-118",
                    type: "Routine Cargo",
                    route: "Imphal → Senapati",
                    priority: "Normal",
                    status: "Delayed",
                    eta: "04:30 hrs"
                },

                {
                    vehicle: "NER-TRK-209",
                    type: "Essential Supplies",
                    route: "Dimapur → Kohima",
                    priority: "Emergency",
                    status: "Priority Movement",
                    eta: "01:10 hrs"
                }

            ];

            localStorage.setItem(
                QUEUE_KEY,
                JSON.stringify(queue)
            );

        }

    }


    /* =========================================================
       STORAGE HELPERS
       ========================================================= */

    function getAlerts() {

        try {

            return JSON.parse(
                localStorage.getItem(ALERT_KEY) || "[]"
            );

        } catch (error) {

            return [];

        }

    }


    function saveAlerts(data) {

        localStorage.setItem(
            ALERT_KEY,
            JSON.stringify(data)
        );

    }


    function getHistory() {

        try {

            return JSON.parse(
                localStorage.getItem(HISTORY_KEY) || "[]"
            );

        } catch (error) {

            return [];

        }

    }


    function saveHistory(data) {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(data)
        );

    }


    function getCheckposts() {

        try {

            return JSON.parse(
                localStorage.getItem(CHECKPOST_KEY) || "[]"
            );

        } catch (error) {

            return [];

        }

    }


    function saveCheckposts(data) {

        localStorage.setItem(
            CHECKPOST_KEY,
            JSON.stringify(data)
        );

    }


    function getQueue() {

        try {

            return JSON.parse(
                localStorage.getItem(QUEUE_KEY) || "[]"
            );

        } catch (error) {

            return [];

        }

    }


    /* =========================================================
       CREATE GOVERNMENT SECTIONS
       ========================================================= */

    function createGovernmentSections() {

        const main =
            document.querySelector(".main");

        if (!main) {
            console.error(
                "[Government] .main not found"
            );
            return;
        }

        createAlertsSection(main);

        createSchedulingSection(main);

        createWarningsSection(main);

        createHistorySection(main);

    }


    /* =========================================================
       ALERTS SECTION
       ========================================================= */

    function createAlertsSection(main) {

        if (
            document.getElementById(
                "government-alerts"
            )
        ) {
            return;
        }

        const section =
            document.createElement("section");

        section.id =
            "government-alerts";

        section.className =
            "section government-section";

        section.innerHTML = `

            <div class="government-page-header">

                <div>

                    <span class="government-eyebrow">
                        INCIDENT MONITORING
                    </span>

                    <h2>
                        Alerts
                    </h2>

                    <p>
                        Monitor active disruptions and
                        verified incident information.
                    </p>

                </div>

            </div>


            <div class="government-filter-bar">

                <select id="governmentSeverityFilter">

                    <option value="All">
                        All Severity
                    </option>

                    <option value="Critical">
                        Critical
                    </option>

                    <option value="High">
                        High
                    </option>

                    <option value="Moderate">
                        Moderate
                    </option>

                    <option value="Low">
                        Low
                    </option>

                </select>


                <select id="governmentStatusFilter">

                    <option value="Active">
                        Active
                    </option>

                    <option value="Resolved">
                        Resolved
                    </option>

                    <option value="All">
                        All Status
                    </option>

                </select>

            </div>


            <div class="government-card">

                <div id="governmentAlertsContainer"></div>

            </div>

        `;

        main.appendChild(section);


        document
            .getElementById(
                "governmentSeverityFilter"
            )
            .addEventListener(
                "change",
                renderGovernmentAlerts
            );


        document
            .getElementById(
                "governmentStatusFilter"
            )
            .addEventListener(
                "change",
                renderGovernmentAlerts
            );

    }


    /* =========================================================
       RENDER ALERTS
       ========================================================= */

    function renderGovernmentAlerts() {

        const container =
            document.getElementById(
                "governmentAlertsContainer"
            );

        if (!container) {
            return;
        }

        const severity =
            document.getElementById(
                "governmentSeverityFilter"
            )?.value || "All";

        const status =
            document.getElementById(
                "governmentStatusFilter"
            )?.value || "Active";

        let alerts =
            getAlerts();

        alerts =
            alerts.filter(function (alert) {

                const severityMatch =
                    severity === "All" ||
                    alert.severity === severity;

                const statusMatch =
                    status === "All" ||
                    alert.status === status;

                return (
                    severityMatch &&
                    statusMatch
                );

            });


        if (!alerts.length) {

            container.innerHTML = `

                <div class="government-empty">

                    <strong>
                        No alerts found
                    </strong>

                    <span>
                        No alerts match the selected filters.
                    </span>

                </div>

            `;

            return;

        }


        container.innerHTML = `

            <div class="government-table-wrapper">

                <table class="government-table">

                    <thead>

                        <tr>

                            <th>Alert ID</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Source</th>
                            <th></th>

                        </tr>

                    </thead>


                    <tbody>

                        ${alerts.map(function (alert) {

                            return `

                                <tr>

                                    <td>
                                        <strong>
                                            ${escapeHTML(alert.id)}
                                        </strong>
                                    </td>

                                    <td>
                                        ${escapeHTML(alert.type)}
                                    </td>

                                    <td>
                                        ${escapeHTML(alert.location)}
                                    </td>

                                    <td>

                                        <span class="
                                            government-severity
                                            severity-${String(
                                                alert.severity
                                            ).toLowerCase()}
                                        ">
                                            ${escapeHTML(
                                                alert.severity
                                            )}
                                        </span>

                                    </td>

                                    <td>
                                        ${escapeHTML(alert.status)}
                                    </td>

                                    <td>
                                        ${escapeHTML(alert.source)}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="government-view-button"
                                            data-alert-id="${escapeAttribute(
                                                alert.id
                                            )}"
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        `;


        container
            .querySelectorAll(
                ".government-view-button"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openAlertDetails(
                            button.dataset.alertId
                        );

                    }
                );

            });

    }


    /* =========================================================
       ALERT DETAILS
       ========================================================= */

    function openAlertDetails(alertId) {

        const alert =
            getAlerts().find(function (item) {

                return item.id === alertId;

            });

        if (!alert) {
            return;
        }


        openModal(`

            <div class="government-modal-header">

                <div>

                    <span class="government-eyebrow">
                        GOVERNMENT ALERT VIEW
                    </span>

                    <h2>
                        ${escapeHTML(alert.type)}
                    </h2>

                </div>

                <button
                    type="button"
                    class="government-close"
                    id="governmentModalClose"
                >
                    ×
                </button>

            </div>


            <div class="government-detail-grid">

                <div>
                    <span>Alert ID</span>
                    <strong>
                        ${escapeHTML(alert.id)}
                    </strong>
                </div>

                <div>
                    <span>Severity</span>
                    <strong>
                        ${escapeHTML(alert.severity)}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>
                        ${escapeHTML(alert.status)}
                    </strong>
                </div>

                <div>
                    <span>Source</span>
                    <strong>
                        ${escapeHTML(alert.source)}
                    </strong>
                </div>

            </div>


            <div class="government-detail">

                <span>
                    Location
                </span>

                <p>
                    ${escapeHTML(alert.location)}
                </p>

            </div>


            <div class="government-detail">

                <span>
                    Affected Route
                </span>

                <p>
                    ${escapeHTML(alert.route)}
                </p>

            </div>


            <div class="government-detail">

                <span>
                    Description
                </span>

                <p>
                    ${escapeHTML(alert.description)}
                </p>

            </div>


            <div class="government-modal-actions">

                <button
                    type="button"
                    class="government-secondary-button"
                    id="governmentHistoryButton"
                >
                    View History
                </button>

                <button
                    type="button"
                    class="government-primary-button"
                    id="governmentModalClose2"
                >
                    Close
                </button>

            </div>

        `);


        document
            .getElementById(
                "governmentModalClose"
            )
            ?.addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "governmentModalClose2"
            )
            ?.addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "governmentHistoryButton"
            )
            ?.addEventListener(
                "click",
                function () {

                    showAlertHistory(
                        alert.id
                    );

                }
            );

    }


    /* =========================================================
       SCHEDULING SECTION
       ========================================================= */

    function createSchedulingSection(main) {

        if (
            document.getElementById(
                "government-scheduling"
            )
        ) {
            return;
        }

        const section =
            document.createElement("section");

        section.id =
            "government-scheduling";

        section.className =
            "section government-section";

        section.innerHTML = `

            <div class="government-page-header">

                <div>

                    <span class="government-eyebrow">
                        MOVEMENT OVERSIGHT
                    </span>

                    <h2>
                        Scheduling Status
                    </h2>

                    <p>
                        Monitor current vehicle movement,
                        priority status and delays.
                    </p>

                </div>

            </div>


            <div class="government-stat-grid">

                <div class="government-stat">

                    <strong id="governmentTotalVehicles">
                        0
                    </strong>

                    <span>
                        Active Movements
                    </span>

                </div>


                <div class="government-stat">

                    <strong id="governmentEmergencyVehicles">
                        0
                    </strong>

                    <span>
                        Emergency
                    </span>

                </div>


                <div class="government-stat">

                    <strong id="governmentDelayedVehicles">
                        0
                    </strong>

                    <span>
                        Delayed
                    </span>

                </div>


                <div class="government-stat">

                    <strong id="governmentCompletedVehicles">
                        0
                    </strong>

                    <span>
                        Completed
                    </span>

                </div>

            </div>


            <div class="government-card">

                <div id="governmentScheduleContainer"></div>

            </div>


            <div class="government-readonly">

                Government access is read-only.
                Emergency overrides and operational
                scheduling changes are handled through
                authorised disaster-response workflows.

            </div>

        `;

        main.appendChild(section);

    }


    /* =========================================================
       RENDER SCHEDULING
       ========================================================= */

    async function renderScheduling() {
    // 1. Fetch live trips from backend, fallback to local storage
    let queue = await ApiService.getTrips();
    if (!queue || queue.length === 0) {
        queue = getQueue();
    }

    const total = document.getElementById("governmentTotalVehicles");
    const emergency = document.getElementById("governmentEmergencyVehicles");
    const delayed = document.getElementById("governmentDelayedVehicles");
    const completed = document.getElementById("governmentCompletedVehicles");

    if (total) total.textContent = queue.length;
    if (emergency) emergency.textContent = queue.filter(item => item.priorityLevel === 1 || item.priority === "Emergency").length;
    if (delayed) delayed.textContent = queue.filter(item => item.status === "Delayed").length;
    if (completed) completed.textContent = queue.filter(item => item.status === "Completed").length;

    const container = document.getElementById("governmentScheduleContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="government-table-wrapper">
            <table class="government-table">
                <thead>
                    <tr><th>Identifier</th><th>Route</th><th>Priority</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${queue.map(item => `
                        <tr>
                            <td><strong>${escapeHTML(item.accountId?.primaryIdentifier || item.vehicle || "Vehicle")}</strong></td>
                            <td>${escapeHTML(item.origin)} →${escapeHTML(item.destination)}</td>
                            <td>${item.priorityLevel === 1 ? "Emergency" : item.priorityLevel === 2 ? "High" : "Normal"}</td>
                            <td>${escapeHTML(item.status)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}


    /* =========================================================
       CHECKPOST MANAGEMENT
       ========================================================= */

    function renderCheckposts() {

        const section =
            document.getElementById(
                "checkposts"
            );

        if (!section) {
            return;
        }


        section.innerHTML = `

            <div class="government-page-header">

                <div>

                    <span class="government-eyebrow">
                        INFRASTRUCTURE MANAGEMENT
                    </span>

                    <h2>
                        Check-post Management
                    </h2>

                    <p>
                        Manage regional check-post infrastructure
                        and operational status.
                    </p>

                </div>


                <button
                    type="button"
                    class="government-primary-button"
                    id="governmentAddCheckpost"
                >
                    + Add Check-post
                </button>

            </div>


            <div class="government-card">

                <div id="governmentCheckpostContainer"></div>

            </div>


            <div class="government-card government-suggestions">

                <h3>
                    DMT Suggestions
                </h3>

                <p>
                    Suggestions from the Disaster Management
                    Team for new or modified check-post
                    requirements will appear here.
                </p>

                <div class="government-empty-small">
                    No pending suggestions.
                </div>

            </div>

        `;


        document
            .getElementById(
                "governmentAddCheckpost"
            )
            ?.addEventListener(
                "click",
                function () {

                    openCheckpostModal();

                }
            );


        renderCheckpostTable();

    }


    function renderCheckpostTable() {

        const container =
            document.getElementById(
                "governmentCheckpostContainer"
            );

        if (!container) {
            return;
        }


        const checkposts =
            getCheckposts();


        container.innerHTML = `

            <div class="government-table-wrapper">

                <table class="government-table">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Vehicles</th>
                            <th>Personnel</th>
                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${checkposts.map(function (checkpost) {

                            return `

                                <tr>

                                    <td>
                                        <strong>
                                            ${escapeHTML(
                                                checkpost.id
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            checkpost.name
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            checkpost.location
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            checkpost.status
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            checkpost.vehicles
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            checkpost.personnel
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="government-view-button"
                                            data-edit-checkpost="${escapeAttribute(
                                                checkpost.id
                                            )}"
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            class="government-danger-button"
                                            data-deactivate-checkpost="${escapeAttribute(
                                                checkpost.id
                                            )}"
                                        >
                                            Deactivate
                                        </button>

                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        `;


        container
            .querySelectorAll(
                "[data-edit-checkpost]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openCheckpostModal(
                            button.dataset.editCheckpost
                        );

                    }
                );

            });


        container
            .querySelectorAll(
                "[data-deactivate-checkpost]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deactivateCheckpost(
                            button.dataset.deactivateCheckpost
                        );

                    }
                );

            });

    }


    /* =========================================================
       CHECKPOST MODAL
       ========================================================= */

    function openCheckpostModal(
        editId = null
    ) {

        const checkposts =
            getCheckposts();


        const existing =
            editId
                ? checkposts.find(function (item) {

                    return item.id === editId;

                })
                : null;


        const editing =
            Boolean(existing);


        openModal(`

            <div class="government-modal-header">

                <div>

                    <span class="government-eyebrow">
                        CHECK-POST MANAGEMENT
                    </span>

                    <h2>
                        ${
                            editing
                                ? "Edit Check-post"
                                : "Add Check-post"
                        }
                    </h2>

                </div>


                <button
                    type="button"
                    class="government-close"
                    id="governmentModalClose"
                >
                    ×
                </button>

            </div>


            <form id="governmentCheckpostForm">

                <div class="government-form-grid">

                    <div>

                        <label>
                            Check-post Name
                        </label>

                        <input
                            id="governmentCPName"
                            type="text"
                            required
                            value="${
                                editing
                                    ? escapeAttribute(
                                        existing.name
                                    )
                                    : ""
                            }"
                        >

                    </div>


                    <div>

                        <label>
                            Location
                        </label>

                        <input
                            id="governmentCPLocation"
                            type="text"
                            required
                            value="${
                                editing
                                    ? escapeAttribute(
                                        existing.location
                                    )
                                    : ""
                            }"
                        >

                    </div>


                    <div>

                        <label>
                            Status
                        </label>

                        <select id="governmentCPStatus">

                            <option
                                value="Operational"
                                ${
                                    editing &&
                                    existing.status ===
                                    "Operational"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Operational
                            </option>

                            <option
                                value="Alert"
                                ${
                                    editing &&
                                    existing.status ===
                                    "Alert"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Alert
                            </option>

                            <option
                                value="Inactive"
                                ${
                                    editing &&
                                    existing.status ===
                                    "Inactive"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Inactive
                            </option>

                        </select>

                    </div>


                    <div>

                        <label>
                            Vehicle Capacity
                        </label>

                        <input
                            id="governmentCPVehicles"
                            type="number"
                            min="0"
                            value="${
                                editing
                                    ? existing.vehicles
                                    : 0
                            }"
                        >

                    </div>


                    <div>

                        <label>
                            Personnel
                        </label>

                        <input
                            id="governmentCPPersonnel"
                            type="number"
                            min="0"
                            value="${
                                editing
                                    ? existing.personnel
                                    : 0
                            }"
                        >

                    </div>

                </div>


                <div class="government-modal-actions">

                    <button
                        type="button"
                        class="government-secondary-button"
                        id="governmentModalCancel"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        class="government-primary-button"
                    >
                        ${
                            editing
                                ? "Save Changes"
                                : "Add Check-post"
                        }
                    </button>

                </div>

            </form>

        `);


        document
            .getElementById(
                "governmentModalClose"
            )
            ?.addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "governmentModalCancel"
            )
            ?.addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "governmentCheckpostForm"
            )
            ?.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const name =
                        document
                            .getElementById(
                                "governmentCPName"
                            )
                            .value
                            .trim();


                    const location =
                        document
                            .getElementById(
                                "governmentCPLocation"
                            )
                            .value
                            .trim();


                    const status =
                        document
                            .getElementById(
                                "governmentCPStatus"
                            )
                            .value;


                    const vehicles =
                        Number(
                            document
                                .getElementById(
                                    "governmentCPVehicles"
                                )
                                .value
                        );


                    const personnel =
                        Number(
                            document
                                .getElementById(
                                    "governmentCPPersonnel"
                                )
                                .value
                        );


                    if (!name || !location) {

                        alert(
                            "Please enter the check-post name and location."
                        );

                        return;

                    }


                    if (editing) {

                        existing.name =
                            name;

                        existing.location =
                            location;

                        existing.status =
                            status;

                        existing.vehicles =
                            vehicles;

                        existing.personnel =
                            personnel;

                    } else {

                        checkposts.push({

                            id:
                                "CP-" +
                                String(
                                    checkposts.length + 1
                                ).padStart(2, "0"),

                            name:
                                name,

                            location:
                                location,

                            status:
                                status,

                            vehicles:
                                vehicles,

                            personnel:
                                personnel

                        });

                    }


                    saveCheckposts(
                        checkposts
                    );


                    addHistory(
                        editing
                            ? "Check-post updated"
                            : "Check-post created",
                        name,
                        "Government"
                    );


                    closeModal();

                    renderCheckposts();

                }
            );

    }


    /* =========================================================
       DEACTIVATE CHECKPOST
       ========================================================= */

    function deactivateCheckpost(id) {

        const checkposts =
            getCheckposts();


        const checkpost =
            checkposts.find(function (item) {

                return item.id === id;

            });


        if (!checkpost) {
            return;
        }


        const confirmed =
            confirm(
                "Deactivate " +
                checkpost.name +
                "?"
            );


        if (!confirmed) {
            return;
        }


        checkpost.status =
            "Inactive";


        saveCheckposts(
            checkposts
        );


        addHistory(
            "Check-post deactivated",
            checkpost.name +
                " was marked inactive.",
            "Government"
        );


        renderCheckposts();

    }


    /* =========================================================
       TRAVEL WARNINGS
       ========================================================= */

    function createWarningsSection(main) {

        if (
            document.getElementById(
                "government-warnings"
            )
        ) {
            return;
        }


        const section =
            document.createElement("section");

        section.id =
            "government-warnings";

        section.className =
            "section government-section";

        section.innerHTML = `

            <div class="government-page-header">

                <div>

                    <span class="government-eyebrow">
                        MOVEMENT SAFETY
                    </span>

                    <h2>
                        Travel Warnings
                    </h2>

                    <p>
                        Warnings derived from currently
                        active regional alerts.
                    </p>

                </div>

            </div>


            <div id="governmentWarningsContainer"></div>

        `;

        main.appendChild(section);

    }


    function renderWarnings() {

        const container =
            document.getElementById(
                "governmentWarningsContainer"
            );

        if (!container) {
            return;
        }


        const activeAlerts =
            getAlerts().filter(function (alert) {

                return alert.status === "Active";

            });


        if (!activeAlerts.length) {

            container.innerHTML = `

                <div class="government-card">

                    <div class="government-empty">

                        <strong>
                            No active travel warnings
                        </strong>

                        <span>
                            No current active alerts are
                            generating movement warnings.
                        </span>

                    </div>

                </div>

            `;

            return;

        }


        container.innerHTML = `

            <div class="government-warning-grid">

                ${activeAlerts.map(function (alert) {

                    return `

                        <div class="government-warning-card">

                            <div class="government-warning-icon">
                                ⚠
                            </div>


                            <div>

                                <span class="government-warning-severity">
                                    ${escapeHTML(
                                        alert.severity
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        alert.type
                                    )}
                                </h3>

                                <p>
                                    <strong>
                                        Location:
                                    </strong>
                                    ${escapeHTML(
                                        alert.location
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Route:
                                    </strong>
                                    ${escapeHTML(
                                        alert.route
                                    )}
                                </p>

                                <p>
                                    ${escapeHTML(
                                        alert.description
                                    )}
                                </p>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }


    /* =========================================================
       HISTORY
       ========================================================= */

    function createHistorySection(main) {

        if (
            document.getElementById(
                "government-history"
            )
        ) {
            return;
        }


        const section =
            document.createElement("section");

        section.id =
            "government-history";

        section.className =
            "section government-section";

        section.innerHTML = `

            <div class="government-page-header">

                <div>

                    <span class="government-eyebrow">
                        AUDIT & RECORDS
                    </span>

                    <h2>
                        History
                    </h2>

                    <p>
                        Read-only operational history.
                    </p>

                </div>

            </div>


            <div class="government-card">

                <div id="governmentHistoryContainer"></div>

            </div>

        `;

        main.appendChild(section);

    }


    function renderHistory() {

        const container =
            document.getElementById(
                "governmentHistoryContainer"
            );

        if (!container) {
            return;
        }


        const history =
            getHistory();


        if (!history.length) {

            container.innerHTML = `

                <div class="government-empty">

                    <strong>
                        No history available
                    </strong>

                    <span>
                        Operational changes will appear here.
                    </span>

                </div>

            `;

            return;

        }


        container.innerHTML = `

            <div class="government-history-list">

                ${history.map(function (item) {

                    return `

                        <div class="government-history-item">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        item.action
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        item.timestamp
                                    )}
                                </span>

                            </div>

                            <p>
                                ${escapeHTML(
                                    item.description
                                )}
                            </p>

                            <small>
                                Updated by:
                                ${escapeHTML(
                                    item.updatedBy
                                )}
                            </small>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }


    function addHistory(
        action,
        description,
        updatedBy
    ) {

        const history =
            getHistory();


        history.unshift({

            action:
                action,

            description:
                description,

            updatedBy:
                updatedBy,

            timestamp:
                new Date().toLocaleString()

        });


        saveHistory(
            history
        );


        renderHistory();

    }


    /* =========================================================
       ALERT HISTORY
       ========================================================= */

    function showAlertHistory(alertId) {

        const history =
            getHistory().filter(function (item) {

                return item.alertId === alertId;

            });


        if (!history.length) {

            openModal(`

                <div class="government-modal-header">

                    <h2>
                        Alert History
                    </h2>

                    <button
                        type="button"
                        class="government-close"
                        id="governmentModalClose"
                    >
                        ×
                    </button>

                </div>


                <div class="government-empty">

                    No historical updates available
                    for this alert.

                </div>

            `);


            document
                .getElementById(
                    "governmentModalClose"
                )
                ?.addEventListener(
                    "click",
                    closeModal
                );

            return;

        }


        openModal(`

            <div class="government-modal-header">

                <div>

                    <span class="government-eyebrow">
                        ALERT HISTORY
                    </span>

                    <h2>
                        ${escapeHTML(alertId)}
                    </h2>

                </div>


                <button
                    type="button"
                    class="government-close"
                    id="governmentModalClose"
                >
                    ×
                </button>

            </div>


            <div class="government-history-list">

                ${history.map(function (item) {

                    return `

                        <div class="government-history-item">

                            <strong>
                                ${escapeHTML(
                                    item.action
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    item.timestamp
                                )}
                            </span>

                            <p>
                                ${escapeHTML(
                                    item.description
                                )}
                            </p>

                            <small>
                                ${escapeHTML(
                                    item.updatedBy
                                )}
                            </small>

                        </div>

                    `;

                }).join("")}

            </div>

        `);


        document
            .getElementById(
                "governmentModalClose"
            )
            ?.addEventListener(
                "click",
                closeModal
            );

    }


    /* =========================================================
       SIDEBAR
       ========================================================= */

    function modifyExistingSidebar() {

        const sidebar = document.querySelector(".sidebar");
        if (!sidebar) return;

        /* Hide Cargo. */
        const cargo = sidebar.querySelector('[data-section="cargo"]');
        if (cargo) cargo.style.display = "none";

        /* Hide normal Priority Schedule. */
        const schedule = sidebar.querySelector('[data-section="schedule"]');
        if (schedule) schedule.style.display = "none";

        /* Rename existing Check-post. */
        const checkposts = sidebar.querySelector('[data-section="checkposts"]');
        if (checkposts) {
            checkposts.innerHTML = "<span>🛡</span> <span>Check-post Management</span>";
        }

        /* Keep original weather section. */
        const weather = sidebar.querySelector('[data-section="weather"]');
        if (weather) {
            weather.innerHTML = "<span>🌧</span> <span>Weather & Field Deployment</span>";
        }

        const nav = sidebar.querySelector("nav");
        if (!nav) return;

        /* Add ONLY Government-specific buttons. */
        addGovernmentNav(nav, "🚨 Alerts", "government-alerts");
        addGovernmentNav(nav, "📋 Scheduling Status", "government-scheduling");
        addGovernmentNav(nav, "⚠ Travel Warnings", "government-warnings");
        addGovernmentNav(nav, "🕘 History", "government-history");

    }


    function addGovernmentNav(nav, text, sectionId) {

        if (nav.querySelector(`.government-nav-item[data-section="${sectionId}"]`)) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "nav-item government-nav-item";
        button.dataset.section = sectionId;

        // Ensure text is wrapped in a span for the sidebar collapse CSS
        const firstSpace = text.indexOf(" ");
        const icon = text.substring(0, firstSpace);
        const label = text.substring(firstSpace + 1);

        button.innerHTML = `<span>${icon}</span> <span>${label}</span>`;

        nav.appendChild(button);

    }


    /* =========================================================
       GOVERNMENT NAVIGATION
       ========================================================= */

    function setupGovernmentNavigation() {

    document.addEventListener(
        "click",
        function (event) {

            const governmentButton =
                event.target.closest(".government-nav-item");

            // Not a Government-created navigation button
            if (!governmentButton) {
                return;
            }

            const sectionId =
                governmentButton.dataset.section;

            if (!sectionId) {
                return;
            }

            const targetSection =
                document.getElementById(sectionId);

            if (!targetSection) {
                console.warn(
                    "[Government] Section not found:",
                    sectionId
                );
                return;
            }

            event.preventDefault();

            /*
             * ---------------------------------------------------------
             * HIDE EVERYTHING FIRST
             * ---------------------------------------------------------
             */

            // Hide all normal sections
            document
                .querySelectorAll(".section")
                .forEach(function (section) {

                    section.classList.remove("active");

                    section.style.display = "none";

                });


            // Hide all Government sections
            document
                .querySelectorAll(".government-section")
                .forEach(function (section) {

                    section.classList.remove("active");

                    section.style.display = "none";

                });


            /*
             * ---------------------------------------------------------
             * SHOW ONLY THE SELECTED SECTION
             * ---------------------------------------------------------
             */

            targetSection.classList.add("active");

            targetSection.style.display = "block";


            /*
             * ---------------------------------------------------------
             * UPDATE GOVERNMENT NAVIGATION
             * ---------------------------------------------------------
             */

            document
                .querySelectorAll(".government-nav-item")
                .forEach(function (button) {

                    button.classList.remove("active");

                });

            governmentButton.classList.add("active");


            /*
             * ---------------------------------------------------------
             * MAP FIX
             * ---------------------------------------------------------
             */

            if (
                sectionId === "map-section" &&
                typeof transportMap !== "undefined" &&
                transportMap
            ) {

                setTimeout(function () {

                    transportMap.invalidateSize(true);

                }, 150);

            }


            /*
             * ---------------------------------------------------------
             * NORMAL GOVERNMENT SECTION REFRESH
             * ---------------------------------------------------------
             */

            if (sectionId === "government-alerts") {

                if (
                    typeof renderGovernmentAlerts ===
                    "function"
                ) {
                    renderGovernmentAlerts();
                }

            }


            if (sectionId === "government-scheduling") {

                if (
                    typeof renderScheduling ===
                    "function"
                ) {
                    renderScheduling();
                }

            }


            if (sectionId === "checkposts") {

                if (
                    typeof renderCheckposts ===
                    "function"
                ) {
                    renderCheckposts();
                }

            }


            if (sectionId === "government-warnings") {

                if (
                    typeof renderWarnings ===
                    "function"
                ) {
                    renderWarnings();
                }

            }


            if (sectionId === "government-history") {

                if (
                    typeof renderHistory ===
                    "function"
                ) {
                    renderHistory();
                }

            }

        },
        false
    );
}


    /* =========================================================
       DASHBOARD
       ========================================================= */

    function modifyDashboard() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (!dashboard) {
            return;
        }


        const quickActions =
            dashboard.querySelector(
                ".quick-actions"
            );


        if (quickActions) {

            quickActions.innerHTML = `
                <!-- Original Row -->
                <button type="button" class="quick-action government-quick-action" data-government-action="checkpost"><span>🛡</span><small>Add Check-post</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="alerts"><span>🚨</span><small>View Alerts</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="schedule"><span>📋</span><small>Scheduling Status</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="warnings"><span>⚠</span><small>Travel Warnings</small></button>
                
                <!-- New Second Row -->
                <button type="button" class="quick-action government-quick-action" data-government-action="record"><span>📝</span><small>Add Record</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="sos"><span>🆘</span><small>Override</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="map"><span>📍</span><small>Live Map</small></button>
                <button type="button" class="quick-action government-quick-action" data-government-action="history"><span>🕘</span><small>History</small></button>
            `;

            quickActions.addEventListener("click", function (event) {
                const button = event.target.closest(".government-quick-action");
                if (!button) return;

                const action = button.dataset.governmentAction;

                if (action === "checkpost") openCheckpostModal();
                if (action === "alerts") openGovernmentSection("government-alerts");
                if (action === "schedule") openGovernmentSection("government-scheduling");
                if (action === "warnings") openGovernmentSection("government-warnings");
                
                // New Action Handlers
                if (action === "record") {
                    const recordModal = document.getElementById("recordModal");
                    if (recordModal) recordModal.classList.add("show");
                }
                if (action === "sos") {
                    if (typeof requestEmergencyOverride === "function") requestEmergencyOverride();
                }
                if (action === "map") {
                    const mapBtn = document.querySelector('.government-nav-item[data-section="map-section"]');
                    if (mapBtn) mapBtn.click();
                }
                if (action === "history") openGovernmentSection("government-history");
            });
        }


        /*
        Existing View Queue button.

        Government can VIEW the queue.
        */

        const queueButton =
            document.getElementById(
                "viewQueueButton"
            );


        if (queueButton) {

            queueButton.onclick =
                function (event) {

                    event.preventDefault();

                    event.stopImmediatePropagation();

                    openGovernmentSection(
                        "government-scheduling"
                    );

                };

        }

    }


    /* =========================================================
       DASHBOARD ALERT LINKS
       ========================================================= */

    function setupDashboardLinks() {

        const viewAll =
            document.getElementById(
                "viewAllAlerts"
            );


        if (viewAll) {

            viewAll.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openGovernmentSection(
                        "government-alerts"
                    );

                }
            );

        }


        const recentAlerts =
            document.querySelector(
                ".recent-alerts-list"
            );


        if (recentAlerts) {

            recentAlerts.style.cursor =
                "pointer";


            recentAlerts.addEventListener(
                "click",
                function () {

                    openGovernmentSection(
                        "government-alerts"
                    );

                }
            );

        }

    }


    /* =========================================================
       OPEN GOVERNMENT SECTION
       ========================================================= */

    function openGovernmentSection(
        sectionId
    ) {

        const button =
            document.querySelector(
                `.government-nav-item[data-section="${sectionId}"]`
            );


        if (button) {

            /*
            Calling click() triggers ONLY the
            Government navigation handler.

            Existing app.js navigation remains untouched.
            */

            button.click();

            return;

        }


        /*
        Fallback.
        */

        const section =
            document.getElementById(
                sectionId
            );


        if (!section) {
            return;
        }


        document
            .querySelectorAll(
                ".section"
            )
            .forEach(function (item) {

                item.classList.remove(
                    "active"
                );

            });


        section.classList.add(
            "active"
        );

    }


    /* =========================================================
       MODAL
       ========================================================= */

    function createGovernmentModal() {

        if (
            document.getElementById(
                "governmentModal"
            )
        ) {
            return;
        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "governmentModal";


        modal.className =
            "government-modal";


        modal.innerHTML = `

            <div
                class="government-modal-content"
                id="governmentModalContent"
            >
            </div>

        `;


        document.body.appendChild(
            modal
        );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal();

                }

            }
        );

    }


    function openModal(content) {

        const modal =
            document.getElementById(
                "governmentModal"
            );


        const contentContainer =
            document.getElementById(
                "governmentModalContent"
            );


        if (
            !modal ||
            !contentContainer
        ) {
            return;
        }


        contentContainer.innerHTML =
            content;


        modal.classList.add(
            "show"
        );

    }


    function closeModal() {

        const modal =
            document.getElementById(
                "governmentModal"
            );


        if (modal) {

            modal.classList.remove(
                "show"
            );

        }

    }


    /* =========================================================
       ESCAPE HTML
       ========================================================= */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(value) {

        return escapeHTML(
            value
        );

    }


})();
/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   ALERTS.JS
   Transport Alerts + SOS Alerts + Route Warnings
   ========================================================= */

"use strict";


/* =========================================================
   DEFAULT NORTHEAST TRANSPORT ALERTS
   ========================================================= */

const DEFAULT_TRANSPORT_ALERTS = [

    {
        id: "ALT-NE-001",
        type: "Road Condition",
        severity: "Warning",
        title: "Road condition warning",
        route: "Shillong → Cherrapunji",
        location: "Cherrapunji, Meghalaya",
        description:
            "Heavy rainfall may affect road conditions along the Shillong–Cherrapunji route.",
        region: "Meghalaya",
        affectedUsers: "Traveller & Cargo",
        active: true,
        source: "Transport Monitoring System",
        timestamp: new Date().toISOString()
    },

    {
        id: "ALT-NE-002",
        type: "Traffic",
        severity: "Moderate",
        title: "Traffic congestion detected",
        route: "Dimapur → Kohima",
        location: "Dimapur–Kohima corridor, Nagaland",
        description:
            "Traffic movement is slower than normal on the Dimapur–Kohima corridor.",
        region: "Nagaland",
        affectedUsers: "Traveller & Cargo",
        active: true,
        source: "Transport Monitoring System",
        timestamp: new Date().toISOString()
    },

    {
        id: "ALT-NE-003",
        type: "Weather",
        severity: "Warning",
        title: "Weather advisory",
        route: "Guwahati → Dibrugarh",
        location: "Upper Assam",
        description:
            "Weather conditions may cause travel delays. Check live conditions before departure.",
        region: "Assam",
        affectedUsers: "Traveller & Cargo",
        active: true,
        source: "Weather Monitoring",
        timestamp: new Date().toISOString()
    },

    {
        id: "ALT-NE-004",
        type: "Road Blockage",
        severity: "Critical",
        title: "Road blockage reported",
        route: "Imphal → Kohima",
        location: "Manipur–Nagaland corridor",
        description:
            "A road blockage has been reported. Alternative routing should be considered.",
        region: "Manipur / Nagaland",
        affectedUsers: "Traveller & Cargo",
        active: true,
        source: "Transport Monitoring System",
        timestamp: new Date().toISOString()
    }

];


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeAlerts();

    }
);


/* =========================================================
   INITIALIZE ALERT SYSTEM
   ========================================================= */

function initializeAlerts() {

    initializeDefaultAlerts();

    renderAlerts();

    updateAlertStats(
        getAllAlerts()
    );

    updateAlertBadges();

}


/* =========================================================
   INITIALIZE DEFAULT ALERTS
   ========================================================= */

function initializeDefaultAlerts() {

    try {

        const existing =
            localStorage.getItem(
                "smartTransportAlerts"
            );


        if (!existing) {

            localStorage.setItem(
                "smartTransportAlerts",
                JSON.stringify(
                    DEFAULT_TRANSPORT_ALERTS
                )
            );

        }

    } catch (error) {

        console.warn(
            "Unable to initialize transport alerts:",
            error
        );

    }

}


/* =========================================================
   GET TRANSPORT ALERTS
   ========================================================= */

function getTransportAlerts() {

    try {

        const stored =
            localStorage.getItem(
                "smartTransportAlerts"
            );


        if (!stored) {

            return [
                ...DEFAULT_TRANSPORT_ALERTS
            ];

        }


        const alerts =
            JSON.parse(stored);


        return Array.isArray(alerts)
            ? alerts
            : [];

    } catch (error) {

        console.warn(
            "Unable to read transport alerts:",
            error
        );

        return [];

    }

}


/* =========================================================
   GET SOS REPORTS
   ========================================================= */

function getSOSReports() {

    try {

        const stored =
            localStorage.getItem(
                "sosReports"
            );


        if (!stored) {
            return [];
        }


        const reports =
            JSON.parse(stored);


        return Array.isArray(reports)
            ? reports
            : [];

    } catch (error) {

        console.warn(
            "Unable to read SOS reports:",
            error
        );

        return [];

    }

}


/* =========================================================
   CONVERT SOS REPORT INTO ALERT
   ========================================================= */

function convertSOSReportToAlert(report) {

    return {

        id:
            report.id ||
            `SOS-${Date.now()}`,

        type:
            report.type ||
            report.incidentType ||
            "Emergency",

        severity:
            report.severity ||
            "Critical",

        title:
            "Emergency SOS Report",

        route:
            report.route ||
            "Emergency Location",

        location:
            report.location ||
            "Location unavailable",

        description:
            report.description ||
            "Emergency assistance has been requested.",

        region:
            report.region ||
            "Northeast India",

        affectedUsers:
            "Emergency Response",

        active:
            String(report.status || "")
                .toLowerCase() === "active",

        status:
            report.status ||
            "active",

        source:
            "SOS Emergency System",

        timestamp:
            report.timestamp ||
            report.createdAt ||
            new Date().toISOString(),

        isSOS:
            true,

        photoData:
            report.photoData ||
            null,

        photoAttached:
            report.photoAttached ||
            false

    };

}


/* =========================================================
   GET ALL ALERTS
   ========================================================= */

function getAllAlerts() {

    const transportAlerts =
        getTransportAlerts();


    const sosAlerts =
        getSOSReports()
            .map(
                convertSOSReportToAlert
            );


    /*
       SOS alerts are placed first because
       they are emergency/P1 events.
    */

    return [
        ...sosAlerts,
        ...transportAlerts
    ];

}


/* =========================================================
   RENDER ALERTS
   ========================================================= */

function renderAlerts() {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (!container) {
        return;
    }


    const alerts =
        getAllAlerts();


    updateAlertStats(alerts);


    if (alerts.length === 0) {

        renderEmptyAlerts(
            container
        );

        return;

    }


    container.innerHTML =
        alerts
            .map(
                createAlertHTML
            )
            .join("");


    updateAlertBadges();

}


/* =========================================================
   CREATE ALERT HTML
   ========================================================= */

function createAlertHTML(alert) {

    const severity =
        normalizeSeverity(
            alert.severity
        );


    const icon =
        getAlertIcon(
            alert.type
        );


    const status =
        alert.isSOS
            ? normalizeStatus(
                alert.status
            )
            : (
                alert.active === false
                    ? "Resolved"
                    : "Active"
            );


    const photo =
        alert.photoData
            ? `
                <div class="alert-photo">

                    <img
                        src="${escapeHTML(
                            alert.photoData
                        )}"
                        alt="Emergency evidence"
                    >

                </div>
            `
            : "";


    return `

        <article
            class="
                alert-item
                alert-${severity.toLowerCase()}
                ${alert.isSOS ? "alert-emergency" : ""}
            "
            data-alert-id="${escapeHTML(
                alert.id
            )}"
            data-severity="${escapeHTML(
                severity
            )}"
            data-type="${escapeHTML(
                alert.type
            )}"
        >

            <div class="alert-icon">

                <i class="${icon}"></i>

            </div>


            <div class="alert-content">

                <div class="alert-top">

                    <div>

                        <strong>
                            ${escapeHTML(
                                alert.title ||
                                alert.type ||
                                "Transport Alert"
                            )}
                        </strong>

                        <span class="alert-type">
                            ${escapeHTML(
                                alert.type ||
                                "Alert"
                            )}
                        </span>

                    </div>


                    <span
                        class="
                            alert-status
                            alert-status-${severity.toLowerCase()}
                        "
                    >
                        ${escapeHTML(
                            status
                        )}
                    </span>

                </div>


                <div class="alert-location">

                    <i class="fa-solid fa-location-dot"></i>

                    <span>
                        ${escapeHTML(
                            alert.location ||
                            "Location unavailable"
                        )}
                    </span>

                </div>


                ${
                    alert.route
                        ? `
                            <div class="alert-route">

                                <i class="fa-solid fa-route"></i>

                                <span>
                                    ${escapeHTML(
                                        alert.route
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }


                <p>
                    ${escapeHTML(
                        alert.description ||
                        "No additional information available."
                    )}
                </p>


                ${photo}


                <div class="alert-meta">

                    <span>

                        <i class="fa-solid fa-signal"></i>

                        ${escapeHTML(
                            severity
                        )}

                    </span>


                    <span>

                        <i class="fa-solid fa-users"></i>

                        ${escapeHTML(
                            alert.affectedUsers ||
                            "Transport Network"
                        )}

                    </span>


                    <span>

                        <i class="fa-solid fa-clock"></i>

                        ${formatAlertTime(
                            alert.timestamp
                        )}

                    </span>


                    ${
                        alert.id
                            ? `
                                <span>

                                    <i class="fa-solid fa-hashtag"></i>

                                    ${escapeHTML(
                                        alert.id
                                    )}

                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="alert-actions">

                    ${
                        alert.route
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    onclick="openAlertRoute('${escapeJS(
                                        alert.route
                                    )}')"
                                >

                                    <i class="fa-solid fa-map"></i>

                                    View Route

                                </button>
                            `
                            : ""
                    }


                    ${
                        alert.isSOS
                            ? `
                                <span class="alert-emergency-label">

                                    <i class="fa-solid fa-triangle-exclamation"></i>

                                    P1 Emergency

                                </span>
                            `
                            : ""
                    }

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   EMPTY ALERT STATE
   ========================================================= */

function renderEmptyAlerts(container) {

    container.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-shield-halved"></i>

            <strong>
                No active transport alerts
            </strong>

            <span>
                The Northeast transport network currently has no
                registered alerts.
            </span>

        </div>

    `;

}


/* =========================================================
   ALERT ICON
   ========================================================= */

function getAlertIcon(type) {

    const normalized =
        String(type || "")
            .toLowerCase();


    if (
        normalized.includes("landslide")
    ) {

        return "fa-solid fa-mountain";

    }


    if (
        normalized.includes("flood")
    ) {

        return "fa-solid fa-water";

    }


    if (
        normalized.includes("block")
    ) {

        return "fa-solid fa-road-barrier";

    }


    if (
        normalized.includes("accident")
    ) {

        return "fa-solid fa-car-burst";

    }


    if (
        normalized.includes("damaged") ||
        normalized.includes("road")
    ) {

        return "fa-solid fa-road";

    }


    if (
        normalized.includes("traffic")
    ) {

        return "fa-solid fa-car";

    }


    if (
        normalized.includes("weather")
    ) {

        return "fa-solid fa-cloud-rain";

    }


    if (
        normalized.includes("emergency") ||
        normalized.includes("sos")
    ) {

        return "fa-solid fa-triangle-exclamation";

    }


    if (
        normalized.includes("maintenance")
    ) {

        return "fa-solid fa-screwdriver-wrench";

    }


    return "fa-solid fa-circle-exclamation";

}


/* =========================================================
   NORMALIZE SEVERITY
   ========================================================= */

function normalizeSeverity(severity) {

    const value =
        String(
            severity || "Warning"
        ).toLowerCase();


    if (
        value.includes("critical") ||
        value.includes("emergency")
    ) {

        return "Critical";

    }


    if (
        value.includes("high")
    ) {

        return "High";

    }


    if (
        value.includes("moderate")
    ) {

        return "Moderate";

    }


    if (
        value.includes("safe") ||
        value.includes("low")
    ) {

        return "Low";

    }


    return "Warning";

}


/* =========================================================
   NORMALIZE STATUS
   ========================================================= */

function normalizeStatus(status) {

    const value =
        String(
            status || "active"
        ).toLowerCase();


    if (value === "resolved") {
        return "Resolved";
    }


    if (value === "closed") {
        return "Closed";
    }


    if (value === "inactive") {
        return "Inactive";
    }


    return "Active";

}


/* =========================================================
   ALERT STATISTICS
   ========================================================= */

function updateAlertStats(alerts) {

    if (!Array.isArray(alerts)) {
        alerts = [];
    }


    const active =
        alerts.filter(function (alert) {

            return (
                alert.active !== false &&
                normalizeStatus(
                    alert.status
                ) === "Active"
            );

        }).length;


    const critical =
        alerts.filter(function (alert) {

            return (
                normalizeSeverity(
                    alert.severity
                ) === "Critical"
            );

        }).length;


    const landslides =
        alerts.filter(function (alert) {

            return String(
                alert.type || ""
            ).toLowerCase()
                .includes("landslide");

        }).length;


    const floods =
        alerts.filter(function (alert) {

            return String(
                alert.type || ""
            ).toLowerCase()
                .includes("flood");

        }).length;


    const roadAlerts =
        alerts.filter(function (alert) {

            const type =
                String(
                    alert.type || ""
                ).toLowerCase();

            return (
                type.includes("road") ||
                type.includes("blockage")
            );

        }).length;


    const total =
        alerts.length;


    setAlertStat(
        "activeAlerts",
        active
    );

    setAlertStat(
        "criticalAlerts",
        critical
    );

    setAlertStat(
        "landslideAlerts",
        landslides
    );

    setAlertStat(
        "floodAlerts",
        floods
    );

    setAlertStat(
        "roadAlerts",
        roadAlerts
    );

    setAlertStat(
        "totalAlerts",
        total
    );

}


/* =========================================================
   SET STAT VALUE
   ========================================================= */

function setAlertStat(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   UPDATE ALERT BADGES
   ========================================================= */

function updateAlertBadges() {

    const alerts =
        getAllAlerts();


    const activeCount =
        alerts.filter(function (alert) {

            return (
                alert.active !== false &&
                normalizeStatus(
                    alert.status
                ) === "Active"
            );

        }).length;


    const badges =
        document.querySelectorAll(
            "[data-alert-count], .alert-count"
        );


    badges.forEach(function (badge) {

        badge.textContent =
            activeCount;


        if (activeCount > 0) {

            badge.style.display =
                "inline-flex";

        } else {

            badge.style.display =
                "none";

        }

    });

}


/* =========================================================
   FILTER ALERTS
   ========================================================= */

function filterAlerts(
    type = "all",
    severity = "all",
    status = "all"
) {

    const items =
        document.querySelectorAll(
            ".alert-item"
        );


    items.forEach(function (item) {

        const itemType =
            String(
                item.dataset.type || ""
            ).toLowerCase();


        const itemSeverity =
            String(
                item.dataset.severity || ""
            ).toLowerCase();


        const itemStatus =
            item.querySelector(
                ".alert-status"
            );


        const currentStatus =
            itemStatus
                ? itemStatus.textContent
                    .trim()
                    .toLowerCase()
                : "active";


        const typeMatch =
            type === "all" ||
            itemType ===
                String(type).toLowerCase();


        const severityMatch =
            severity === "all" ||
            itemSeverity ===
                String(severity).toLowerCase();


        const statusMatch =
            status === "all" ||
            currentStatus ===
                String(status).toLowerCase();


        item.style.display =
            typeMatch &&
            severityMatch &&
            statusMatch
                ? ""
                : "none";

    });

}


/* =========================================================
   SEARCH ALERTS
   ========================================================= */

function searchAlerts(query) {

    const search =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();


    const items =
        document.querySelectorAll(
            ".alert-item"
        );


    items.forEach(function (item) {

        const text =
            item.textContent
                .toLowerCase();


        item.style.display =
            !search ||
            text.includes(search)
                ? ""
                : "none";

    });

}


/* =========================================================
   OPEN ALERT ROUTE
   ========================================================= */

function openAlertRoute(route) {

    if (!route) {
        return;
    }


    localStorage.setItem(
        "selectedRoute",
        route
    );


    /*
       If live-map.html exists,
       use it as the route destination.
    */

    window.location.href =
        "live-map.html";

}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatAlertTime(timestamp) {

    if (!timestamp) {
        return "Time unavailable";
    }


    const date =
        new Date(timestamp);


    if (Number.isNaN(
        date.getTime()
    )) {

        return String(timestamp);

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   ADD TRANSPORT ALERT
   ========================================================= */

function addTransportAlert(alertData) {

    if (!alertData) {
        return null;
    }


    const alert = {

        id:
            alertData.id ||
            `ALT-${Date.now()}`,

        type:
            alertData.type ||
            "Transport",

        severity:
            normalizeSeverity(
                alertData.severity
            ),

        title:
            alertData.title ||
            "Transport Alert",

        route:
            alertData.route ||
            "",

        location:
            alertData.location ||
            "Northeast India",

        description:
            alertData.description ||
            "Transport alert received.",

        region:
            alertData.region ||
            "Northeast India",

        affectedUsers:
            alertData.affectedUsers ||
            "Traveller & Cargo",

        active:
            alertData.active !== false,

        source:
            alertData.source ||
            "Transport Monitoring System",

        timestamp:
            alertData.timestamp ||
            new Date().toISOString()

    };


    const alerts =
        getTransportAlerts();


    alerts.unshift(alert);


    localStorage.setItem(
        "smartTransportAlerts",
        JSON.stringify(alerts)
    );


    renderAlerts();


    return alert;

}


/* =========================================================
   RESOLVE TRANSPORT ALERT
   ========================================================= */

function resolveTransportAlert(
    alertId
) {

    const alerts =
        getTransportAlerts();


    const updated =
        alerts.map(function (alert) {

            if (alert.id === alertId) {

                return {

                    ...alert,

                    active: false,

                    status: "resolved",

                    resolvedAt:
                        new Date()
                            .toISOString()

                };

            }


            return alert;

        });


    localStorage.setItem(
        "smartTransportAlerts",
        JSON.stringify(updated)
    );


    renderAlerts();

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
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


/* =========================================================
   JAVASCRIPT STRING ESCAPING
   ========================================================= */

function escapeJS(value) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /\r/g,
            "\\r"
        );

}


/* =========================================================
   EMERGENCY REPORT EVENT
   ========================================================= */

document.addEventListener(
    "smartTransportEmergencyCreated",
    function () {

        /*
           Refresh alerts immediately after
           an SOS report is submitted.
        */

        renderAlerts();

        updateAlertBadges();

    }
);


/* =========================================================
   STORAGE EVENT
   ========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "sosReports" ||
            event.key === "smartTransportAlerts"
        ) {

            renderAlerts();

            updateAlertBadges();

        }

    }
);


/* =========================================================
   PUBLIC ALERT API
   ========================================================= */

window.smartTransportAlerts = {

    getAll:
        getAllAlerts,

    getTransport:
        getTransportAlerts,

    getSOS:
        getSOSReports,

    render:
        renderAlerts,

    filter:
        filterAlerts,

    search:
        searchAlerts,

    add:
        addTransportAlert,

    resolve:
        resolveTransportAlert,

    getIcon:
        getAlertIcon,

    getStats:
        updateAlertStats,

    updateBadges:
        updateAlertBadges,

    openRoute:
        openAlertRoute

};


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

window.getSOSReports =
    getSOSReports;

window.renderAlerts =
    renderAlerts;

window.updateAlertStats =
    updateAlertStats;

window.getAlertIcon =
    getAlertIcon;
/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   TRAVELLERS.JS
   Traveller Portal + Journey Management
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const TRAVELLER_STORAGE_KEY =
    "travellers";

const TRAVELLER_HISTORY_KEY =
    "travellerTravelHistory";


/* =========================================================
   NORTHEAST INDIA SAMPLE TRAVELLERS
   ========================================================= */

const DEFAULT_TRAVELLERS = [

    {
        id: "TR-001",
        name: "Arjun Kumar",
        phone: "9876543210",
        type: "interstate",
        vehicle: "Bus",
        vehicleDetails: "AS 01 AB 4521",
        origin: "Guwahati",
        destination: "Shillong",
        route: "Guwahati → Shillong",
        status: "ACTIVE",
        emergency: false,
        createdAt: "2026-09-20T08:00:00",
        isCurrentUser: true
    },

    {
        id: "TR-002",
        name: "Priya Sharma",
        phone: "9876543211",
        type: "local",
        vehicle: "Car",
        vehicleDetails: "ML 05 MN 7812",
        origin: "Shillong",
        destination: "Cherrapunji",
        route: "Shillong → Cherrapunji",
        status: "ACTIVE",
        emergency: false,
        createdAt: "2026-09-20T08:05:00",
        isCurrentUser: false
    },

    {
        id: "TR-003",
        name: "Rahul Verma",
        phone: "9876543212",
        type: "interstate",
        vehicle: "Car",
        vehicleDetails: "AR 01 CD 9045",
        origin: "Guwahati",
        destination: "Itanagar",
        route: "Guwahati → Itanagar",
        status: "PLANNED",
        emergency: false,
        createdAt: "2026-09-20T08:10:00",
        isCurrentUser: false
    }

];


/* =========================================================
   LOAD TRAVELLERS
   ========================================================= */

function loadTravellers() {

    try {

        const stored =
            localStorage.getItem(
                TRAVELLER_STORAGE_KEY
            );


        if (stored) {

            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                return parsed;

            }

        }

    } catch (error) {

        console.warn(
            "Unable to load traveller data:",
            error
        );

    }


    return [
        ...DEFAULT_TRAVELLERS
    ];
}


let travellers =
    loadTravellers();


/* =========================================================
   SAVE TRAVELLERS
   ========================================================= */

function saveTravellers() {

    try {

        localStorage.setItem(
            TRAVELLER_STORAGE_KEY,
            JSON.stringify(travellers)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save traveller data:",
            error
        );

        return false;

    }

}


/* =========================================================
   CURRENT TRAVELLER
   ========================================================= */

function getCurrentTraveller() {

    let current =
        travellers.find(
            function (traveller) {

                return (
                    traveller.isCurrentUser === true ||
                    traveller.isCurrentUser === "true"
                );

            }
        );


    /*
       Try the login information if
       no traveller is explicitly selected.
    */

    if (!current) {

        try {

            const login =
                JSON.parse(
                    localStorage.getItem(
                        "travellerLogin"
                    ) || "null"
                );


            if (
                login &&
                login.phone
            ) {

                const phone =
                    String(
                        login.phone
                    );


                current =
                    travellers.find(
                        function (traveller) {

                            return (
                                String(
                                    traveller.phone
                                ) === phone
                            );

                        }
                    );

            }

        } catch (error) {

            console.warn(
                "Unable to read traveller login:",
                error
            );

        }

    }


    return current || null;

}


/* =========================================================
   GET SORTED TRAVELLERS
   ========================================================= */

function getSortedTravellers() {

    /*
       Travellers are not cargo.

       They do not use cargo priority
       scheduling. This function is retained
       for compatibility with older pages
       and sorts by journey creation time.
    */

    return [
        ...travellers
    ].sort(
        function (a, b) {

            return (
                new Date(
                    a.createdAt || 0
                ).getTime() -

                new Date(
                    b.createdAt || 0
                ).getTime()
            );

        }
    );

}


/* =========================================================
   CREATE TRAVEL TYPE BADGE
   ========================================================= */

function createTravelTypeBadge(
    type
) {

    const normalized =
        String(
            type || "local"
        ).toLowerCase();


    const label =
        normalized === "interstate"
            ? "Interstate"
            : "Local";


    return `

        <span class="travel-type-badge">

            ${escapeTravellerHTML(
                label
            )}

        </span>

    `;

}


/* =========================================================
   CREATE STATUS BADGE
   ========================================================= */

function createTravellerStatusBadge(
    status
) {

    const normalized =
        String(
            status || "PLANNED"
        ).toUpperCase();


    return `

        <span
            class="
                status-badge
                ${normalized.toLowerCase()}
            "
        >

            ${escapeTravellerHTML(
                normalized
            )}

        </span>

    `;

}


/* =========================================================
   RENDER TRAVELLERS TABLE
   ========================================================= */

function renderTravellers() {

    const tbody =
        document.getElementById(
            "travellerTableBody"
        ) ||
        document.getElementById(
            "travellersTableBody"
        );


    /*
       New Traveller Portal doesn't
       require the old management table.
    */

    if (!tbody) {

        updateTravellerStats();

        return;

    }


    const sorted =
        getSortedTravellers();


    tbody.innerHTML = "";


    sorted.forEach(
        function (traveller) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="traveller-name-cell">

                        <div class="traveller-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <strong>
                                ${escapeTravellerHTML(
                                    traveller.name
                                )}
                            </strong>

                            <small>
                                ${escapeTravellerHTML(
                                    traveller.phone
                                )}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    ${createTravelTypeBadge(
                        traveller.type
                    )}

                </td>


                <td>

                    <div class="vehicle-cell">

                        <strong>
                            ${escapeTravellerHTML(
                                traveller.vehicle
                            )}
                        </strong>

                        <small>
                            ${escapeTravellerHTML(
                                traveller.vehicleDetails ||
                                "Not provided"
                            )}
                        </small>

                    </div>

                </td>


                <td>
                    ${escapeTravellerHTML(
                        traveller.origin
                    )}
                </td>


                <td>
                    ${escapeTravellerHTML(
                        traveller.destination
                    )}
                </td>


                <td>

                    ${createTravellerStatusBadge(
                        traveller.status
                    )}

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    updateTravellerStats();

    renderTravellerMobileCards();

}


/* =========================================================
   MOBILE TRAVELLER CARDS
   ========================================================= */

function renderTravellerMobileCards() {

    const container =
        document.getElementById(
            "travellerMobileCards"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    getSortedTravellers().forEach(
        function (traveller) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "traveller-mobile-card";


            card.innerHTML = `

                <div class="mobile-traveller-top">

                    <strong>
                        ${escapeTravellerHTML(
                            traveller.name
                        )}
                    </strong>

                    ${createTravellerStatusBadge(
                        traveller.status
                    )}

                </div>


                <p>

                    ${escapeTravellerHTML(
                        traveller.origin
                    )}

                    →

                    ${escapeTravellerHTML(
                        traveller.destination
                    )}

                </p>


                <small>

                    ${escapeTravellerHTML(
                        traveller.vehicle
                    )}

                    ·

                    ${escapeTravellerHTML(
                        traveller.type
                    )}

                </small>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   TRAVELLER STATISTICS
   ========================================================= */

function updateTravellerStats() {

    const total =
        travellers.length;


    const local =
        travellers.filter(
            function (traveller) {

                return (
                    String(
                        traveller.type
                    ).toLowerCase() ===
                    "local"
                );

            }
        ).length;


    const interstate =
        travellers.filter(
            function (traveller) {

                return (
                    String(
                        traveller.type
                    ).toLowerCase() ===
                    "interstate"
                );

            }
        ).length;


    const active =
        travellers.filter(
            function (traveller) {

                return (
                    String(
                        traveller.status
                    ).toUpperCase() ===
                    "ACTIVE"
                );

            }
        ).length;


    setTravellerText(
        "totalTravellers",
        total
    );


    setTravellerText(
        "localTravellers",
        local
    );


    setTravellerText(
        "interstateTravellers",
        interstate
    );


    setTravellerText(
        "activeTravellers",
        active
    );


    /*
       Compatibility with old KPI.
    */

    setTravellerText(
        "priorityTravellers",
        active
    );

}


/* =========================================================
   SET TRAVELLER TEXT
   ========================================================= */

function setTravellerText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   ADD TRAVELLER
   ========================================================= */

function addTraveller(event) {

    if (event) {

        event.preventDefault();

    }


    function getFieldValue(
        ids
    ) {

        for (
            let i = 0;
            i < ids.length;
            i++
        ) {

            const element =
                document.getElementById(
                    ids[i]
                );


            if (element) {

                return (
                    element.value ||
                    ""
                ).trim();

            }

        }


        return "";

    }


    const name =
        getFieldValue([
            "travellerName"
        ]);


    const phone =
        getFieldValue([
            "travellerPhone",
            "phone",
            "licenceNumber"
        ]);


    const type =
        getFieldValue([
            "travelType",
            "travellerType"
        ]);


    const vehicle =
        getFieldValue([
            "vehicleType",
            "travellerVehicle"
        ]);


    const vehicleDetails =
        getFieldValue([
            "vehicleDetails",
            "vehicleNumber",
            "travellerVehicleDetails"
        ]);


    const origin =
        getFieldValue([
            "travellerOrigin",
            "origin"
        ]);


    const destination =
        getFieldValue([
            "travellerDestination",
            "destination"
        ]);


    const route =
        getFieldValue([
            "travellerRoute",
            "route"
        ]);


    if (
        !name ||
        !phone ||
        !type ||
        !vehicle ||
        !origin ||
        !destination
    ) {

        showTravellerMessage(
            "Please fill all required traveller details.",
            "warning"
        );

        return false;

    }


    if (
        origin.toLowerCase() ===
        destination.toLowerCase()
    ) {

        showTravellerMessage(
            "Origin and destination must be different.",
            "warning"
        );

        return false;

    }


    /*
       Mark previous current traveller
       as non-current.
    */

    travellers =
        travellers.map(
            function (traveller) {

                return {

                    ...traveller,

                    isCurrentUser:
                        false

                };

            }
        );


    const newTraveller = {

        id:
            `TR-${Date.now()}`,

        name:
            name,

        phone:
            phone,

        type:
            type.toLowerCase(),

        vehicle:
            vehicle,

        vehicleDetails:
            vehicleDetails ||
            "Not provided",

        origin:
            origin,

        destination:
            destination,

        route:
            route ||
            `${origin} → ${destination}`,

        status:
            "PLANNED",

        emergency:
            false,

        createdAt:
            new Date()
                .toISOString(),

        isCurrentUser:
            true

    };


    travellers.push(
        newTraveller
    );


    saveTravellers();


    renderTravellers();


    closeTravellerModal();


    resetTravellerForm();


    showTravellerMessage(
        "Traveller profile added successfully.",
        "success"
    );


    return false;

}


/* =========================================================
   UPDATE CURRENT TRAVELLER
   ========================================================= */

function updateCurrentTraveller(
    updates
) {

    const current =
        getCurrentTraveller();


    if (!current || !updates) {

        return null;

    }


    Object.assign(
        current,
        updates
    );


    if (
        updates.origin ||
        updates.destination
    ) {

        current.route =
            `${current.origin} → ${current.destination}`;

    }


    saveTravellers();


    renderTravellers();


    return current;

}


/* =========================================================
   PLAN JOURNEY
   ========================================================= */

function planTravellerJourney(
    origin,
    destination,
    travelType = "local"
) {

    if (
        !origin ||
        !destination
    ) {

        return {

            success: false,

            message:
                "Please select origin and destination."

        };

    }


    if (
        origin.toLowerCase() ===
        destination.toLowerCase()
    ) {

        return {

            success: false,

            message:
                "Origin and destination must be different."

        };

    }


    const route =
        `${origin} → ${destination}`;


    const current =
        getCurrentTraveller();


    if (current) {

        current.origin =
            origin;

        current.destination =
            destination;

        current.route =
            route;

        current.type =
            String(
                travelType
            ).toLowerCase();

        current.status =
            "PLANNED";

        saveTravellers();

    }


    /*
       Store route for Live Map
       and AI Analysis.
    */

    localStorage.setItem(
        "selectedRoute",
        route
    );


    localStorage.setItem(
        "travellerRoute",
        JSON.stringify({

            origin:
                origin,

            destination:
                destination,

            type:
                travelType,

            route:
                route,

            createdAt:
                new Date()
                    .toISOString()

        })
    );


    return {

        success: true,

        origin:
            origin,

        destination:
            destination,

        type:
            travelType,

        route:
            route,

        message:
            "Journey planned successfully."

    };

}


/* =========================================================
   ANALYSE TRAVELLER ROUTE
   ========================================================= */

function analyseTravellerRoute(
    origin,
    destination
) {

    const current =
        getCurrentTraveller();


    const routeOrigin =
        origin ||
        current?.origin;


    const routeDestination =
        destination ||
        current?.destination;


    if (
        !routeOrigin ||
        !routeDestination
    ) {

        return {

            feasible: false,

            score: 0,

            recommendation:
                "Please select an origin and destination."

        };

    }


    /*
       Use shared algorithm engine.
    */

    if (
        window.smartTransportAlgorithms &&
        typeof window.smartTransportAlgorithms
            .analyseTransportRoute ===
        "function"
    ) {

        return (
            window.smartTransportAlgorithms
                .analyseTransportRoute(
                    routeOrigin,
                    routeDestination,
                    "Traveller"
                )
        );

    }


    /*
       Safe frontend fallback.
    */

    return {

        feasible: true,

        score: 80,

        origin:
            routeOrigin,

        destination:
            routeDestination,

        transportType:
            "Traveller",

        recommendation:
            "Route is feasible. Check live traffic and weather conditions before departure.",

        factors: [

            {
                name:
                    "Route Availability",

                status:
                    "Available"

            },

            {
                name:
                    "Live Traffic",

                status:
                    "Requires live data"

            },

            {
                name:
                    "Weather",

                status:
                    "Requires live data"

            }

        ]

    };

}


/* =========================================================
   SAVE JOURNEY HISTORY
   ========================================================= */

function getTravellerHistory() {

    try {

        const stored =
            localStorage.getItem(
                TRAVELLER_HISTORY_KEY
            );


        if (!stored) {
            return [];
        }


        const parsed =
            JSON.parse(
                stored
            );


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   ADD JOURNEY TO HISTORY
   ========================================================= */

function addJourneyToHistory(
    journey
) {

    if (!journey) {
        return false;
    }


    const history =
        getTravellerHistory();


    history.unshift({

        ...journey,

        completedAt:
            new Date()
                .toISOString()

    });


    try {

        localStorage.setItem(
            TRAVELLER_HISTORY_KEY,
            JSON.stringify(
                history
            )
        );


        return true;

    } catch (error) {

        console.warn(
            "Unable to save journey history:",
            error
        );

        return false;

    }

}


/* =========================================================
   COMPLETE CURRENT JOURNEY
   ========================================================= */

function completeCurrentJourney() {

    const current =
        getCurrentTraveller();


    if (!current) {

        return false;

    }


    addJourneyToHistory({

        travellerId:
            current.id,

        origin:
            current.origin,

        destination:
            current.destination,

        route:
            current.route,

        vehicle:
            current.vehicle,

        type:
            current.type

    });


    current.status =
        "COMPLETED";


    saveTravellers();


    renderTravellers();


    return true;

}


/* =========================================================
   SET JOURNEY ACTIVE
   ========================================================= */

function startCurrentJourney() {

    const current =
        getCurrentTraveller();


    if (!current) {
        return false;
    }


    current.status =
        "ACTIVE";


    saveTravellers();


    renderTravellers();


    return true;

}


/* =========================================================
   GET TRAVELLER ALERTS
   ========================================================= */

function getTravellerAlerts() {

    const alerts = [];


    /*
       Pull shared transport alerts
       when alerts.js is available.
    */

    if (
        window.smartTransportAlerts &&
        typeof window.smartTransportAlerts
            .getAll ===
        "function"
    ) {

        const allAlerts =
            window.smartTransportAlerts
                .getAll();


        return allAlerts.filter(
            function (alert) {

                return (
                    alert.active !== false &&
                    (
                        alert.affectedUsers ===
                            "Traveller & Cargo" ||

                        alert.affectedUsers ===
                            "Traveller" ||

                        alert.affectedUsers ===
                            "Emergency Response"
                    )

                );

            }
        );

    }


    return alerts;

}


/* =========================================================
   TRAVELLER MODAL
   ========================================================= */

function openTravellerModal() {

    const modal =
        document.getElementById(
            "travellerModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeTravellerModal() {

    const modal =
        document.getElementById(
            "travellerModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetTravellerForm() {

    const form =
        document.getElementById(
            "travellerForm"
        );


    if (form) {

        form.reset();

    }

}


/* =========================================================
   FORM SETUP
   ========================================================= */

function setupTravellerForm() {

    const form =
        document.getElementById(
            "travellerForm"
        );


    if (!form) {
        return;
    }


    if (
        form.dataset.travellerInitialized ===
        "true"
    ) {

        return;

    }


    form.dataset.travellerInitialized =
        "true";


    form.addEventListener(
        "submit",
        addTraveller
    );

}


/* =========================================================
   TRAVEL TYPE FIELDS
   ========================================================= */

function updateTravelTypeFields() {

    /*
       Kept for compatibility with
       existing HTML onchange handlers.

       Both Local and Interstate travellers
       use the same core journey fields.
    */

    const type =
        document.getElementById(
            "travelType"
        );


    const interstate =
        type &&
        String(
            type.value
        ).toLowerCase() ===
        "interstate";


    document.dispatchEvent(
        new CustomEvent(
            "smartTransportTravelTypeChanged",
            {
                detail: {
                    type:
                        interstate
                            ? "interstate"
                            : "local"
                }
            }
        )
    );

}


/* =========================================================
   SEARCH TRAVELLERS
   ========================================================= */

function searchTravellers() {

    const input =
        document.getElementById(
            "travellerSearch"
        ) ||
        document.getElementById(
            "searchTraveller"
        );


    if (!input) {
        return;
    }


    const searchTerm =
        input.value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#travellerTableBody tr, #travellersTableBody tr"
        );


    rows.forEach(
        function (row) {

            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(
                    searchTerm
                )
                    ? ""
                    : "none";

        }
    );

}


/* =========================================================
   FILTER TRAVELLERS
   ========================================================= */

function filterTravellers(
    type
) {

    const rows =
        document.querySelectorAll(
            "#travellerTableBody tr, #travellersTableBody tr"
        );


    rows.forEach(
        function (row) {

            if (
                !type ||
                type === "all"
            ) {

                row.style.display =
                    "";

                return;

            }


            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(
                    String(
                        type
                    ).toLowerCase()
                )
                    ? ""
                    : "none";

        }
    );

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showTravellerMessage(
    message,
    type = "info"
) {

    if (
        window.smartTransportApp &&
        typeof window.smartTransportApp.toast ===
        "function"
    ) {

        window.smartTransportApp.toast(
            message,
            type
        );

        return;

    }


    console.log(
        `[Traveller ${type}]`,
        message
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeTravellerHTML(
    value
) {

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


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Do not force a demo traveller over
           an existing login/session.
        */

        const current =
            getCurrentTraveller();


        if (!current) {

            /*
               Mark the first sample traveller
               as the demo current traveller.
            */

            const demo =
                travellers[0];


            if (demo) {

                demo.isCurrentUser =
                    true;

                saveTravellers();

            }

        }


        setupTravellerForm();

        renderTravellers();

    }
);


/* =========================================================
   PUBLIC TRAVELLER API
   ========================================================= */

window.travellerManagement = {

    getTravellers:
        function () {
            return travellers;
        },

    getCurrentTraveller:
        getCurrentTraveller,

    getSortedTravellers:
        getSortedTravellers,

    addTraveller:
        addTraveller,

    updateCurrentTraveller:
        updateCurrentTraveller,

    renderTravellers:
        renderTravellers,

    updateTravellerStats:
        updateTravellerStats,

    planJourney:
        planTravellerJourney,

    analyseRoute:
        analyseTravellerRoute,

    getHistory:
        getTravellerHistory,

    addJourneyToHistory:
        addJourneyToHistory,

    startJourney:
        startCurrentJourney,

    completeJourney:
        completeCurrentJourney,

    getAlerts:
        getTravellerAlerts

};


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

window.getSortedTravellers =
    getSortedTravellers;

window.addTraveller =
    addTraveller;

window.openTravellerModal =
    openTravellerModal;

window.closeTravellerModal =
    closeTravellerModal;

window.updateTravelTypeFields =
    updateTravelTypeFields;

window.searchTravellers =
    searchTravellers;

window.filterTravellers =
    filterTravellers;

window.planTravellerJourney =
    planTravellerJourney;

window.analyseTravellerRoute =
    analyseTravellerRoute;


console.log(
    "Smart Transport Traveller Portal Loaded"
);
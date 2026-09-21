/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   CARGO.JS
   Cargo Portal + Shipment Management
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const CARGO_SHIPMENTS_KEY = "cargoShipments";
const CARGO_LOGIN_KEY = "cargoLogin";
const CARGO_DATA_KEY = "cargoData";
const CARGO_HISTORY_KEY = "cargoShipmentHistory";


/* =========================================================
   NORTHEAST INDIA SAMPLE CARGO
   ========================================================= */

const DEFAULT_CARGO_DATA = [

    {
        id: "CG-001",
        name: "Medical Supplies",
        type: "Medical Supplies",
        origin: "Guwahati",
        destination: "Shillong",
        vehicle: "Emergency Transport",
        weight: 850,
        priority: "P1",
        status: "MOVING",
        emergency: true,
        arrivalOrder: 1,
        createdAt: "2026-09-20T08:30:00",
        isCurrentUser: false
    },

    {
        id: "CG-002",
        name: "Furniture",
        type: "Furniture",
        origin: "Guwahati",
        destination: "Dimapur",
        vehicle: "Cargo Truck",
        weight: 2400,
        priority: "P3",
        status: "WAITING",
        emergency: false,
        arrivalOrder: 2,
        createdAt: "2026-09-20T08:35:00",
        isCurrentUser: true
    },

    {
        id: "CG-003",
        name: "General Goods",
        type: "General Goods",
        origin: "Shillong",
        destination: "Tura",
        vehicle: "Cargo Truck",
        weight: 1800,
        priority: "P3",
        status: "WAITING",
        emergency: false,
        arrivalOrder: 3,
        createdAt: "2026-09-20T08:40:00",
        isCurrentUser: false
    },

    {
        id: "CG-004",
        name: "Emergency Relief Materials",
        type: "Emergency Relief",
        origin: "Imphal",
        destination: "Kohima",
        vehicle: "Relief Transport",
        weight: 1200,
        priority: "P1",
        status: "NEXT",
        emergency: true,
        arrivalOrder: 4,
        createdAt: "2026-09-20T08:45:00",
        isCurrentUser: false
    },

    {
        id: "CG-005",
        name: "Food Supplies",
        type: "Food Supplies",
        origin: "Agartala",
        destination: "Aizawl",
        vehicle: "Container Truck",
        weight: 3200,
        priority: "P2",
        status: "WAITING",
        emergency: false,
        arrivalOrder: 5,
        createdAt: "2026-09-20T08:50:00",
        isCurrentUser: false
    }

];


/* =========================================================
   LOAD CARGO SHIPMENTS
   IMPORTANT:
   cargoShipments is separate from cargoData.
   emergency.js can safely keep cargoData as an object.
   ========================================================= */

function loadCargoData() {

    try {

        const stored =
            localStorage.getItem(
                CARGO_SHIPMENTS_KEY
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
            "Unable to load cargo shipments:",
            error
        );

    }

    /*
       Migration support.

       Older versions stored the shipment array
       directly inside cargoData.

       If that old format still exists, migrate it
       to cargoShipments automatically.
    */

    try {

        const oldStored =
            localStorage.getItem(
                CARGO_DATA_KEY
            );

        if (oldStored) {

            const oldParsed =
                JSON.parse(oldStored);

            if (Array.isArray(oldParsed)) {

                localStorage.setItem(
                    CARGO_SHIPMENTS_KEY,
                    JSON.stringify(oldParsed)
                );

                return oldParsed;

            }

        }

    } catch (error) {

        console.warn(
            "Unable to migrate old cargo data:",
            error
        );

    }

    return [
        ...DEFAULT_CARGO_DATA
    ];
}


/* =========================================================
   CARGO DATA
   ========================================================= */

let cargoData =
    loadCargoData();


/* =========================================================
   SAVE CARGO SHIPMENTS
   ========================================================= */

function saveCargoData() {

    try {

        localStorage.setItem(
            CARGO_SHIPMENTS_KEY,
            JSON.stringify(cargoData)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save cargo shipments:",
            error
        );

        return false;
    }
}


/* =========================================================
   SYNC CURRENT LOGIN CARGO
   ========================================================= */

function syncCargoLoginData() {

    try {

        const login =
            JSON.parse(
                localStorage.getItem(
                    CARGO_LOGIN_KEY
                ) || "null"
            );

        if (!login || !login.vehicle) {

            return null;
        }

        let matchingCargo =
            cargoData.find(function (cargo) {

                return (
                    String(cargo.vehicle || "")
                        .toUpperCase() ===
                    String(login.vehicle || "")
                        .toUpperCase()
                );

            });

        /*
           If the logged-in vehicle is not yet present,
           create a shipment record for the logged-in cargo.
        */

        if (!matchingCargo) {

            let loginCargo = null;

            try {

                loginCargo =
                    JSON.parse(
                        localStorage.getItem(
                            CARGO_DATA_KEY
                        ) || "null"
                    );

            } catch (error) {

                loginCargo = null;

            }

            if (
                loginCargo &&
                typeof loginCargo === "object" &&
                !Array.isArray(loginCargo)
            ) {

                matchingCargo = {

                    id:
                        loginCargo.id ||
                        generateCargoId(),

                    name:
                        loginCargo.name ||
                        loginCargo.cargoType ||
                        "Furniture",

                    type:
                        loginCargo.type ||
                        loginCargo.cargoType ||
                        "Furniture",

                    origin:
                        loginCargo.origin ||
                        "Guwahati",

                    destination:
                        loginCargo.destination ||
                        "Dimapur",

                    vehicle:
                        login.vehicle,

                    weight:
                        Number(
                            loginCargo.weight ||
                            2400
                        ),

                    priority:
                        normalizeCargoPriority(
                            loginCargo.priority ||
                            "P3"
                        ),

                    status:
                        loginCargo.status ||
                        "WAITING",

                    emergency:
                        loginCargo.emergency ||
                        false,

                    arrivalOrder:
                        loginCargo.arrivalOrder ||
                        Date.now(),

                    createdAt:
                        loginCargo.createdAt ||
                        new Date().toISOString(),

                    isCurrentUser:
                        true

                };

                /*
                   Remove current-user marker from
                   all other shipments.
                */

                cargoData =
                    cargoData.map(function (cargo) {

                        return {

                            ...cargo,

                            isCurrentUser:
                                false

                        };

                    });

                cargoData.push(
                    matchingCargo
                );

                saveCargoData();

            }

        }

        if (matchingCargo) {

            cargoData =
                cargoData.map(function (cargo) {

                    return {

                        ...cargo,

                        isCurrentUser:
                            cargo.id ===
                            matchingCargo.id

                    };

                });

            saveCargoData();

        }

        return matchingCargo || null;

    } catch (error) {

        console.warn(
            "Unable to sync cargo login:",
            error
        );

        return null;
    }
}


/* =========================================================
   NORMALIZE PRIORITY
   ========================================================= */

function normalizeCargoPriority(priority) {

    if (
        priority === 1 ||
        priority === "1" ||
        priority === "P1"
    ) {

        return "P1";

    }

    if (
        priority === 2 ||
        priority === "2" ||
        priority === "P2"
    ) {

        return "P2";

    }

    return "P3";
}


/* =========================================================
   PRIORITY VALUE
   ========================================================= */

function cargoPriorityValue(priority) {

    const normalized =
        normalizeCargoPriority(
            priority
        );

    if (normalized === "P1") {
        return 1;
    }

    if (normalized === "P2") {
        return 2;
    }

    return 3;
}


/* =========================================================
   PRIORITY LABEL
   ========================================================= */

function getCargoPriorityLabel(priority) {

    const normalized =
        normalizeCargoPriority(
            priority
        );

    const labels = {

        P1:
            "Emergency / Critical",

        P2:
            "High Priority",

        P3:
            "Standard"

    };

    return labels[
        normalized
    ];
}


/* =========================================================
   PRIORITY CSS CLASS
   ========================================================= */

function getPriorityClass(priority) {

    const normalized =
        normalizeCargoPriority(
            priority
        );

    return (
        "priority-" +
        normalized.toLowerCase()
    );
}


/* =========================================================
   PREPARE CARGO FOR ALGORITHM ENGINE
   ========================================================= */

function prepareCargoForScheduling(
    cargo
) {

    return {

        ...cargo,

        priority:
            normalizeCargoPriority(
                cargo.priority
            ),

        arrivalOrder:
            Number(
                cargo.arrivalOrder ||
                new Date(
                    cargo.createdAt ||
                    Date.now()
                ).getTime()
            )

    };
}


/* =========================================================
   GET SORTED CARGO
   Priority Scheduling + FCFS
   ========================================================= */

function getSortedCargo() {

    const prepared =
        cargoData.map(
            prepareCargoForScheduling
        );


    /*
       Use shared DSA engine when available.
    */

    if (
        window.smartTransportAlgorithms &&
        typeof window.smartTransportAlgorithms
            .scheduleTransportQueue ===
        "function"
    ) {

        return window.smartTransportAlgorithms
            .scheduleTransportQueue(
                prepared
            );

    }


    /*
       Fallback:
       Priority Scheduling +
       FCFS for equal priority.
    */

    return [
        ...prepared
    ].sort(function (a, b) {

        const priorityDifference =
            cargoPriorityValue(
                a.priority
            ) -
            cargoPriorityValue(
                b.priority
            );

        if (
            priorityDifference !== 0
        ) {

            return priorityDifference;

        }

        return (
            Number(a.arrivalOrder || 0) -
            Number(b.arrivalOrder || 0)
        );

    });

}


/* =========================================================
   GET CURRENT USER CARGO
   ========================================================= */

function getCurrentUserCargo() {

    /*
       First sync with the logged-in vehicle.
    */

    const syncedCargo =
        syncCargoLoginData();

    if (syncedCargo) {

        return syncedCargo;

    }


    /*
       Then look for explicit current-user marker.
    */

    let userCargo =
        cargoData.find(function (cargo) {

            return (
                cargo.isCurrentUser === true ||
                cargo.isCurrentUser === "true"
            );

        });


    /*
       If nothing is found, read cargo login.
    */

    if (!userCargo) {

        try {

            const login =
                JSON.parse(
                    localStorage.getItem(
                        CARGO_LOGIN_KEY
                    ) || "null"
                );

            if (
                login &&
                login.vehicle
            ) {

                userCargo =
                    cargoData.find(
                        function (cargo) {

                            return (
                                String(
                                    cargo.vehicle ||
                                    ""
                                ).toUpperCase() ===
                                String(
                                    login.vehicle ||
                                    ""
                                ).toUpperCase()
                            );

                        }
                    );

            }

        } catch (error) {

            console.warn(
                "Unable to read cargo login:",
                error
            );

        }

    }

    return userCargo || null;
}


/* =========================================================
   GET CURRENT USER QUEUE INFORMATION
   ========================================================= */

function getCurrentCargoQueueInfo() {

    const sorted =
        getSortedCargo();

    const currentCargo =
        getCurrentUserCargo();


    if (!currentCargo) {

        return {

            cargo: null,

            queuePosition: null,

            waiting: false,

            reason:
                "No current cargo shipment found.",

            higherPriorityCargo: [],

            samePriorityAhead: [],

            schedulingMethod:
                "Priority Scheduling + FCFS"

        };

    }


    const currentIndex =
        sorted.findIndex(
            function (cargo) {

                return (
                    cargo.id ===
                    currentCargo.id
                );

            }
        );


    if (currentIndex === -1) {

        return {

            cargo: currentCargo,

            queuePosition: null,

            waiting: false,

            reason:
                "Shipment is not currently in the scheduling queue.",

            higherPriorityCargo: [],

            samePriorityAhead: [],

            schedulingMethod:
                "Priority Scheduling + FCFS"

        };

    }


    const priority =
        cargoPriorityValue(
            currentCargo.priority
        );


    const higherPriorityCargo =
        sorted.filter(
            function (cargo) {

                return (

                    cargo.id !==
                    currentCargo.id &&

                    cargoPriorityValue(
                        cargo.priority
                    ) < priority &&

                    String(
                        cargo.status ||
                        ""
                    ).toUpperCase() !==
                    "COMPLETED"

                );

            }
        );


    const samePriorityAhead =
        sorted.filter(
            function (cargo) {

                return (

                    cargo.id !==
                    currentCargo.id &&

                    cargoPriorityValue(
                        cargo.priority
                    ) === priority &&

                    Number(
                        cargo.arrivalOrder ||
                        0
                    ) <
                    Number(
                        currentCargo.arrivalOrder ||
                        0
                    ) &&

                    String(
                        cargo.status ||
                        ""
                    ).toUpperCase() !==
                    "COMPLETED"

                );

            }
        );


    let reason =
        "Shipment is ready for dispatch.";


    const status =
        String(
            currentCargo.status ||
            "WAITING"
        ).toUpperCase();


    if (
        status === "WAITING" ||
        status === "NEXT"
    ) {

        if (
            higherPriorityCargo.length > 0
        ) {

            reason =
                `${higherPriorityCargo.length} higher-priority shipment(s) are ahead of your cargo.`;

        }

        else if (
            samePriorityAhead.length > 0
        ) {

            reason =
                "Your cargo has the same priority as shipments ahead, so FCFS order is being followed.";

        }

        else if (
            status === "WAITING"
        ) {

            reason =
                "Your shipment is waiting for the next available transport slot.";

        }

        else {

            reason =
                "Your shipment is next in the transport schedule.";

        }

    }


    if (
        status === "MOVING"
    ) {

        reason =
            "Your shipment is currently moving.";

    }


    if (
        status === "COMPLETED"
    ) {

        reason =
            "Your shipment has completed its journey.";

    }


    return {

        cargo:
            currentCargo,

        queuePosition:
            currentIndex + 1,

        waiting:
            status === "WAITING",

        reason:
            reason,

        higherPriorityCargo:
            higherPriorityCargo,

        samePriorityAhead:
            samePriorityAhead,

        schedulingMethod:
            "Priority Scheduling + FCFS"

    };

}


/* =========================================================
   APPLY QUEUE POSITIONS
   ========================================================= */

function updateCargoQueuePositions() {

    const sorted =
        getSortedCargo();


    sorted.forEach(
        function (cargo, index) {

            const original =
                cargoData.find(
                    function (item) {

                        return (
                            item.id ===
                            cargo.id
                        );

                    }
                );


            if (original) {

                original.queuePosition =
                    index + 1;

            }

        }
    );


    saveCargoData();

    return sorted;

}


/* =========================================================
   RENDER OLD TABLE IF PRESENT
   ========================================================= */

function renderCargo() {

    const tbody =
        document.getElementById(
            "cargoTableBody"
        );


    /*
       New Cargo Portal does not require
       the old management table.

       We still keep compatibility.
    */

    if (!tbody) {

        updateCargoStats();

        return;

    }


    const sorted =
        updateCargoQueuePositions();


    tbody.innerHTML = "";


    sorted.forEach(
        function (cargo) {

            const row =
                document.createElement(
                    "tr"
                );


            const priority =
                normalizeCargoPriority(
                    cargo.priority
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeCargoHTML(
                            cargo.id
                        )}
                    </strong>
                </td>

                <td>
                    <strong>
                        ${escapeCargoHTML(
                            cargo.name
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeCargoHTML(
                            cargo.type
                        )}
                    </small>
                </td>

                <td>
                    ${escapeCargoHTML(
                        cargo.origin
                    )}
                </td>

                <td>
                    ${escapeCargoHTML(
                        cargo.destination
                    )}
                </td>

                <td>
                    ${escapeCargoHTML(
                        cargo.vehicle
                    )}
                </td>

                <td>
                    ${Number(
                        cargo.weight || 0
                    ).toLocaleString()} kg
                </td>

                <td>
                    <span
                        class="
                            priority-badge
                            ${getPriorityClass(
                                priority
                            )}
                        "
                    >
                        ${priority}
                        ·
                        ${getCargoPriorityLabel(
                            priority
                        )}
                    </span>
                </td>

                <td>
                    <span
                        class="
                            status-badge
                            ${String(
                                cargo.status ||
                                "WAITING"
                            ).toLowerCase()}
                        "
                    >
                        ${escapeCargoHTML(
                            cargo.status ||
                            "WAITING"
                        )}
                    </span>
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    updateCargoStats();

}


/* =========================================================
   CARGO STATISTICS
   ========================================================= */

function updateCargoStats() {

    const total =
        cargoData.length;


    const p1 =
        cargoData.filter(
            function (cargo) {

                return (
                    normalizeCargoPriority(
                        cargo.priority
                    ) === "P1"
                );

            }
        ).length;


    const p2 =
        cargoData.filter(
            function (cargo) {

                return (
                    normalizeCargoPriority(
                        cargo.priority
                    ) === "P2"
                );

            }
        ).length;


    const p3 =
        cargoData.filter(
            function (cargo) {

                return (
                    normalizeCargoPriority(
                        cargo.priority
                    ) === "P3"
                );

            }
        ).length;


    const waiting =
        cargoData.filter(
            function (cargo) {

                return (
                    String(
                        cargo.status ||
                        ""
                    ).toUpperCase() ===
                    "WAITING"
                );

            }
        ).length;


    const moving =
        cargoData.filter(
            function (cargo) {

                return (
                    String(
                        cargo.status ||
                        ""
                    ).toUpperCase() ===
                    "MOVING"
                );

            }
        ).length;


    setCargoText(
        "totalCargo",
        total
    );

    setCargoText(
        "emergencyCargo",
        p1
    );

    setCargoText(
        "highPriorityCargo",
        p2
    );

    setCargoText(
        "normalCargo",
        p3
    );

    setCargoText(
        "waitingCargo",
        waiting
    );

    setCargoText(
        "movingCargo",
        moving
    );


    /*
       New Cargo Portal IDs.
    */

    setCargoText(
        "cargoQueueCount",
        waiting
    );

    setCargoText(
        "cargoP1Count",
        p1
    );

    setCargoText(
        "cargoP2Count",
        p2
    );

    setCargoText(
        "cargoP3Count",
        p3
    );

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setCargoText(
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
   ADD CARGO
   ========================================================= */

function addCargo(event) {

    if (event) {

        event.preventDefault();

    }


    const name =
        document
            .getElementById(
                "cargoName"
            )
            ?.value
            .trim();


    const type =
        document
            .getElementById(
                "cargoType"
            )
            ?.value;


    const origin =
        document
            .getElementById(
                "cargoOrigin"
            )
            ?.value;


    const destination =
        document
            .getElementById(
                "cargoDestination"
            )
            ?.value;


    const vehicle =
        document
            .getElementById(
                "cargoVehicle"
            )
            ?.value;


    const weight =
        Number(
            document
                .getElementById(
                    "cargoWeight"
                )
                ?.value
        );


    let priority =
        document
            .getElementById(
                "cargoPriority"
            )
            ?.value;


    if (!priority) {

        priority =
            classifyCargoFromType(
                type
            );

    }


    priority =
        normalizeCargoPriority(
            priority
        );


    if (
        !name ||
        !type ||
        !origin ||
        !destination ||
        !vehicle ||
        !weight
    ) {

        showCargoMessage(
            "Please fill all cargo details.",
            "warning"
        );

        return false;

    }


    if (
        origin === destination
    ) {

        showCargoMessage(
            "Origin and destination must be different.",
            "warning"
        );

        return false;

    }


    const cargoId =
        generateCargoId();


    const newCargo = {

        id:
            cargoId,

        name:
            name,

        type:
            type,

        origin:
            origin,

        destination:
            destination,

        vehicle:
            vehicle,

        weight:
            weight,

        priority:
            priority,

        status:
            priority === "P1"
                ? "NEXT"
                : "WAITING",

        emergency:
            priority === "P1",

        arrivalOrder:
            Date.now(),

        createdAt:
            new Date()
                .toISOString(),

        isCurrentUser:
            true

    };


    /*
       Remove previous current-user marker.
    */

    cargoData =
        cargoData.map(
            function (cargo) {

                return {

                    ...cargo,

                    isCurrentUser:
                        false

                };

            }
        );


    cargoData.push(
        newCargo
    );


    saveCargoData();

    updateCargoQueuePositions();

    renderCargo();

    closeCargoModal();

    resetCargoForm();


    showCargoMessage(
        `Cargo ${cargoId} added successfully. Priority ${priority} has been assigned using the transport scheduling system.`,
        "success"
    );


    return false;

}


/* =========================================================
   AUTOMATIC PRIORITY CLASSIFICATION
   ========================================================= */

function classifyCargoFromType(
    type
) {

    const normalized =
        String(
            type || ""
        ).toLowerCase();


    if (
        normalized.includes(
            "medical"
        ) ||
        normalized.includes(
            "emergency"
        ) ||
        normalized.includes(
            "relief"
        )
    ) {

        return "P1";

    }


    if (
        normalized.includes(
            "food"
        ) ||
        normalized.includes(
            "essential"
        ) ||
        normalized.includes(
            "urgent"
        )
    ) {

        return "P2";

    }


    return "P3";

}


/* =========================================================
   GENERATE CARGO ID
   ========================================================= */

function generateCargoId() {

    let highest =
        0;


    cargoData.forEach(
        function (cargo) {

            const match =
                String(
                    cargo.id || ""
                ).match(
                    /CG-(\d+)/
                );


            if (match) {

                highest =
                    Math.max(
                        highest,
                        Number(
                            match[1]
                        )
                    );

            }

        }
    );


    return (
        "CG-" +
        String(
            highest + 1
        ).padStart(
            3,
            "0"
        )
    );

}


/* =========================================================
   RESET CARGO FORM
   ========================================================= */

function resetCargoForm() {

    const form =
        document.getElementById(
            "cargoForm"
        );


    if (form) {

        form.reset();

    }

}


/* =========================================================
   OPEN CARGO MODAL
   ========================================================= */

function openCargoModal() {

    const modal =
        document.getElementById(
            "cargoModal"
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


/* =========================================================
   CLOSE CARGO MODAL
   ========================================================= */

function closeCargoModal() {

    const modal =
        document.getElementById(
            "cargoModal"
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
   SHIPMENT PLANNER
   ========================================================= */

function planCargoShipment(
    origin,
    destination,
    cargoType,
    priority
) {

    const normalizedPriority =
        normalizeCargoPriority(
            priority ||
            classifyCargoFromType(
                cargoType
            )
        );


    return {

        origin:
            origin,

        destination:
            destination,

        cargoType:
            cargoType,

        priority:
            normalizedPriority,

        schedulingMethod:
            "Priority Scheduling + FCFS",

        message:
            normalizedPriority === "P1"
                ? "Emergency cargo will receive P1 priority."
                : normalizedPriority === "P2"
                    ? "Cargo will be placed ahead of standard P3 shipments."
                    : "Standard cargo follows FCFS within the P3 queue."

    };

}


/* =========================================================
   CARGO LOGIN
   ========================================================= */

function loadCargoLogin() {

    try {

        const login =
            JSON.parse(
                localStorage.getItem(
                    CARGO_LOGIN_KEY
                ) || "null"
            );


        const heading =
            document.getElementById(
                "cargoUserHeading"
            );


        if (
            heading &&
            login &&
            login.vehicle
        ) {

            heading.textContent =
                `Cargo — ${login.vehicle}`;

        }


        /*
           Sync logged-in vehicle with
           shipment data.
        */

        if (
            login &&
            login.vehicle
        ) {

            syncCargoLoginData();

        }

    } catch (error) {

        console.warn(
            "Unable to load cargo login:",
            error
        );

    }

}


/* =========================================================
   CARGO FORM SETUP
   ========================================================= */

function setupCargoForm() {

    const form =
        document.getElementById(
            "cargoForm"
        );


    if (!form) {

        return;

    }


    if (
        form.dataset.cargoInitialized ===
        "true"
    ) {

        return;

    }


    form.dataset.cargoInitialized =
        "true";


    form.addEventListener(
        "submit",
        addCargo
    );

}


/* =========================================================
   SHOW CARGO MESSAGE
   ========================================================= */

function showCargoMessage(
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
        `[Cargo ${type}]`,
        message
    );

}


/* =========================================================
   CARGO HISTORY
   ========================================================= */

function getCargoHistory() {

    try {

        const stored =
            localStorage.getItem(
                CARGO_HISTORY_KEY
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
   ADD TO CARGO HISTORY
   ========================================================= */

function addCargoToHistory(
    cargo
) {

    if (!cargo) {

        return false;

    }


    const history =
        getCargoHistory();


    history.unshift({

        ...cargo,

        completedAt:
            new Date()
                .toISOString()

    });


    try {

        localStorage.setItem(
            CARGO_HISTORY_KEY,
            JSON.stringify(
                history
            )
        );

        return true;

    } catch (error) {

        console.warn(
            "Unable to save cargo history:",
            error
        );

        return false;

    }

}


/* =========================================================
   COMPLETE CARGO
   ========================================================= */

function completeCargo(
    cargoId
) {

    const cargo =
        cargoData.find(
            function (item) {

                return (
                    item.id ===
                    cargoId
                );

            }
        );


    if (!cargo) {

        return false;

    }


    cargo.status =
        "COMPLETED";


    addCargoToHistory(
        cargo
    );


    saveCargoData();

    renderCargo();


    showCargoMessage(
        `${cargo.name} has been marked as completed.`,
        "success"
    );


    return true;

}


/* =========================================================
   SET CARGO MOVING
   ========================================================= */

function setCargoMoving(
    cargoId
) {

    const cargo =
        cargoData.find(
            function (item) {

                return (
                    item.id ===
                    cargoId
                );

            }
        );


    if (!cargo) {

        return false;

    }


    cargo.status =
        "MOVING";


    saveCargoData();

    renderCargo();


    showCargoMessage(
        `${cargo.name} is now marked as moving.`,
        "success"
    );


    return true;

}


/* =========================================================
   GET CARGO BY ID
   ========================================================= */

function getCargoById(
    cargoId
) {

    return (
        cargoData.find(
            function (cargo) {

                return (
                    cargo.id ===
                    cargoId
                );

            }
        ) || null
    );

}


/* =========================================================
   GET CURRENT QUEUE SUMMARY
   ========================================================= */

function getCargoQueueSummary() {

    const sorted =
        getSortedCargo();


    return {

        total:
            sorted.length,

        moving:
            sorted.filter(
                function (cargo) {

                    return (
                        String(
                            cargo.status ||
                            ""
                        ).toUpperCase() ===
                        "MOVING"
                    );

                }
            ).length,

        waiting:
            sorted.filter(
                function (cargo) {

                    return (
                        String(
                            cargo.status ||
                            ""
                        ).toUpperCase() ===
                        "WAITING"
                    );

                }
            ).length,

        p1:
            sorted.filter(
                function (cargo) {

                    return (
                        normalizeCargoPriority(
                            cargo.priority
                        ) === "P1"
                    );

                }
            ).length,

        p2:
            sorted.filter(
                function (cargo) {

                    return (
                        normalizeCargoPriority(
                            cargo.priority
                        ) === "P2"
                    );

                }
            ).length,

        p3:
            sorted.filter(
                function (cargo) {

                    return (
                        normalizeCargoPriority(
                            cargo.priority
                        ) === "P3"
                    );

                }
            ).length

    };

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeCargoHTML(
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

        loadCargoLogin();

        setupCargoForm();

        updateCargoQueuePositions();

        renderCargo();

    }
);


/* =========================================================
   PUBLIC CARGO API
   ========================================================= */

window.cargoManagement = {

    getCargo:
        function () {
            return cargoData;
        },

    getCargoById:
        getCargoById,

    getCurrentUserCargo:
        getCurrentUserCargo,

    getCurrentCargoQueueInfo:
        getCurrentCargoQueueInfo,

    getSortedCargo:
        getSortedCargo,

    getCargoQueueSummary:
        getCargoQueueSummary,

    addCargo:
        addCargo,

    renderCargo:
        renderCargo,

    updateCargoStats:
        updateCargoStats,

    updateCargoQueuePositions:
        updateCargoQueuePositions,

    completeCargo:
        completeCargo,

    setCargoMoving:
        setCargoMoving,

    getCargoHistory:
        getCargoHistory,

    addCargoToHistory:
        addCargoToHistory,

    planCargoShipment:
        planCargoShipment,

    classifyCargoFromType:
        classifyCargoFromType,

    getPriorityLabel:
        getCargoPriorityLabel,

    getPriorityClass:
        getPriorityClass

};


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

window.getSortedCargo =
    getSortedCargo;

window.getCurrentUserCargo =
    getCurrentUserCargo;

window.getCurrentCargoQueueInfo =
    getCurrentCargoQueueInfo;

window.getCargoQueueSummary =
    getCargoQueueSummary;

window.addCargo =
    addCargo;

window.openCargoModal =
    openCargoModal;

window.closeCargoModal =
    closeCargoModal;

window.getPriorityLabel =
    getCargoPriorityLabel;

window.getPriorityClass =
    getPriorityClass;

window.completeCargo =
    completeCargo;

window.setCargoMoving =
    setCargoMoving;
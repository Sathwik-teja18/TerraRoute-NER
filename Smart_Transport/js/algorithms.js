/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   ALGORITHMS.JS
   DSA + TRANSPORT SCHEDULING ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const TRANSPORT_ALGORITHM_CONFIG = {

    priorityLevels: {
        P1: 1,
        P2: 2,
        P3: 3
    },

    priorityNames: {
        P1: "Emergency / Critical",
        P2: "High Priority",
        P3: "Standard"
    },

    priorityWindowMinutes: 15,

    emergencyPriority: "P1",

    schedulingMethod:
        "Priority Scheduling + FCFS for Equal Priority"
};


/* =========================================================
   SAMPLE NORTHEAST TRANSPORT QUEUE
   ========================================================= */

const DEFAULT_TRANSPORT_QUEUE = [

    {
        id: "TR-001",
        cargo: "Medical Supplies",
        cargoType: "Medical Supplies",
        priority: "P1",
        origin: "Guwahati",
        destination: "Shillong",
        status: "MOVING",
        arrivalOrder: 1,
        vehicle: "Emergency Transport",
        weight: "850 kg"
    },

    {
        id: "TR-002",
        cargo: "Furniture",
        cargoType: "Furniture",
        priority: "P3",
        origin: "Guwahati",
        destination: "Dimapur",
        status: "WAITING",
        arrivalOrder: 2,
        vehicle: "Cargo Truck",
        weight: "2.4 Tonnes",
        isCurrentUser: true
    },

    {
        id: "TR-003",
        cargo: "General Goods",
        cargoType: "General Goods",
        priority: "P3",
        origin: "Shillong",
        destination: "Tura",
        status: "WAITING",
        arrivalOrder: 3,
        vehicle: "Cargo Truck",
        weight: "1.8 Tonnes"
    }

];


/* =========================================================
   PRIORITY COMPARISON
   ========================================================= */

function getPriorityValue(priority) {

    if (!priority) {
        return TRANSPORT_ALGORITHM_CONFIG.priorityLevels.P3;
    }

    const normalized =
        String(priority).toUpperCase();

    return (
        TRANSPORT_ALGORITHM_CONFIG
            .priorityLevels[normalized] ||
        TRANSPORT_ALGORITHM_CONFIG
            .priorityLevels.P3
    );
}


/* =========================================================
   COMPARE TWO TRANSPORT REQUESTS
   ========================================================= */

function compareTransportPriority(a, b) {

    const priorityA =
        getPriorityValue(a.priority);

    const priorityB =
        getPriorityValue(b.priority);

    /*
       Lower numerical value means higher priority.

       P1 > P2 > P3
    */

    if (priorityA !== priorityB) {

        return priorityA - priorityB;

    }

    /*
       Equal priority:
       FCFS — First Come, First Served
    */

    return (
        Number(a.arrivalOrder || 0) -
        Number(b.arrivalOrder || 0)
    );
}


/* =========================================================
   PRIORITY SCHEDULING
   ========================================================= */

function prioritySchedule(queue) {

    if (!Array.isArray(queue)) {
        return [];
    }

    return [...queue].sort(
        compareTransportPriority
    );
}


/* =========================================================
   FCFS SCHEDULING
   ========================================================= */

function fcfsSchedule(queue) {

    if (!Array.isArray(queue)) {
        return [];
    }

    return [...queue].sort(function (a, b) {

        return (
            Number(a.arrivalOrder || 0) -
            Number(b.arrivalOrder || 0)
        );

    });
}


/* =========================================================
   HYBRID SCHEDULING
   PRIORITY + FCFS
   ========================================================= */

function scheduleTransportQueue(queue) {

    if (!Array.isArray(queue)) {
        return [];
    }

    const scheduled =
        prioritySchedule(queue);

    /*
       First:
       Higher priority cargo is selected.

       Second:
       If priority is equal,
       FCFS determines the order.
    */

    return scheduled.map(
        function (item, index) {

            return {
                ...item,

                queuePosition:
                    index + 1,

                schedulingMethod:
                    TRANSPORT_ALGORITHM_CONFIG
                        .schedulingMethod
            };

        }
    );
}


/* =========================================================
   FIND USER CARGO
   ========================================================= */

function findUserCargo(queue) {

    if (!Array.isArray(queue)) {
        return null;
    }

    return (
        queue.find(function (item) {

            return (
                item.isCurrentUser === true ||
                item.isCurrentUser === "true"
            );

        }) || null
    );
}


/* =========================================================
   GET QUEUE POSITION
   ========================================================= */

function getQueuePosition(
    queue,
    cargoId
) {

    const scheduled =
        scheduleTransportQueue(queue);

    const index =
        scheduled.findIndex(function (item) {

            return item.id === cargoId;

        });

    return index >= 0
        ? index + 1
        : null;
}


/* =========================================================
   WHY IS CARGO WAITING?
   ========================================================= */

function explainWaitingCargo(
    queue,
    cargoId
) {

    const scheduled =
        scheduleTransportQueue(queue);

    const currentIndex =
        scheduled.findIndex(function (item) {

            return item.id === cargoId;

        });


    if (currentIndex === -1) {

        return {
            waiting: false,
            reason: "Cargo was not found in the transport queue.",
            higherPriorityCargo: [],
            samePriorityAhead: [],
            queuePosition: null
        };

    }


    const currentCargo =
        scheduled[currentIndex];


    const higherPriorityCargo =
        scheduled.filter(function (item) {

            return (
                getPriorityValue(item.priority) <
                getPriorityValue(currentCargo.priority) &&
                item.status !== "COMPLETED"
            );

        });


    const samePriorityAhead =
        scheduled.filter(function (item) {

            return (
                getPriorityValue(item.priority) ===
                getPriorityValue(currentCargo.priority) &&
                Number(item.arrivalOrder || 0) <
                Number(currentCargo.arrivalOrder || 0)
            );

        });


    const waiting =
        currentCargo.status === "WAITING";


    let reason =
        "Cargo is ready for dispatch.";


    if (waiting) {

        if (higherPriorityCargo.length > 0) {

            reason =
                `${higherPriorityCargo.length} higher-priority shipment(s) are ahead of your cargo.`;

        }

        else if (samePriorityAhead.length > 0) {

            reason =
                "Cargo has the same priority as shipments ahead, so FCFS order is being followed.";

        }

        else {

            reason =
                "Cargo is waiting for the next available transport slot.";

        }

    }


    return {

        waiting: waiting,

        reason: reason,

        queuePosition:
            currentIndex + 1,

        priority:
            currentCargo.priority,

        higherPriorityCargo:
            higherPriorityCargo,

        samePriorityAhead:
            samePriorityAhead,

        schedulingMethod:
            TRANSPORT_ALGORITHM_CONFIG
                .schedulingMethod

    };
}


/* =========================================================
   PRIORITY CLASSIFICATION
   ========================================================= */

function classifyCargoPriority(cargo) {

    if (!cargo) {
        return "P3";
    }


    /*
       Emergency and life-critical cargo
       receives P1.
    */

    if (
        cargo.emergency === true ||
        cargo.isEmergency === true ||
        cargo.cargoType === "Medical Supplies" ||
        cargo.cargoType === "Emergency Relief"
    ) {

        return "P1";

    }


    /*
       Essential / time-sensitive cargo
       receives P2.
    */

    if (
        cargo.urgent === true ||
        cargo.timeSensitive === true ||
        cargo.cargoType === "Food Supplies" ||
        cargo.cargoType === "Essential Goods"
    ) {

        return "P2";

    }


    /*
       Normal cargo
       receives P3.
    */

    return "P3";
}


/* =========================================================
   EMERGENCY INSERTION
   ========================================================= */

function insertEmergencyTransport(
    queue,
    emergencyCargo
) {

    if (!Array.isArray(queue)) {
        queue = [];
    }


    const emergency = {

        ...emergencyCargo,

        priority: "P1",

        status:
            emergencyCargo.status ||
            "MOVING",

        emergency: true,

        schedulingMethod:
            TRANSPORT_ALGORITHM_CONFIG
                .schedulingMethod,

        arrivalOrder:
            emergencyCargo.arrivalOrder ||
            Date.now()

    };


    const updatedQueue = [
        ...queue,
        emergency
    ];


    return scheduleTransportQueue(
        updatedQueue
    );
}


/* =========================================================
   15-MINUTE PRIORITY WINDOW
   ========================================================= */

function checkPriorityWindow(
    currentCargo,
    nextCargo,
    gapMinutes
) {

    const configuredWindow =
        Number(
            localStorage.getItem(
                "smartTransportPriorityWindow"
            )
        ) ||
        TRANSPORT_ALGORITHM_CONFIG
            .priorityWindowMinutes;


    const actualGap =
        Number(gapMinutes);


    if (Number.isNaN(actualGap)) {

        return {

            allowed: false,

            reason:
                "Invalid scheduling time gap."

        };

    }


    /*
       If the gap is below the configured
       priority window, the higher-priority
       shipment should be considered first.
    */

    if (
        actualGap <
        configuredWindow
    ) {

        return {

            allowed: false,

            reason:
                `Priority window active: ${actualGap} minutes is below the ${configuredWindow}-minute threshold.`

        };

    }


    return {

        allowed: true,

        reason:
            `Scheduling gap of ${actualGap} minutes satisfies the ${configuredWindow}-minute priority window.`

    };
}


/* =========================================================
   TEST 15-MINUTE RULE
   ========================================================= */

function testPriorityWindow(
    gapMinutes
) {

    const result =
        checkPriorityWindow(
            {},
            {},
            gapMinutes
        );


    return {

        gapMinutes:
            Number(gapMinutes),

        threshold:
            Number(
                localStorage.getItem(
                    "smartTransportPriorityWindow"
                )
            ) ||
            TRANSPORT_ALGORITHM_CONFIG
                .priorityWindowMinutes,

        allowed:
            result.allowed,

        message:
            result.reason

    };
}


/* =========================================================
   GET NEXT TRANSPORT
   ========================================================= */

function getNextTransport(queue) {

    const scheduled =
        scheduleTransportQueue(queue);


    if (scheduled.length === 0) {
        return null;
    }


    /*
       Ignore completed shipments.
    */

    const active =
        scheduled.filter(function (item) {

            return (
                String(item.status)
                    .toUpperCase() !==
                "COMPLETED"
            );

        });


    return active.length > 0
        ? active[0]
        : null;
}


/* =========================================================
   MARK TRANSPORT MOVING
   ========================================================= */

function markTransportMoving(
    queue,
    cargoId
) {

    if (!Array.isArray(queue)) {
        return [];
    }


    return queue.map(function (item) {

        if (item.id === cargoId) {

            return {

                ...item,

                status: "MOVING"

            };

        }

        return item;

    });

}


/* =========================================================
   MARK TRANSPORT COMPLETED
   ========================================================= */

function markTransportCompleted(
    queue,
    cargoId
) {

    if (!Array.isArray(queue)) {
        return [];
    }


    return queue.map(function (item) {

        if (item.id === cargoId) {

            return {

                ...item,

                status: "COMPLETED"

            };

        }

        return item;

    });

}


/* =========================================================
   QUEUE STATISTICS
   ========================================================= */

function getQueueStatistics(queue) {

    if (!Array.isArray(queue)) {

        return {

            total: 0,
            moving: 0,
            waiting: 0,
            completed: 0,
            p1: 0,
            p2: 0,
            p3: 0

        };

    }


    return {

        total:
            queue.length,

        moving:
            queue.filter(function (item) {

                return item.status === "MOVING";

            }).length,

        waiting:
            queue.filter(function (item) {

                return item.status === "WAITING";

            }).length,

        completed:
            queue.filter(function (item) {

                return item.status === "COMPLETED";

            }).length,

        p1:
            queue.filter(function (item) {

                return item.priority === "P1";

            }).length,

        p2:
            queue.filter(function (item) {

                return item.priority === "P2";

            }).length,

        p3:
            queue.filter(function (item) {

                return item.priority === "P3";

            }).length

    };
}


/* =========================================================
   ROUTE FEASIBILITY
   ========================================================= */

function analyseTransportRoute(
    origin,
    destination,
    transportType = "Traveller"
) {

    if (!origin || !destination) {

        return {

            feasible: false,

            score: 0,

            recommendation:
                "Please select both origin and destination."

        };

    }


    if (
        String(origin).toLowerCase() ===
        String(destination).toLowerCase()
    ) {

        return {

            feasible: false,

            score: 0,

            recommendation:
                "Origin and destination must be different."

        };

    }


    /*
       Frontend baseline.
       Live map / weather / traffic APIs
       can later replace these values.
    */

    const northeastRoutes = [

        ["Guwahati", "Shillong"],
        ["Guwahati", "Dibrugarh"],
        ["Guwahati", "Silchar"],
        ["Shillong", "Tura"],
        ["Shillong", "Cherrapunji"],
        ["Imphal", "Kohima"],
        ["Imphal", "Moirang"],
        ["Kohima", "Dimapur"],
        ["Aizawl", "Lunglei"],
        ["Itanagar", "Tawang"],
        ["Agartala", "Guwahati"],
        ["Dimapur", "Kohima"]

    ];


    const directRoute =
        northeastRoutes.some(function (route) {

            return (
                (
                    route[0] === origin &&
                    route[1] === destination
                ) ||
                (
                    route[1] === origin &&
                    route[0] === destination
                )
            );

        });


    let score =
        directRoute
            ? 88
            : 76;


    if (
        transportType === "Cargo"
    ) {

        score -= 3;

    }


    return {

        feasible: true,

        score: score,

        origin: origin,

        destination: destination,

        transportType: transportType,

        directRoute: directRoute,

        recommendation:
            directRoute
                ? "Route is suitable for planned transport."
                : "Route is feasible. Live traffic, weather and road conditions should be checked before departure.",

        factors: [

            {
                name: "Route Availability",
                status: "Good"
            },

            {
                name: "Regional Connectivity",
                status: "Available"
            },

            {
                name: "Live Conditions",
                status: "Requires API data"
            }

        ]

    };
}


/* =========================================================
   AI / EXPLAINABLE ANALYSIS HOOK
   ========================================================= */

function generateExplainableAnalysis(
    data
) {

    if (!data) {

        return {

            recommendation:
                "Insufficient data for analysis.",

            factors: []

        };

    }


    const factors = [];


    if (data.route) {

        factors.push({
            factor: "Route",
            explanation:
                `Journey planned from ${data.route.origin} to ${data.route.destination}.`
        });

    }


    if (data.priority) {

        factors.push({
            factor: "Priority",
            explanation:
                `Transport classified as ${data.priority}.`
        });

    }


    if (data.weather) {

        factors.push({
            factor: "Weather",
            explanation:
                data.weather
        });

    }


    if (data.traffic) {

        factors.push({
            factor: "Traffic",
            explanation:
                data.traffic
        });

    }


    if (data.roadCondition) {

        factors.push({
            factor: "Road Condition",
            explanation:
                data.roadCondition
        });

    }


    return {

        recommendation:
            data.recommendation ||
            "Proceed after reviewing the available transport conditions.",

        score:
            data.score || 0,

        factors:
            factors

    };
}


/* =========================================================
   SAVE QUEUE
   ========================================================= */

function saveTransportQueue(queue) {

    if (!Array.isArray(queue)) {
        return false;
    }


    try {

        localStorage.setItem(
            "transportQueue",
            JSON.stringify(queue)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save transport queue:",
            error
        );

        return false;

    }
}


/* =========================================================
   LOAD QUEUE
   ========================================================= */

function loadTransportQueue() {

    try {

        const stored =
            localStorage.getItem(
                "transportQueue"
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
            "Unable to load transport queue:",
            error
        );

    }


    return [
        ...DEFAULT_TRANSPORT_QUEUE
    ];
}


/* =========================================================
   INITIALIZE DEMO QUEUE
   ========================================================= */

function initializeTransportQueue() {

    const existing =
        localStorage.getItem(
            "transportQueue"
        );


    if (!existing) {

        saveTransportQueue(
            DEFAULT_TRANSPORT_QUEUE
        );

    }

}


/* =========================================================
   FORMAT PRIORITY
   ========================================================= */

function getPriorityLabel(priority) {

    const normalized =
        String(priority || "P3")
            .toUpperCase();


    return (
        TRANSPORT_ALGORITHM_CONFIG
            .priorityNames[normalized] ||
        "Standard"
    );
}


/* =========================================================
   GET ALGORITHM EXPLANATION
   ========================================================= */

function getSchedulingExplanation() {

    return {

        algorithm:
            "Priority Scheduling",

        tieBreaker:
            "FCFS — First Come, First Served",

        priorityOrder:
            "P1 → P2 → P3",

        p1:
            "Emergency and critical transport",

        p2:
            "High-priority / time-sensitive transport",

        p3:
            "Standard transport",

        rule:
            "When two shipments have the same priority, the shipment that entered the queue first is processed first.",

        emergencyRule:
            "Emergency SOS transport is classified as P1.",

        priorityWindow:
            `${TRANSPORT_ALGORITHM_CONFIG.priorityWindowMinutes} minutes`

    };
}


/* =========================================================
   RUN DEMO SCHEDULING
   ========================================================= */

function runSchedulingDemo() {

    const queue =
        loadTransportQueue();

    const scheduled =
        scheduleTransportQueue(queue);

    const userCargo =
        findUserCargo(scheduled);


    let explanation = null;


    if (userCargo) {

        explanation =
            explainWaitingCargo(
                scheduled,
                userCargo.id
            );

    }


    return {

        queue:
            scheduled,

        userCargo:
            userCargo,

        explanation:
            explanation,

        statistics:
            getQueueStatistics(scheduled),

        algorithm:
            getSchedulingExplanation()

    };
}


/* =========================================================
   DOM DEMO INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeTransportQueue();

        /*
           Update elements only when they exist.
           This keeps algorithms.js safe to load
           on every portal page.
        */

        renderSchedulingDemo();

    }
);


/* =========================================================
   RENDER QUEUE
   ========================================================= */

function renderSchedulingDemo() {

    const container =
        document.querySelector(
            "[data-transport-queue]"
        );


    if (!container) {
        return;
    }


    const queue =
        scheduleTransportQueue(
            loadTransportQueue()
        );


    container.innerHTML = "";


    queue.forEach(function (item) {

        const row =
            document.createElement("div");

        row.className =
            "cargo-queue-item";


        if (item.isCurrentUser) {

            row.classList.add("you");

        }


        const priorityClass =
            `cargo-${String(item.priority).toLowerCase()}`;


        row.innerHTML = `

            <div class="cargo-queue-number">
                ${item.queuePosition}
            </div>

            <div class="cargo-queue-main">

                <strong>
                    ${escapeAlgorithmHTML(
                        item.cargo ||
                        item.cargoType ||
                        "Transport"
                    )}
                </strong>

                <span>
                    ${escapeAlgorithmHTML(
                        item.origin || ""
                    )}
                    →
                    ${escapeAlgorithmHTML(
                        item.destination || ""
                    )}
                </span>

            </div>

            <div class="cargo-queue-priority ${priorityClass}">
                ${escapeAlgorithmHTML(
                    item.priority || "P3"
                )}
            </div>

            <div class="cargo-queue-status">
                ${escapeAlgorithmHTML(
                    item.status || "WAITING"
                )}
            </div>

        `;


        container.appendChild(row);

    });

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function escapeAlgorithmHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.smartTransportAlgorithms = {

    config:
        TRANSPORT_ALGORITHM_CONFIG,

    defaultQueue:
        DEFAULT_TRANSPORT_QUEUE,

    getPriorityValue:
        getPriorityValue,

    compareTransportPriority:
        compareTransportPriority,

    prioritySchedule:
        prioritySchedule,

    fcfsSchedule:
        fcfsSchedule,

    scheduleTransportQueue:
        scheduleTransportQueue,

    findUserCargo:
        findUserCargo,

    getQueuePosition:
        getQueuePosition,

    explainWaitingCargo:
        explainWaitingCargo,

    classifyCargoPriority:
        classifyCargoPriority,

    insertEmergencyTransport:
        insertEmergencyTransport,

    checkPriorityWindow:
        checkPriorityWindow,

    testPriorityWindow:
        testPriorityWindow,

    getNextTransport:
        getNextTransport,

    markTransportMoving:
        markTransportMoving,

    markTransportCompleted:
        markTransportCompleted,

    getQueueStatistics:
        getQueueStatistics,

    analyseTransportRoute:
        analyseTransportRoute,

    generateExplainableAnalysis:
        generateExplainableAnalysis,

    saveTransportQueue:
        saveTransportQueue,

    loadTransportQueue:
        loadTransportQueue,

    getPriorityLabel:
        getPriorityLabel,

    getSchedulingExplanation:
        getSchedulingExplanation,

    runSchedulingDemo:
        runSchedulingDemo,

    renderSchedulingDemo:
        renderSchedulingDemo
};


/* =========================================================
   BACKWARD-COMPATIBILITY GLOBAL FUNCTIONS
   ========================================================= */

window.prioritySchedule =
    prioritySchedule;

window.fcfsSchedule =
    fcfsSchedule;

window.scheduleTransportQueue =
    scheduleTransportQueue;

window.explainWaitingCargo =
    explainWaitingCargo;

window.classifyCargoPriority =
    classifyCargoPriority;

window.checkPriorityWindow =
    checkPriorityWindow;

window.analyseTransportRoute =
    analyseTransportRoute;

window.getQueueStatistics =
    getQueueStatistics;
/* =========================================================
   NER SMART LOGISTICS
   MAP CONTROLLER + HYBRID ROUTE ANALYSIS

   THIS FILE IS THE ONLY FILE MODIFIED FOR THE ROUTING WORK.

   Existing functionality preserved:
   - Dashboard map (#map)
   - Live Map (#fullMap)
   - MapTiler base map
   - Existing demo routes
   - Existing incidents / vehicles / check-posts
   - Existing dashboard map search

   Added only to the maps:
   - Dijkstra route analysis
   - A* route analysis
   - Hybrid route selection
   - Priority + FCFS movement ordering
   - Emergency priority handling
   - Risk-weighted route costs
   - OSRM road distance / ETA / geometry
   - Route Analysis control on both maps
   ========================================================= */


/* =========================================================
   MAP PROVIDERS
   ========================================================= */

const MAPTILER_API_KEY = "EW187hoMHwh2lXSLfn35";
const OSRM_BASE_URL = "https://router.project-osrm.org";


/* =========================================================
   MAP VARIABLES
   ========================================================= */

let transportMap = null;
let fullTransportMap = null;
let activeRouteLayer = null;


/* =========================================================
   ROUTE STATE
   ========================================================= */

const routeState = {
    origin: null,
    destination: null,
    priority: "Normal",
    algorithm: null,
    dijkstra: null,
    aStar: null,
    selectedPath: null,
    routeData: null
};


/* =========================================================
   NER LOCATIONS
   ========================================================= */

const nerLocations = {
    guwahati: [26.1445, 91.7362],
    shillong: [25.5788, 91.8933],
    jowai: [25.4451, 92.2029],
    dimapur: [25.8629, 93.7536],
    kohima: [25.6751, 94.1086],
    imphal: [24.8170, 93.9368],
    senapati: [25.2670, 94.0200],
    aizawl: [23.7271, 92.7176],
    agartala: [23.8315, 91.2868],
    silchar: [24.8333, 92.7789],
    itanagar: [27.0844, 93.6053],
    tawang: [27.5861, 91.8594]
};


const nerDisplayNames = {
    guwahati: "Guwahati",
    shillong: "Shillong",
    jowai: "Jowai",
    dimapur: "Dimapur",
    kohima: "Kohima",
    imphal: "Imphal",
    senapati: "Senapati",
    aizawl: "Aizawl",
    agartala: "Agartala",
    silchar: "Silchar",
    itanagar: "Itanagar",
    tawang: "Tawang"
};


/* =========================================================
   ROAD GRAPH

   Dijkstra and A* operate on this regional corridor graph.
   OSRM supplies real road distance/time for every edge.
   ========================================================= */

const roadConnections = [
    ["guwahati", "shillong"],
    ["guwahati", "silchar"],
    ["guwahati", "dimapur"],
    ["guwahati", "itanagar"],
    ["shillong", "jowai"],
    ["shillong", "dimapur"],
    ["jowai", "silchar"],
    ["silchar", "aizawl"],
    ["silchar", "agartala"],
    ["dimapur", "kohima"],
    ["kohima", "imphal"],
    ["imphal", "senapati"],
    ["itanagar", "tawang"]
];


/* =========================================================
   ROUTE CONDITIONS

   These are the current frontend/demo conditions.
   Later your backend can replace/update these dynamically.
   ========================================================= */

const routeConditions = {
    "guwahati|shillong": {
        status: "Clear",
        risk: "Low",
        riskMultiplier: 1.00,
        blocked: false,
        message: "Route currently shown as clear."
    },

    "jowai|shillong": {
        status: "Warning",
        risk: "Moderate",
        riskMultiplier: 1.35,
        blocked: false,
        message: "Heavy rainfall may affect accessibility."
    },

    "imphal|senapati": {
        status: "Critical",
        risk: "High",
        riskMultiplier: 2.75,
        blocked: true,
        message: "Road disruption reported near Senapati."
    },

    "dimapur|kohima": {
        status: "Cargo Corridor",
        risk: "Moderate",
        riskMultiplier: 1.15,
        blocked: false,
        message: "Priority cargo corridor."
    }
};


/* =========================================================
   SCHEDULING
   Priority + FCFS

   Priority order:
   Emergency -> High -> Medium -> Normal

   FCFS is preserved within the same priority level by using
   the existing cargo table order.
   ========================================================= */

const schedulingRank = {
    Emergency: 1,
    High: 2,
    Medium: 3,
    Normal: 4
};


function cleanPriority(value) {

    const text = String(value || "").toLowerCase();

    if (text.includes("emergency")) return "Emergency";
    if (text.includes("high")) return "High";
    if (text.includes("medium")) return "Medium";

    return "Normal";
}


function getCurrentMovementQueue() {

    const rows = document.querySelectorAll("#cargoTable tr");
    const movements = [];

    rows.forEach(function (row, index) {

        const cells = row.querySelectorAll("td");

        if (cells.length < 6) return;

        const priority = cleanPriority(cells[4].innerText.trim());

        movements.push({
            rowIndex: index,
            id: cells[0].innerText.trim(),
            type: cells[1].innerText.trim(),
            name: cells[2].innerText.trim(),
            route: cells[3].innerText.trim(),
            priority,
            status: cells[5].innerText.trim(),
            priorityRank: schedulingRank[priority]
        });
    });

    movements.sort(function (a, b) {

        if (a.priorityRank !== b.priorityRank) {
            return a.priorityRank - b.priorityRank;
        }

        /* FCFS: preserve original table order. */
        return a.rowIndex - b.rowIndex;
    });

    return movements;
}


function getPriorityForRoute(origin, destination) {

    const movements = getCurrentMovementQueue();

    const originName = nerDisplayNames[origin].toLowerCase();
    const destinationName = nerDisplayNames[destination].toLowerCase();

    const match = movements.find(function (movement) {

        const route = movement.route.toLowerCase();

        return route.includes(originName) && route.includes(destinationName);
    });

    if (!match) {
        return {
            priority: "Normal",
            source: "Default"
        };
    }

    return {
        priority: match.priority,
        source: `${match.id} • ${match.status}`
    };
}


/* =========================================================
   HELPERS
   ========================================================= */

function normaliseLocationName(value) {

    if (!value) return null;

    const key = String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    if (nerLocations[key]) return key;

    return Object.keys(nerLocations).find(function (locationKey) {
        return (
            locationKey === key ||
            nerDisplayNames[locationKey].toLowerCase() === key
        );
    }) || null;
}


function routeKey(a, b) {
    return [a, b].sort().join("|");
}


function getRouteCondition(a, b) {

    return routeConditions[routeKey(a, b)] || {
        status: "Normal",
        risk: "Low",
        riskMultiplier: 1.00,
        blocked: false,
        message: "No active route disruption recorded."
    };
}


function haversineDistanceKm(a, b) {

    const R = 6371;

    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;

    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}


function formatDuration(seconds) {

    if (!Number.isFinite(seconds)) return "--";

    const minutes = Math.max(1, Math.round(seconds / 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;

    return `${hours}h ${String(mins).padStart(2, "0")}m`;
}


function formatDistance(meters) {

    if (!Number.isFinite(meters)) return "--";

    const km = meters / 1000;

    if (km < 100) return `${km.toFixed(1)} km`;

    return `${Math.round(km)} km`;
}


/* =========================================================
   MAP MARKER ICON
   ========================================================= */

function createMarkerIcon(type, symbol) {

    return L.divIcon({
        className: "",
        html: `<div class="ner-map-marker marker-${type}">${symbol}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
}


/* =========================================================
   BUILD GRAPH
   ========================================================= */

function createEmptyGraph() {

    const graph = {};

    Object.keys(nerLocations).forEach(function (location) {
        graph[location] = [];
    });

    return graph;
}


function addUndirectedEdge(graph, from, to, edgeData) {

    graph[from].push({
        to,
        ...edgeData
    });

    graph[to].push({
        to: from,
        ...edgeData
    });
}


function buildGraphFromOSRM(tableData) {

    const graph = createEmptyGraph();
    const locations = Object.keys(nerLocations);

    roadConnections.forEach(function (connection) {

        const from = connection[0];
        const to = connection[1];

        const fromIndex = locations.indexOf(from);
        const toIndex = locations.indexOf(to);

        const duration = tableData.durations?.[fromIndex]?.[toIndex];
        const distance = tableData.distances?.[fromIndex]?.[toIndex];

        if (!Number.isFinite(duration) || !Number.isFinite(distance)) {
            return;
        }

        const condition = getRouteCondition(from, to);

        addUndirectedEdge(graph, from, to, {
            duration,
            distance,
            risk: condition.risk,
            status: condition.status,
            riskMultiplier: condition.riskMultiplier,
            blocked: condition.blocked,
            message: condition.message
        });
    });

    return graph;
}


let routingGraphPromise = null;


async function loadRoutingGraph() {

    if (routingGraphPromise) return routingGraphPromise;

    routingGraphPromise = (async function () {

        const locations = Object.keys(nerLocations);

        const coordinates = locations.map(function (location) {
            const point = nerLocations[location];
            return `${point[1]},${point[0]}`;
        }).join(";");

        const url =
            `${OSRM_BASE_URL}/table/v1/driving/${coordinates}` +
            `?annotations=duration,distance`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Routing service returned ${response.status}.`);
        }

        const data = await response.json();

        if (data.code !== "Ok") {
            throw new Error(data.message || "Unable to build road graph.");
        }

        return buildGraphFromOSRM(data);

    })().catch(function (error) {

        routingGraphPromise = null;
        throw error;
    });

    return routingGraphPromise;
}


/* =========================================================
   HYBRID EDGE COST

   Base = real road travel time.
   Risk multiplier makes risky roads more expensive.
   Blocked roads are excluded from normal routing.
   ========================================================= */

function getEdgeCost(edge, priority) {

    if (edge.blocked) return Infinity;

    let cost = edge.duration * edge.riskMultiplier;

    /*
       Scheduling does NOT allow an emergency vehicle to
       ignore a dangerous road. Priority only gives critical
       movement a small preference between viable routes.
    */

    if (priority === "Emergency") cost *= 0.97;
    else if (priority === "High") cost *= 0.99;

    return cost;
}


/* =========================================================
   DIJKSTRA
   ========================================================= */

function dijkstra(graph, start, goal, priority) {

    const distances = {};
    const previous = {};
    const visited = new Set();

    Object.keys(graph).forEach(function (node) {
        distances[node] = Infinity;
        previous[node] = null;
    });

    distances[start] = 0;

    while (visited.size < Object.keys(graph).length) {

        let current = null;
        let bestDistance = Infinity;

        Object.keys(distances).forEach(function (node) {

            if (!visited.has(node) && distances[node] < bestDistance) {
                bestDistance = distances[node];
                current = node;
            }
        });

        if (!current) break;
        if (current === goal) break;

        visited.add(current);

        graph[current].forEach(function (edge) {

            const edgeCost = getEdgeCost(edge, priority);

            if (!Number.isFinite(edgeCost)) return;

            const candidate = distances[current] + edgeCost;

            if (candidate < distances[edge.to]) {
                distances[edge.to] = candidate;
                previous[edge.to] = current;
            }
        });
    }

    const path = reconstructPath(previous, start, goal);

    if (path.length === 0) return null;

    return {
        algorithm: "Dijkstra",
        path,
        cost: distances[goal]
    };
}


/* =========================================================
   A* SEARCH
   ========================================================= */

function aStar(graph, start, goal, priority) {

    const openSet = new Set([start]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    Object.keys(graph).forEach(function (node) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    });

    gScore[start] = 0;
    fScore[start] = heuristicCost(start, goal);

    while (openSet.size > 0) {

        let current = null;
        let lowestF = Infinity;

        openSet.forEach(function (node) {

            if (fScore[node] < lowestF) {
                lowestF = fScore[node];
                current = node;
            }
        });

        if (!current) break;

        if (current === goal) {
            return {
                algorithm: "A*",
                path: reconstructPath(cameFrom, start, goal),
                cost: gScore[goal]
            };
        }

        openSet.delete(current);

        graph[current].forEach(function (edge) {

            const edgeCost = getEdgeCost(edge, priority);

            if (!Number.isFinite(edgeCost)) return;

            const tentative = gScore[current] + edgeCost;

            if (tentative < gScore[edge.to]) {

                cameFrom[edge.to] = current;
                gScore[edge.to] = tentative;
                fScore[edge.to] =
                    tentative + heuristicCost(edge.to, goal);

                openSet.add(edge.to);
            }
        });
    }

    return null;
}


/* =========================================================
   A* HEURISTIC
   ========================================================= */

function heuristicCost(from, goal) {

    const distanceKm = haversineDistanceKm(
        nerLocations[from],
        nerLocations[goal]
    );

    /* Conservative upper-bound planning speed. */
    const maxSpeedKmh = 130;

    return (distanceKm / maxSpeedKmh) * 3600;
}


/* =========================================================
   RECONSTRUCT PATH
   ========================================================= */

function reconstructPath(previous, start, goal) {

    const path = [];
    let current = goal;

    while (current) {

        path.unshift(current);

        if (current === start) break;

        current = previous[current];
    }

    if (path.length === 0 || path[0] !== start) return [];

    return path;
}


/* =========================================================
   FALLBACK GRAPH

   If no completely safe path exists, blocked roads receive
   a very large penalty instead of being silently ignored.
   ========================================================= */

function getFallbackGraph(graph) {

    const fallbackGraph = createEmptyGraph();

    Object.keys(graph).forEach(function (node) {

        graph[node].forEach(function (edge) {

            fallbackGraph[node].push({
                ...edge,
                blocked: false,
                riskMultiplier: edge.blocked
                    ? Math.max(edge.riskMultiplier, 5)
                    : edge.riskMultiplier
            });
        });
    });

    return fallbackGraph;
}


/* =========================================================
   HYBRID ROUTE SOLVER

   1. Run Dijkstra.
   2. Run A*.
   3. Compare weighted costs.
   4. Select lower-cost safe route.
   5. If both fail, calculate a penalised fallback route.
   ========================================================= */

function solveHybridRoute(graph, origin, destination, priority) {

    const dijkstraResult = dijkstra(
        graph,
        origin,
        destination,
        priority
    );

    const aStarResult = aStar(
        graph,
        origin,
        destination,
        priority
    );

    let selected = null;

    if (dijkstraResult && aStarResult) {
        selected = dijkstraResult.cost <= aStarResult.cost
            ? dijkstraResult
            : aStarResult;
    } else if (dijkstraResult) {
        selected = dijkstraResult;
    } else if (aStarResult) {
        selected = aStarResult;
    }

    if (selected) {
        return {
            selected,
            dijkstra: dijkstraResult,
            aStar: aStarResult,
            fallback: false
        };
    }

    const fallback = dijkstra(
        getFallbackGraph(graph),
        origin,
        destination,
        priority
    );

    if (!fallback) return null;

    return {
        selected: fallback,
        dijkstra: dijkstraResult,
        aStar: aStarResult,
        fallback: true
    };
}


/* =========================================================
   OSRM GEOMETRY
   ========================================================= */

const geometryCache = new Map();


async function getOSRMGeometry(from, to) {

    const cacheKey = `${from}|${to}`;

    if (geometryCache.has(cacheKey)) {
        return geometryCache.get(cacheKey);
    }

    const start = nerLocations[from];
    const end = nerLocations[to];

    const coordinates =
        `${start[1]},${start[0]};${end[1]},${end[0]}`;

    const url =
        `${OSRM_BASE_URL}/route/v1/driving/${coordinates}` +
        `?overview=full&geometries=geojson&steps=false`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Route geometry request failed: ${response.status}.`);
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || !data.routes[0]) {
        throw new Error("No road geometry available.");
    }

    const route = data.routes[0];

    const geometry = {
        coordinates: route.geometry.coordinates.map(function (point) {
            return [point[1], point[0]];
        }),
        distance: route.distance,
        duration: route.duration
    };

    geometryCache.set(cacheKey, geometry);

    geometryCache.set(`${to}|${from}`, {
        ...geometry,
        coordinates: geometry.coordinates.slice().reverse()
    });

    return geometry;
}


async function getPathGeometry(path) {

    const coordinates = [];
    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < path.length - 1; i++) {

        const geometry = await getOSRMGeometry(
            path[i],
            path[i + 1]
        );

        if (i === 0) {
            coordinates.push(...geometry.coordinates);
        } else {
            coordinates.push(...geometry.coordinates.slice(1));
        }

        totalDistance += geometry.distance;
        totalDuration += geometry.duration;
    }

    return {
        coordinates,
        distance: totalDistance,
        duration: totalDuration
    };
}


/* =========================================================
   ROUTE DRAWING
   ========================================================= */

function clearActiveRoute(map) {

    if (activeRouteLayer && map && map.hasLayer(activeRouteLayer)) {
        map.removeLayer(activeRouteLayer);
    }

    activeRouteLayer = null;
}


function getRouteColour(result) {

    if (result.fallback) return "#c92828";
    if (result.risk === "High") return "#e67e22";
    if (result.risk === "Moderate") return "#d39b24";

    return "#1687a7";
}


function drawRouteOnMap(map, routeData, routeResult, priority) {

    if (!map || !routeData) return null;

    clearActiveRoute(map);

    const selectedPath = routeResult.selected.path;

    const conditionList = [];

    for (let i = 0; i < selectedPath.length - 1; i++) {
        conditionList.push(
            getRouteCondition(selectedPath[i], selectedPath[i + 1])
        );
    }

    const hasHighRisk = conditionList.some(function (condition) {
        return condition.risk === "High";
    });

    const hasModerateRisk = conditionList.some(function (condition) {
        return condition.risk === "Moderate";
    });

    let risk = "Low";

    if (hasHighRisk) risk = "High";
    else if (hasModerateRisk) risk = "Moderate";

    routeResult.risk = risk;

    routeResult.status = routeResult.fallback
        ? "Critical fallback"
        : risk === "High"
            ? "High risk"
            : risk === "Moderate"
                ? "Travel with caution"
                : "Operational";

    activeRouteLayer = L.polyline(
        routeData.coordinates,
        {
            color: getRouteColour(routeResult),
            weight: 6,
            opacity: 0.92,
            lineCap: "round",
            lineJoin: "round"
        }
    ).addTo(map);

    const dijkstraPath = routeResult.dijkstra
        ? routeResult.dijkstra.path.map(function (p) {
            return nerDisplayNames[p];
        }).join(" → ")
        : "No safe path";

    const aStarPath = routeResult.aStar
        ? routeResult.aStar.path.map(function (p) {
            return nerDisplayNames[p];
        }).join(" → ")
        : "No safe path";

    activeRouteLayer.bindPopup(
        `<strong>Hybrid Route Analysis</strong><br><br>` +
        `<b>Selected Route:</b><br>` +
        selectedPath.map(function (p) {
            return nerDisplayNames[p];
        }).join(" → ") +
        `<br><br>` +
        `<b>Algorithm Selected:</b> ${routeResult.selected.algorithm}<br>` +
        `<b>Priority:</b> ${priority}<br>` +
        `<b>Risk:</b> ${risk}<br>` +
        `<b>Status:</b> ${routeResult.status}<br>` +
        `<b>Road Distance:</b> ${formatDistance(routeData.distance)}<br>` +
        `<b>Road ETA:</b> ${formatDuration(routeData.duration)}<br><br>` +
        `<b>Dijkstra Path:</b><br>${dijkstraPath}<br><br>` +
        `<b>A* Path:</b><br>${aStarPath}`
    );

    activeRouteLayer.bindTooltip(
        `${nerDisplayNames[routeState.origin]} → ` +
        `${nerDisplayNames[routeState.destination]} | ` +
        `${formatDuration(routeData.duration)} | ${risk}`,
        { sticky: true }
    );

    activeRouteLayer.bringToFront();

    map.fitBounds(activeRouteLayer.getBounds(), {
        padding: [45, 45],
        maxZoom: 10
    });

    return activeRouteLayer;
}


/* =========================================================
   DASHBOARD TRAVEL ANALYSIS UPDATE
   ========================================================= */

/* =========================================================
   DASHBOARD TRAVEL ANALYSIS UPDATE
   ========================================================= */

function updateTravelAnalysisUI(
    origin,
    destination,
    priority,
    routeData,
    result
) {
    const routeTitle = document.querySelector(".route-title");
    const detailRoute = document.querySelector(".detail-route");
    const analysisMessage = document.querySelector(".analysis-message p");
    const recommendedAction = document.querySelector(".recommended-action p");

    if (routeTitle) {
        routeTitle.innerHTML = `${nerDisplayNames[origin]} <span>→</span> ${nerDisplayNames[destination]}`;
    }

    if (detailRoute) {
        detailRoute.innerHTML = `<span>${nerDisplayNames[origin]}</span><span>→</span><span>${nerDisplayNames[destination]}</span>`;
    }

    const durationElements = document.querySelectorAll(".travel-analysis-grid strong");

    if (durationElements.length >= 1 && routeData) {
        durationElements[0].textContent = formatDuration(routeData.duration);
    }

    const feasibility = result.fallback
        ? "No Safe Route"
        : result.risk === "High"
            ? "Travel Restricted"
            : result.risk === "Moderate"
                ? "Travel With Caution"
                : "Operational";

    if (durationElements.length >= 2) {
        durationElements[1].textContent = feasibility;
    }

    if (durationElements.length >= 3) {
        durationElements[2].textContent = result.risk;
    }

    if (analysisMessage) {
        // Render loading state while waiting for local Mistral inference
        analysisMessage.innerHTML = `<em>Generating AI route analysis via Mistral...</em>`;

        if (typeof ApiService !== "undefined") {
            ApiService.getRouteAnalysis({
                origin: nerDisplayNames[origin],
                destination: nerDisplayNames[destination],
                distance: formatDistance(routeData.distance),
                duration: formatDuration(routeData.duration),
                risk: result.risk,
                status: result.status
            }).then(aiData => {
                if (aiData && aiData.analysis) {
                    analysisMessage.innerHTML = aiData.analysis;
                } else {
                    analysisMessage.innerHTML = `Hybrid routing evaluated the corridor using <strong>Dijkstra + A*</strong>. Current priority: <strong>${priority}</strong>. Selected path: <strong>${result.selected.algorithm}</strong>.`;
                }
            });
        }
    }

    if (recommendedAction) {
        if (result.fallback) {
            recommendedAction.innerHTML = `<strong>Authority review:</strong> No completely clear path was found. The displayed route is a penalised fallback and includes a critical segment.`;
        } else if (result.risk === "High") {
            recommendedAction.innerHTML = `Avoid the high-risk corridor where possible and wait for an updated accessibility assessment.`;
        } else if (result.risk === "Moderate") {
            recommendedAction.innerHTML = `Travel with caution and monitor changing weather and road conditions.`;
        } else {
            recommendedAction.innerHTML = `Route is operational. Continue monitoring for new incidents or accessibility changes.`;
        }
    }
}
/* =========================================================
   MAP LOADING MESSAGE
   ========================================================= */

function showMapLoadingState(map, text) {

    if (!map) return;

    if (map._nerLoadingControl) {

        const element = map._nerLoadingControl
            .getContainer()
            .querySelector(".ner-loading-text");

        if (element) element.textContent = text;

        return;
    }

    const LoadingControl = L.Control.extend({

        options: {
            position: "bottomleft"
        },

        onAdd: function () {

            const container = L.DomUtil.create(
                "div",
                "leaflet-control"
            );

            container.style.background = "rgba(255,255,255,0.95)";
            container.style.padding = "6px 9px";
            container.style.borderRadius = "6px";
            container.style.fontSize = "10px";

            container.innerHTML =
                `<span class="ner-loading-text">${text}</span>`;

            return container;
        }
    });

    map._nerLoadingControl = new LoadingControl();
    map.addControl(map._nerLoadingControl);
}


function hideMapLoadingState(map) {

    if (map && map._nerLoadingControl) {
        map.removeControl(map._nerLoadingControl);
        map._nerLoadingControl = null;
    }
}


/* =========================================================
   ROUTE ANALYSIS
   ========================================================= */

async function analyseRoute(
    map,
    originInput,
    destinationInput,
    requestedPriority
) {

    const origin = normaliseLocationName(originInput);
    const destination = normaliseLocationName(destinationInput);

    if (!origin || !destination) {

        alert(
            "Route analysis supports these NER locations:\n\n" +
            Object.keys(nerDisplayNames).map(function (key) {
                return nerDisplayNames[key];
            }).join(", ")
        );

        return null;
    }

    if (origin === destination) {
        alert("Origin and destination must be different.");
        return null;
    }

    const priorityInfo = getPriorityForRoute(origin, destination);
    const priority = requestedPriority || priorityInfo.priority;

    try {

        showMapLoadingState(
            map,
            "Building route graph and analysing..."
        );

        const graph = await loadRoutingGraph();

        const result = solveHybridRoute(
            graph,
            origin,
            destination,
            priority
        );

        if (!result) {
            throw new Error(
                "No route could be found between the selected locations."
            );
        }

        const routeData = await getPathGeometry(
            result.selected.path
        );

        routeState.origin = origin;
        routeState.destination = destination;
        routeState.priority = priority;
        routeState.algorithm = result.selected.algorithm;
        routeState.dijkstra = result.dijkstra;
        routeState.aStar = result.aStar;
        routeState.selectedPath = result.selected.path;
        routeState.routeData = routeData;

        drawRouteOnMap(
            map,
            routeData,
            result,
            priority
        );

        hideMapLoadingState(map);

        updateTravelAnalysisUI(
            origin,
            destination,
            priority,
            routeData,
            result
        );

        console.log("HYBRID ROUTE ANALYSIS", {
            origin: nerDisplayNames[origin],
            destination: nerDisplayNames[destination],
            priority,
            schedulingQueue: getCurrentMovementQueue(),
            dijkstra: result.dijkstra,
            aStar: result.aStar,
            selected: result.selected,
            fallback: result.fallback,
            route: routeData
        });

        return {
            ...result,
            routeData
        };

    } catch (error) {

        console.error("Route analysis failed:", error);

        hideMapLoadingState(map);

        alert(
            "Route analysis failed.\n\n" +
            error.message
        );

        return null;
    }
}


/* =========================================================
   ROUTE PLANNER CONTROL
   ========================================================= */

function addRoutePlannerControl(map) {

    if (!map || map._nerRouteControlAdded) return;

    map._nerRouteControlAdded = true;

    const RouteControl = L.Control.extend({

        options: {
            position: "topleft"
        },

        onAdd: function () {

            const container = L.DomUtil.create(
                "div",
                "leaflet-control ner-route-control"
            );

            container.style.background = "#ffffff";
            container.style.padding = "9px";
            container.style.borderRadius = "9px";
            container.style.boxShadow =
                "0 2px 10px rgba(0,0,0,0.18)";
            container.style.width = "205px";

            container.innerHTML = `
                <div style="
                    font-size:11px;
                    font-weight:700;
                    color:#17345f;
                    margin-bottom:7px;
                ">
                    Route Analysis
                </div>

                <select
                    class="ner-route-origin"
                    style="
                        width:100%;
                        margin-bottom:5px;
                        padding:5px;
                        border:1px solid #d6deea;
                        border-radius:5px;
                        font-size:10px;
                    ">
                </select>

                <select
                    class="ner-route-destination"
                    style="
                        width:100%;
                        margin-bottom:5px;
                        padding:5px;
                        border:1px solid #d6deea;
                        border-radius:5px;
                        font-size:10px;
                    ">
                </select>

                <select
                    class="ner-route-priority"
                    style="
                        width:100%;
                        margin-bottom:6px;
                        padding:5px;
                        border:1px solid #d6deea;
                        border-radius:5px;
                        font-size:10px;
                    ">
                    <option value="Normal">
                        Normal Priority
                    </option>

                    <option value="High">
                        High Priority
                    </option>

                    <option value="Emergency">
                        Emergency Priority
                    </option>
                </select>

                <button
                    type="button"
                    class="ner-route-analyse"
                    style="
                        width:100%;
                        padding:6px;
                        border:0;
                        border-radius:5px;
                        background:#1769d1;
                        color:#ffffff;
                        font-size:10px;
                        font-weight:600;
                        cursor:pointer;
                    ">
                    Analyse Route
                </button>

                <button
                    type="button"
                    class="ner-route-clear"
                    style="
                        width:100%;
                        margin-top:5px;
                        padding:5px;
                        border:0;
                        border-radius:5px;
                        background:#eef3f9;
                        color:#18345f;
                        font-size:9px;
                        cursor:pointer;
                    ">
                    Clear Route
                </button>
            `;

            const originSelect =
                container.querySelector(".ner-route-origin");

            const destinationSelect =
                container.querySelector(".ner-route-destination");

            const prioritySelect =
                container.querySelector(".ner-route-priority");

            const analyseButton =
                container.querySelector(".ner-route-analyse");

            const clearButton =
                container.querySelector(".ner-route-clear");

            Object.keys(nerLocations).forEach(function (location) {

                const originOption =
                    document.createElement("option");

                originOption.value = location;
                originOption.textContent =
                    nerDisplayNames[location];

                originSelect.appendChild(
                    originOption
                );

                const destinationOption =
                    document.createElement("option");

                destinationOption.value = location;
                destinationOption.textContent =
                    nerDisplayNames[location];

                destinationSelect.appendChild(
                    destinationOption
                );
            });

            originSelect.value = "guwahati";
            destinationSelect.value = "shillong";

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            analyseButton.addEventListener(
                "click",
                function () {

                    analyseRoute(
                        map,
                        originSelect.value,
                        destinationSelect.value,
                        prioritySelect.value
                    );
                }
            );

            clearButton.addEventListener(
                "click",
                function () {

                    clearActiveRoute(map);
                    routeState.routeData = null;
                }
            );

            return container;
        }
    });

    map.addControl(
        new RouteControl()
    );
}


/* =========================================================
   CREATE MAP
   ========================================================= */

function createNERMap(containerId) {

    const mapElement =
        document.getElementById(containerId);

    if (!mapElement) {

        console.warn(
            `Map container #${containerId} was not found.`
        );

        return null;
    }

    if (mapElement._nerMapInstance) {
        return mapElement._nerMapInstance;
    }

    const map = L.map(
        containerId,
        {
            zoomControl: true,
            minZoom: 5,
            maxZoom: 15,
            preferCanvas: true
        }
    ).setView(
        [25.8, 92.8],
        6
    );

    L.tileLayer(
        `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
        {
            minZoom: 1,
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> ' +
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
            crossOrigin: true
        }
    ).addTo(map);

    /* Existing visual map content. */
    addDemoRoutes(map);
    addDemoIncidents(map);
    addDemoCheckposts(map);
    addDemoVehicles(map);

    /* New route analysis, only on the map. */
    addRoutePlannerControl(map);

    mapElement._nerMapInstance = map;

    setTimeout(function () {
        map.invalidateSize(true);
    }, 200);

    return map;
}


/* =========================================================
   DASHBOARD MAP
   ========================================================= */

function initialiseTransportMap() {

    const mapElement =
        document.getElementById("map");

    if (!mapElement) return;

    if (transportMap) {

        setTimeout(function () {
            transportMap.invalidateSize(true);
        }, 100);

        return;
    }

    transportMap =
        createNERMap("map");

    window.transportMap =
        transportMap;

    setupMapSearch(
        transportMap,
        "mapSearch",
        "clearMapSearch"
    );
}


/* =========================================================
   FULL LIVE MAP
   ========================================================= */

function initialiseFullTransportMap() {

    const mapElement =
        document.getElementById("fullMap");

    if (!mapElement) return;

    if (fullTransportMap) {

        setTimeout(function () {
            fullTransportMap.invalidateSize(true);
        }, 100);

        return;
    }

    fullTransportMap =
        createNERMap("fullMap");

    window.fullTransportMap =
        fullTransportMap;

    setTimeout(function () {

        if (fullTransportMap) {
            fullTransportMap.invalidateSize(true);
        }

    }, 300);
}


/* =========================================================
   EXISTING DEMO ROUTES
   ========================================================= */

function addDemoRoutes(map) {

    if (!map) return;

    L.polyline(
        [
            nerLocations.guwahati,
            nerLocations.shillong
        ],
        {
            color: "#159449",
            weight: 4,
            opacity: 0.85
        }
    ).bindPopup(
        "<strong>Guwahati → Shillong</strong><br>" +
        "Route Status: Clear"
    ).addTo(map);

    L.polyline(
        [
            nerLocations.shillong,
            nerLocations.jowai
        ],
        {
            color: "#ed9820",
            weight: 4,
            opacity: 0.9,
            dashArray: "8 7"
        }
    ).bindPopup(
        "<strong>Shillong → Jowai</strong><br>" +
        "Route Status: Warning<br>" +
        "Heavy rainfall reported"
    ).addTo(map);

    L.polyline(
        [
            nerLocations.imphal,
            nerLocations.senapati
        ],
        {
            color: "#c92828",
            weight: 5,
            opacity: 0.9,
            dashArray: "7 6"
        }
    ).bindPopup(
        "<strong>Imphal → Senapati</strong><br>" +
        "Route Status: Critical<br>" +
        "Road disruption reported"
    ).addTo(map);

    L.polyline(
        [
            nerLocations.dimapur,
            nerLocations.kohima
        ],
        {
            color: "#6847c7",
            weight: 4,
            opacity: 0.8,
            dashArray: "5 5"
        }
    ).bindPopup(
        "<strong>Dimapur → Kohima</strong><br>" +
        "Cargo transport corridor"
    ).addTo(map);
}


/* =========================================================
   MARKERS
   ========================================================= */

function addVehicleMarker(
    map,
    coordinates,
    type,
    symbol,
    title,
    description
) {

    if (!map) return;

    const marker = L.marker(
        coordinates,
        {
            icon:
                createMarkerIcon(
                    type,
                    symbol
                )
        }
    );

    marker.bindPopup(
        `<strong>${title}</strong><br>${description}`
    );

    marker.addTo(map);
}


function addDemoVehicles(map) {

    if (!map) return;

    addVehicleMarker(
        map,
        nerLocations.guwahati,
        "traveller",
        "🚗",
        "Normal Traveller",
        "Vehicle currently travelling from Guwahati"
    );

    addVehicleMarker(
        map,
        nerLocations.shillong,
        "traveller",
        "🚙",
        "Normal Traveller",
        "Vehicle currently travelling from Shillong"
    );

    addVehicleMarker(
        map,
        nerLocations.dimapur,
        "cargo",
        "🚚",
        "Cargo Transport",
        "Dimapur → Kohima<br>Priority: High"
    );

    addVehicleMarker(
        map,
        nerLocations.silchar,
        "cargo",
        "🚛",
        "Cargo Transport",
        "Silchar → Aizawl<br>Priority: Moderate"
    );
}


function addDemoIncidents(map) {

    if (!map) return;

    addVehicleMarker(
        map,
        nerLocations.senapati,
        "critical",
        "⚠",
        "Landslide Reported",
        "Road disruption reported near Senapati"
    );

    addVehicleMarker(
        map,
        [25.45, 91.95],
        "warning",
        "⚠",
        "Heavy Rainfall",
        "Heavy rainfall affecting route accessibility"
    );

    addVehicleMarker(
        map,
        [26.05, 91.92],
        "critical",
        "⚠",
        "Accident Reported",
        "Manual incident report received"
    );
}


function addDemoCheckposts(map) {

    if (!map) return;

    addVehicleMarker(
        map,
        [26.05, 91.92],
        "checkpost",
        "▲",
        "Check-post",
        "Operational"
    );

    addVehicleMarker(
        map,
        [25.72, 94.00],
        "checkpost",
        "▲",
        "Check-post",
        "Operational"
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

function parseRouteQuery(query) {

    const clean = String(query || "")
        .trim()
        .replace(/\s+/g, " ");

    let parts = null;

    if (clean.includes("→")) {

        parts = clean.split("→");

    } else if (/\s+to\s+/i.test(clean)) {

        parts = clean.split(/\s+to\s+/i);

    }

    if (!parts || parts.length < 2) return null;

    const originText =
        parts[0].trim();

    let destinationText =
        parts.slice(1)
            .join(" ")
            .trim();

    let priority = null;

    const priorityMatch =
        destinationText.match(
            /\|\s*(Emergency|High|Medium|Normal)\s*$/i
        );

    if (priorityMatch) {

        priority =
            cleanPriority(
                priorityMatch[1]
            );

        destinationText =
            destinationText
                .replace(
                    /\|\s*(Emergency|High|Medium|Normal)\s*$/i,
                    ""
                )
                .trim();
    }

    return {
        origin: originText,
        destination: destinationText,
        priority
    };
}


function setupMapSearch(
    map,
    searchId,
    clearId
) {

    const searchInput =
        document.getElementById(
            searchId
        );

    const clearButton =
        document.getElementById(
            clearId
        );

    if (!searchInput || !map) return;

    if (
        searchInput.dataset.mapSearchReady ===
        "true"
    ) {

        return;
    }

    searchInput.dataset.mapSearchReady =
        "true";

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Enter") return;

            const query =
                searchInput.value.trim();

            if (!query) return;

            const routeQuery =
                parseRouteQuery(query);

            if (routeQuery) {

                analyseRoute(
                    map,
                    routeQuery.origin,
                    routeQuery.destination,
                    routeQuery.priority
                );

                return;
            }

            const location =
                normaliseLocationName(
                    query
                );

            if (!location) {

                alert(
                    "Search a NER location or enter a route such as:\n\n" +
                    "Guwahati → Shillong\n" +
                    "Guwahati to Shillong | Emergency"
                );

                return;
            }

            map.setView(
                nerLocations[location],
                9
            );
        }
    );

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                clearActiveRoute(
                    map
                );

                map.setView(
                    [25.8, 92.8],
                    6
                );
            }
        );
    }
}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialiseTransportMap();

        const dashboardButton =
            document.querySelector(
                '.nav-item[data-section="dashboard"]'
            );

        if (dashboardButton) {

            dashboardButton.addEventListener(
                "click",
                function () {

                    setTimeout(
                        function () {

                            if (transportMap) {
                                transportMap.invalidateSize(true);
                            }

                        },
                        200
                    );
                }
            );
        }

        const liveMapButton =
            document.querySelector(
                '.nav-item[data-section="map"]'
            );

        if (liveMapButton) {

            liveMapButton.addEventListener(
                "click",
                function () {

                    setTimeout(
                        function () {

                            initialiseFullTransportMap();

                            if (fullTransportMap) {
                                fullTransportMap.invalidateSize(true);
                            }

                        },
                        250
                    );
                }
            );
        }
    }
);


/* =========================================================
   PUBLIC FUNCTIONS
   ========================================================= */

window.initialiseTransportMap =
    initialiseTransportMap;

window.initialiseFullTransportMap =
    initialiseFullTransportMap;

window.analyseRoute =
    analyseRoute;

window.getCurrentMovementQueue =
    getCurrentMovementQueue;

window.solveHybridRoute =
    solveHybridRoute;


console.log(
    "MAP.JS + HYBRID ROUTE ENGINE IS LOADED"
);
// Initialize Map (Centered on Guwahati/Northeast India)
const map = L.map('map').setView([25.8, 93.0], 7);

// Add MapTiler Layer (Replace 'YOUR_MAPTILER_KEY' with your actual key)
const mapTilerKey = 'YOUR_MAPTILER_KEY'; 
L.tileLayer(`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`, {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markers = {};
let currentRouteLayer = null;

// Standard Map Icons matching the UI
const iconConfig = L.Icon.extend({
    options: { shadowUrl: null, iconSize: [25, 41], iconAnchor: [12, 41] }
});
const blueIcon = new iconConfig({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png' });

// Add City Markers to map
for (const [city, coords] of Object.entries(cityCoords)) {
    markers[city] = L.marker([coords.lat, coords.lng], {icon: blueIcon})
        .bindPopup(`<b>${city}</b>`)
        .addTo(map);
}

// REPLACE your current analyzeRoute() function with these TWO functions:

async function analyzeRoute() {
    const source = document.getElementById('sourceCity').value;
    const dest = document.getElementById('destCity').value;
    const algo = document.getElementById('algoSelect').value;
    const statsDiv = document.getElementById('route-stats');

    if (source === dest) {
        alert("Source and destination cannot be the same.");
        return;
    }

    clearMapRoute();
    statsDiv.innerHTML = `<em>Calculating optimal route and fetching road data...</em>`;

    // 1. Run your custom A* or Dijkstra algorithm
    const result = algo === 'astar' ? aStar(routeGraph, source, dest) : dijkstra(routeGraph, source, dest);

    if (result && result.path) {
        try {
            // 2. Pass the algorithm's path to MapTiler to draw the actual roads
            await drawRouteOnRoad(result.path);
            
            statsDiv.innerHTML = `
                <strong>Status:</strong> Route Generated<br>
                <strong>Algorithm:</strong> ${algo === 'astar' ? 'A*' : 'Dijkstra'}<br>
                <strong>Path:</strong> ${result.path.join(' → ')}<br>
                <strong>Graph Distance:</strong> ${result.distance} km
            `;
            
            // Update Sidebar Data
            document.getElementById("routeOrigin").textContent = source;
            document.getElementById("routeDestination").textContent = dest;
            
        } catch (error) {
            console.error("Routing error:", error);
            statsDiv.innerHTML = `<span style="color:#d62828;">Failed to load road geometry. Check API key.</span>`;
            
            // Fallback to straight line if API fails
            const latlngs = result.path.map(city => [cityCoords[city].lat, cityCoords[city].lng]);
            activeRouteLayer = L.polyline(latlngs, { color: '#1976d2', weight: 5, dashArray: '10, 10' }).addTo(map);
            map.fitBounds(activeRouteLayer.getBounds(), { padding: [50, 50] });
        }
    } else {
        statsDiv.innerHTML = `<span style="color:#d62828;">No valid route found in the network graph.</span>`;
    }
}

// Fetches real road geometry from MapTiler Directions API
async function drawRouteOnRoad(pathArray) {
    // Format coordinates for the API: "lng,lat;lng,lat;lng,lat"
    const coordinateString = pathArray.map(city => {
        return `${cityCoords[city].lng},${cityCoords[city].lat}`;
    }).join(';');

    // MapTiler Routing API endpoint
    const url = `https://api.maptiler.com/routes/directions/driving/${coordinateString}?key=${mapTilerKey}&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
        const routeGeoJSON = data.routes[0].geometry;

        // Draw the GeoJSON road path on Leaflet
        activeRouteLayer = L.geoJSON(routeGeoJSON, {
            style: {
                color: '#1976d2',
                weight: 5,
                opacity: 0.9
            }
        }).addTo(map);

        // Zoom map to smoothly fit the new road route
        map.fitBounds(activeRouteLayer.getBounds(), { padding: [50, 50] });
    } else {
        throw new Error("No road route returned from API");
    }
}
// Draw the polyline on the map
function drawRoute(pathArray) {
    const latlngs = pathArray.map(city => [cityCoords[city].lat, cityCoords[city].lng]);
    
    currentRouteLayer = L.polyline(latlngs, {
        color: '#2e7d32', // Green path as shown in the image
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10' // Dashed line effect
    }).addTo(map);

    // Zoom map to fit the generated route
    map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
}

// Clear the drawn route
function clearRoute() {
    if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
        currentRouteLayer = null;
    }
    document.getElementById('route-stats').innerHTML = '';
    map.setView([25.8, 93.0], 7);
}
async function loadLiveBackendHazards() {
    const alerts = await ApiService.getAlerts();
    if (!alerts || !Array.isArray(alerts)) return;

    alerts.forEach(alert => {
        if (alert.coordinates && alert.coordinates.lat && alert.coordinates.lng) {
            const hazardMarker = L.divIcon({
                className: 'custom-marker',
                html: '⚠',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            L.marker([alert.coordinates.lat, alert.coordinates.lng], { icon: hazardMarker })
                .bindPopup(`
                    <strong style="color:#d62828;">${alert.hazardType} (${alert.severity})</strong><br>
                    <b>Location:</b> ${alert.locationName}<br>
                    <b>Status:</b> ${alert.roadStatus}<br>
                    <p style="margin:4px 0 0;font-size:11px;">${alert.alertSummary}</p>
                `)
                .addTo(map);
        }
    });
}
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
// Call on map load
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(loadLiveBackendHazards, 800);
});
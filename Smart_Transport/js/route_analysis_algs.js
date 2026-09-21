<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Live Transport Map | Smart Transport</title>

    <link rel="manifest" href="./manifest.json">

    <meta name="theme-color" content="#124E70">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Smart Transport">

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/portal-ui.css">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    <style>

        /* =====================================================
           LIVE MAP PAGE
        ====================================================== */

        .portal-content {
            width: 100%;
        }

        .page-intro {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 20px;
        }

        .page-intro h1 {
            margin: 4px 0 7px;
            color: #081c2c;
            font-size: 29px;
            line-height: 1.15;
        }

        .page-intro p {
            margin: 0;
            color: #6d8089;
            font-size: 14px;
            line-height: 1.6;
            max-width: 760px;
        }

        .eyebrow {
            display: inline-block;
            color: #124e70;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.4px;
        }


        .map-page-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 340px;
            gap: 20px;
            align-items: stretch;
        }

        .live-map-card {
            min-height: 650px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .map-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            padding: 16px;
            border-bottom: 1px solid rgba(255,255,255,.08);
            flex-wrap: wrap;
            background: #fff;
            z-index: 10;
        }

        .map-toolbar-left,
        .map-toolbar-right {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .map-status {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 11px;
            border-radius: 999px;
            background: rgba(46,125,50,.12);
            border: 1px solid rgba(46,125,50,.25);
            color: #7fd487;
            font-size: 12px;
            font-weight: 700;
        }

        .map-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2e7d32;
            box-shadow: 0 0 10px rgba(46,125,50,.7);
        }

        .map-placeholder {
            position: relative;
            flex: 1;
            width: 100%;
            min-height: 570px;
            background: #e5e5e5;
        }

        #map {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }

        /* Floating Routing Control Panel */
        .route-control-panel {
            position: absolute;
            top: 18px;
            left: 18px;
            z-index: 1001; /* Keep above Leaflet tiles */
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0,0,0,.10);
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,.15);
            padding: 16px;
            width: 250px;
            font-family: inherit;
        }

        .route-control-panel h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #081c2c;
            font-weight: bold;
        }

        .route-control-panel select, .route-control-panel button {
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 13px;
        }

        .route-control-panel .btn-analyse {
            background: #1976d2;
            color: white;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }

        .route-control-panel .btn-analyse:hover {
            background: #1565c0;
        }

        .route-control-panel .btn-clear {
            background: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
            cursor: pointer;
        }
        
        .route-control-panel .btn-clear:hover {
            background: #e0e0e0;
        }

        #route-stats {
            font-size: 12px;
            color: #333;
            margin-top: 5px;
            line-height: 1.4;
        }

        /* Leaflet custom marker styles to match original theme */
        .custom-marker {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 13px;
            font-weight: 800;
            border: 3px solid rgba(255,255,255,.75);
            box-shadow: 0 5px 16px rgba(0,0,0,.45);
            cursor: pointer;
        }
        .marker-city { background: #124e70; }
        .marker-traveller { background: #1976d2; }
        .marker-cargo { background: #7b3fb5; }

        .map-side-panel {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .map-side-card {
            padding: 18px;
        }

        .map-side-card h3 {
            margin: 0;
        }

        .map-side-card p {
            font-size: 12px;
            color: #aebfc9;
            line-height: 1.55;
        }

        .map-route-summary {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .map-route-point {
            display: grid;
            grid-template-columns: 18px 1fr;
            gap: 10px;
        }

        .route-point-marker {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #2e7d32;
            margin-top: 4px;
        }

        .route-point-marker.destination {
            background: #d62828;
        }

        .map-route-point strong {
            display: block;
            font-size: 13px;
        }

        .map-route-point span {
            font-size: 11px;
            color: #9db0ba;
        }

        .route-connector {
            width: 2px;
            height: 20px;
            margin-left: 4px;
            background: rgba(46,125,50,.35);
        }

        .map-kpi {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 11px 0;
            border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .map-kpi:last-child {
            border-bottom: 0;
        }

        .map-kpi span {
            color: #9db0ba;
            font-size: 12px;
        }

        .map-kpi strong {
            font-size: 13px;
        }

        .map-alert {
            padding: 12px;
            border-radius: 10px;
            background: rgba(245,158,11,.08);
            border: 1px solid rgba(245,158,11,.20);
        }

        .map-alert strong {
            display: block;
            color: #f5c76b;
            margin-bottom: 5px;
        }

        .map-alert span {
            font-size: 11px;
            line-height: 1.5;
            color: #b8c5cb;
        }

        .map-location-selector {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .map-bottom-grid {
            margin-top: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }

        .transport-status-item {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 11px 0;
            border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .transport-status-item:last-child {
            border-bottom: 0;
        }

        .status-marker {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .status-marker.blue { background: #1976d2; }
        .status-marker.purple { background: #7b3fb5; }
        .status-marker.green { background: #2e7d32; }

        .transport-status-item div {
            flex: 1;
        }

        .transport-status-item strong {
            display: block;
            font-size: 12px;
        }

        .transport-status-item span {
            font-size: 10px;
            color: #91a4ae;
        }

        .status-moving { color: #7fd487 !important; font-weight: 700; }
        .status-waiting { color: #f5c76b !important; font-weight: 700; }
        .status-offline { color: #e37b7b !important; font-weight: 700; }

        .map-refresh-time {
            font-size: 11px;
            color: #81959f;
        }

        @media (max-width: 1100px) {
            .map-page-grid { grid-template-columns: 1fr; }
            .map-side-panel { display: grid; grid-template-columns: 1fr 1fr; }
            .map-bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 700px) {
            .page-intro { flex-direction: column; }
            .page-intro h1 { font-size: 23px; }
            .live-map-card { min-height: 540px; }
            .map-placeholder { min-height: 460px; }
            .map-side-panel { grid-template-columns: 1fr; }
            .map-location-selector { grid-template-columns: 1fr; }
        }

    </style>

</head>


<body class="portal-page live-map-portal">

<header class="portal-header">
    <div class="portal-brand">
        <div class="portal-brand-logo">ST</div>
        <div class="portal-brand-text">
            <div class="portal-brand-title">SMART TRANSPORT</div>
            <div class="portal-brand-subtitle" id="portalRoleSubtitle">LIVE TRANSPORT MAP</div>
        </div>
    </div>

    <div class="portal-header-right">
        <div class="portal-system-status">
            <span class="portal-status-dot"></span>
            System Online
        </div>
        <button type="button" class="portal-header-icon portal-notification" onclick="showMapNotification()" title="Notifications">🔔</button>
        <div class="portal-profile">
            <div class="portal-profile-avatar" id="mapProfileInitial">T</div>
            <div class="portal-profile-info">
                <div class="portal-profile-name" id="mapProfileName">Traveller</div>
                <div class="portal-profile-role" id="mapProfileRole">Live Transport Map</div>
            </div>
        </div>
    </div>
</header>

<aside class="portal-sidebar" id="portalSidebar">
    <div class="portal-sidebar-section" id="mapRoleNav">
        <!-- role-specific navigation is filled by the small script below -->
    </div>
    <div class="portal-sidebar-section">
        <div class="portal-sidebar-label">Account</div>
        <a href="settings.html" data-common-link="settings">
            <span class="portal-sidebar-icon">⚙</span> Settings
        </a>
        <a href="javascript:void(0)" onclick="openSOS()" class="portal-sidebar-danger">
            <span class="portal-sidebar-icon">🚨</span> Report Emergency
        </a>
        <a href="index.html" class="portal-sidebar-danger">
            <span class="portal-sidebar-icon">↪</span> Sign Out
        </a>
    </div>
</aside>

<main class="portal-main">
<div class="portal-container">
<section class="portal-content">


            <!-- INTRO -->

            <div class="page-intro">
                <div>
                    <span class="eyebrow">LIVE MONITORING</span>
                    <h1>Northeast Transport Network</h1>
                    <p>
                        Monitor traveller movement, cargo transport,
                        route conditions and active warnings across
                        the Northeast region.
                    </p>
                </div>

                <div class="map-status">
                    <span class="map-status-dot"></span>
                    LIVE DATA
                </div>
            </div>


            <!-- =================================================
                 MAP + SIDE PANEL
            ================================================== -->

            <div class="map-page-grid">

                <!-- MAP -->
                <div class="portal-card live-map-card">
                    <div class="map-toolbar">
                        <div class="map-toolbar-left">
                            <strong>Live Transport Network</strong>
                            <span class="map-refresh-time" id="mapRefreshTime">Updated just now</span>
                        </div>
                        <div class="map-toolbar-right">
                            <button class="btn btn-small btn-outline" onclick="refreshMap()">↻ Refresh</button>
                            <button class="btn btn-small btn-primary" onclick="locateTransport()">⌖ My Route</button>
                        </div>
                    </div>

                    <!-- MAP VISUAL (Leaflet integration) -->
                    <div class="map-placeholder" id="transportMap">
                        
                        <!-- Floating Route Analysis Panel -->
                        <div class="route-control-panel">
                            <h3>Route Analysis</h3>
                            <select id="sourceCity">
                                <option value="Guwahati">Guwahati</option>
                                <option value="Shillong">Shillong</option>
                                <option value="Dimapur">Dimapur</option>
                                <option value="Kohima">Kohima</option>
                                <option value="Imphal">Imphal</option>
                                <option value="Silchar">Silchar</option>
                                <option value="Tezpur">Tezpur</option>
                            </select>
                            <select id="destCity">
                                <option value="Shillong" selected>Shillong</option>
                                <option value="Guwahati">Guwahati</option>
                                <option value="Dimapur">Dimapur</option>
                                <option value="Kohima">Kohima</option>
                                <option value="Imphal">Imphal</option>
                                <option value="Silchar">Silchar</option>
                                <option value="Tezpur">Tezpur</option>
                            </select>
                            <select id="algoSelect">
                                <option value="astar">A* Algorithm (Optimal)</option>
                                <option value="dijkstra">Dijkstra (Shortest Path)</option>
                            </select>
                            <button class="btn-analyse" onclick="analyzeRoute()">Analyse Route</button>
                            <button class="btn-clear" onclick="clearMapRoute()">Clear Route</button>
                            <div id="route-stats"></div>
                        </div>

                        <!-- Leaflet Container -->
                        <div id="map"></div>

                    </div>
                </div>


                <!-- =================================================
                     SIDE PANEL
                ================================================== -->

                <div class="map-side-panel">

                    <!-- ROUTE -->
                    <div class="portal-card map-side-card">
                        <div class="card-heading">
                            <div>
                                <span class="eyebrow">SELECTED ROUTE</span>
                                <h3>Journey Overview</h3>
                            </div>
                        </div>

                        <div class="map-route-summary">
                            <div class="map-route-point">
                                <span class="route-point-marker"></span>
                                <div>
                                    <strong id="routeOrigin">Guwahati</strong>
                                    <span>Starting point</span>
                                </div>
                            </div>
                            <div class="route-connector"></div>
                            <div class="map-route-point">
                                <span class="route-point-marker destination"></span>
                                <div>
                                    <strong id="routeDestination">Shillong</strong>
                                    <span>Destination</span>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary btn-full" style="margin-top:16px;" onclick="openRouteAnalysis()">
                            ◈ Analyse Route
                        </button>
                    </div>


                    <!-- NETWORK -->
                    <div class="portal-card map-side-card">
                        <div class="card-heading">
                            <h3>Network Overview</h3>
                            <span class="badge badge-success">LIVE</span>
                        </div>

                        <div class="map-kpi">
                            <span>Active Travellers</span>
                            <strong>128</strong>
                        </div>
                        <div class="map-kpi">
                            <span>Active Cargo</span>
                            <strong>46</strong>
                        </div>
                        <div class="map-kpi">
                            <span>Safe Routes</span>
                            <strong class="text-success">17</strong>
                        </div>
                        <div class="map-kpi">
                            <span>Warning Zones</span>
                            <strong class="text-warning">2</strong>
                        </div>
                        <div class="map-kpi">
                            <span>Critical Zones</span>
                            <strong class="text-danger">1</strong>
                        </div>
                    </div>

                    <!-- ALERT -->
                    <div class="portal-card map-side-card">
                        <div class="map-alert">
                            <strong>⚠ Route Warning</strong>
                            <span>One active restriction is currently affecting a Northeast transport corridor. Check the route before departure.</span>
                        </div>
                        <button class="btn btn-outline btn-full" style="margin-top:12px;" onclick="window.location.href='alerts.html'">
                            View All Alerts
                        </button>
                    </div>

                </div>

            </div>


            <!-- =================================================
                 LOCATION FILTER
            ================================================== -->

            <div class="portal-card" style="margin-top:20px;">
                <div class="card-heading">
                    <div>
                        <span class="eyebrow">ROUTE MONITORING</span>
                        <h2>Track a Transport Corridor</h2>
                    </div>
                </div>

                <div class="map-location-selector">
                    <div class="form-group">
                        <label for="mapOrigin">Origin</label>
                        <select id="mapOrigin">
                            <option>Guwahati</option>
                            <option>Shillong</option>
                            <option>Imphal</option>
                            <option>Kohima</option>
                            <option>Aizawl</option>
                            <option>Itanagar</option>
                            <option>Agartala</option>
                            <option>Dibrugarh</option>
                            <option>Silchar</option>
                            <option>Dimapur</option>
                            <option>Tawang</option>
                            <option>Cherrapunji</option>
                            <option>Tura</option>
                            <option>Lunglei</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="mapDestination">Destination</label>
                        <select id="mapDestination">
                            <option>Shillong</option>
                            <option>Guwahati</option>
                            <option>Imphal</option>
                            <option>Kohima</option>
                            <option>Aizawl</option>
                            <option>Itanagar</option>
                            <option>Agartala</option>
                            <option>Dibrugarh</option>
                            <option>Silchar</option>
                            <option>Dimapur</option>
                            <option>Tawang</option>
                            <option>Cherrapunji</option>
                            <option>Tura</option>
                            <option>Lunglei</option>
                        </select>
                    </div>
                </div>

                <button class="btn btn-primary" style="margin-top:14px;" onclick="selectMapRoute()">
                    ⌖ Show Route
                </button>
            </div>


            <!-- =================================================
                 BOTTOM INFORMATION
            ================================================== -->

            <div class="map-bottom-grid">

                <!-- TRAVELLERS -->
                <div class="portal-card map-side-card">
                    <div class="card-heading">
                        <h3>Traveller Movement</h3>
                        <span class="badge badge-blue">128</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker blue"></span>
                        <div>
                            <strong>Guwahati → Shillong</strong>
                            <span>Traveller vehicle</span>
                        </div>
                        <span class="status-moving">MOVING</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker blue"></span>
                        <div>
                            <strong>Imphal → Kohima</strong>
                            <span>Traveller vehicle</span>
                        </div>
                        <span class="status-moving">MOVING</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker blue"></span>
                        <div>
                            <strong>Aizawl → Silchar</strong>
                            <span>Traveller vehicle</span>
                        </div>
                        <span class="status-waiting">CAUTION</span>
                    </div>
                </div>


                <!-- CARGO -->
                <div class="portal-card map-side-card">
                    <div class="card-heading">
                        <h3>Cargo Movement</h3>
                        <span class="badge badge-blue">46</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker purple"></span>
                        <div>
                            <strong>Medical Supplies</strong>
                            <span>P1 Priority</span>
                        </div>
                        <span class="status-moving">MOVING</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker purple"></span>
                        <div>
                            <strong>Furniture</strong>
                            <span>P3 Priority</span>
                        </div>
                        <span class="status-waiting">WAITING</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker purple"></span>
                        <div>
                            <strong>General Goods</strong>
                            <span>P3 Priority</span>
                        </div>
                        <span class="status-waiting">WAITING</span>
                    </div>
                </div>

                <!-- SYSTEM -->
                <div class="portal-card map-side-card">
                    <div class="card-heading">
                        <h3>Monitoring System</h3>
                        <span class="badge badge-success">ONLINE</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker green"></span>
                        <div>
                            <strong>GPS Tracking</strong>
                            <span>Location updates</span>
                        </div>
                        <span class="status-moving">ACTIVE</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker green"></span>
                        <div>
                            <strong>Route Analysis</strong>
                            <span>AI monitoring</span>
                        </div>
                        <span class="status-moving">ACTIVE</span>
                    </div>

                    <div class="transport-status-item">
                        <span class="status-marker green"></span>
                        <div>
                            <strong>Offline Cache</strong>
                            <span>PWA storage</span>
                        </div>
                        <span class="status-moving">READY</span>
                    </div>
                </div>

            </div>


            <!-- =================================================
                 EMERGENCY
            ================================================== -->

            <div class="emergency-strip" style="margin-top:20px;">
                <div class="emergency-strip-icon">🚨</div>
                <div class="emergency-strip-content">
                    <strong>Facing an emergency?</strong>
                    <span>Report an accident, road blockage or urgent transport situation.</span>
                </div>
                <button class="btn btn-danger" onclick="openSOS()">
                    REPORT EMERGENCY
                </button>
            </div>

        </section>
</div>
</main>

<!-- =====================================================
     SCRIPTS
====================================================== -->

<script src="js/app.js"></script>
<script src="js/emergency.js"></script>
<script src="js/languages.js"></script>
<!-- Route Algorithms Import -->
<script src="js/route_analysis_algs.js"></script>
<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
/* =====================================================
   LEAFLET & MAPTILER MAP INITIALIZATION 
===================================================== */

// Initialize Leaflet Map
const map = L.map('map').setView([25.8, 93.0], 7);

// MapTiler Integration (Fallback to standard OSM if key is missing/invalid)
const mapTilerKey = 'YOUR_MAPTILER_KEY'; // Replace with actual key in production
L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`, {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    errorTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' // Fallback
}).addTo(map);

// Add custom markers for cities (using the imported cityCoords from route_analysis_algs.js)
for (const [city, coords] of Object.entries(cityCoords)) {
    const customIcon = L.divIcon({
        className: 'custom-marker marker-city',
        html: city.charAt(0),
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    L.marker([coords.lat, coords.lng], {icon: customIcon})
        .bindPopup(`<b>${city}</b>`)
        .addTo(map);
}

let activeRouteLayer = null;

function analyzeRoute() {
    const source = document.getElementById('sourceCity').value;
    const dest = document.getElementById('destCity').value;
    const algo = document.getElementById('algoSelect').value;
    const statsDiv = document.getElementById('route-stats');

    if (source === dest) {
        alert("Source and destination cannot be the same.");
        return;
    }

    clearMapRoute();

    // Call the imported functions from route_analysis_algs.js
    const result = algo === 'astar' ? aStar(routeGraph, source, dest) : dijkstra(routeGraph, source, dest);

    if (result && result.path) {
        const latlngs = result.path.map(city => [cityCoords[city].lat, cityCoords[city].lng]);
        
        activeRouteLayer = L.polyline(latlngs, {
            color: '#1976d2',
            weight: 5,
            opacity: 0.9,
            dashArray: '10, 10'
        }).addTo(map);

        map.fitBounds(activeRouteLayer.getBounds(), { padding: [50, 50] });
        
        statsDiv.innerHTML = `
            <strong>Status:</strong> Route Generated<br>
            <strong>Path:</strong> ${result.path.join(' → ')}<br>
            <strong>Distance:</strong> ${result.distance} km
        `;
        
        // Update Sidebar Data
        document.getElementById("routeOrigin").textContent = source;
        document.getElementById("routeDestination").textContent = dest;
    } else {
        statsDiv.innerHTML = `<span style="color:#d62828;">No valid route found.</span>`;
    }
}

function clearMapRoute() {
    if (activeRouteLayer) {
        map.removeLayer(activeRouteLayer);
        activeRouteLayer = null;
    }
    document.getElementById('route-stats').innerHTML = '';
    map.setView([25.8, 93.0], 7);
}


/* =====================================================
   EXISTING UTILS
===================================================== */

function refreshMap() {
    const timeElement = document.getElementById("mapRefreshTime");
    if (timeElement) {
        timeElement.textContent = "Updating...";
        setTimeout(function () {
            timeElement.textContent = "Updated just now";
        }, 800);
    }
}

function locateTransport() {
    alert("Live GPS integration can be connected here.");
}

function selectMapRoute() {
    const origin = document.getElementById("mapOrigin").value;
    const destination = document.getElementById("mapDestination").value;

    if (origin === destination) {
        alert("Please select different origin and destination locations.");
        return;
    }
    
    document.getElementById("sourceCity").value = origin;
    document.getElementById("destCity").value = destination;
    analyzeRoute();
}

function openRouteAnalysis() {
    window.location.href = "analysis.html";
}

function showMapNotification() {
    alert("Transport Network Notifications\n\n• Live transport network is online\n• 3 active alerts detected\n• 1 critical corridor requires attention");
}
</script>

<script>
(function () {
    const role = localStorage.getItem("smartTransportCurrentRole") || "traveller";
    const nav = document.getElementById("mapRoleNav");
    const subtitle = document.getElementById("portalRoleSubtitle");
    const profileName = document.getElementById("mapProfileName");
    const profileRole = document.getElementById("mapProfileRole");
    const initial = document.getElementById("mapProfileInitial");

    if (role === "cargo") {
        subtitle.textContent = "CARGO PORTAL • LIVE MAP";
        profileName.textContent = "Cargo Operator";
        profileRole.textContent = "Live Transport Map";
        initial.textContent = "C";
        nav.innerHTML = `
            <div class="portal-sidebar-label">Cargo</div>
            <a href="cargo.html"><span class="portal-sidebar-icon">⌂</span> Cargo Dashboard</a>
            <a href="cargo.html#schedule"><span class="portal-sidebar-icon">☷</span> Transport Queue</a>
            <a href="cargo.html#journey"><span class="portal-sidebar-icon">➜</span> Plan Shipment</a>
            <a href="cargo.html#cargoDetails"><span class="portal-sidebar-icon">📦</span> My Cargo</a>
            <a href="live-map.html" class="active"><span class="portal-sidebar-icon">⌖</span> Live Transport Map</a>
            <a href="cargo.html#alerts"><span class="portal-sidebar-icon">⚠</span> Cargo Alerts</a>
            <a href="cargo.html#history"><span class="portal-sidebar-icon">◷</span> Shipment History</a>`;
    } else {
        subtitle.textContent = "TRAVELLER PORTAL • LIVE MAP";
        profileName.textContent = "Traveller";
        profileRole.textContent = "Live Transport Map";
        initial.textContent = "T";
        nav.innerHTML = `
            <div class="portal-sidebar-label">Traveller</div>
            <a href="travellers.html"><span class="portal-sidebar-icon">⌂</span> My Dashboard</a>
            <a href="travellers.html#journey"><span class="portal-sidebar-icon">➜</span> Plan Journey</a>
            <a href="travellers.html#vehicle"><span class="portal-sidebar-icon">🚗</span> My Vehicle</a>
            <a href="live-map.html" class="active"><span class="portal-sidebar-icon">⌖</span> Live Transport Map</a>
            <a href="travellers.html#alerts"><span class="portal-sidebar-icon">⚠</span> My Alerts</a>
            <a href="travellers.html#history"><span class="portal-sidebar-icon">◷</span> Travel History</a>`;
    }
})();
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NER Smart Logistics</title>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/auth.css">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>

<body>

<!-- 1. Splash Screen -->
<div id="splash-screen" class="auth-screen splash-screen">
    <div class="splash-content">
        <img src="assets/logo.jpg" alt="NER Smart Logistics Logo" class="auth-logo splash-logo">
        <h1>NER Smart Logistics</h1>
        <p>AI-Based Smart Logistics and Accessibility Intelligence Platform for North Eastern Region (NER)</p>
        <div class="splash-loader" aria-label="Loading"></div>
        <span class="splash-status">Loading...</span>
    </div>
</div>

<!-- 2. Entry / Role Selection -->
<div id="entry-screen" class="auth-screen entry-screen hidden">
    <div class="entry-card">
        <img src="assets/logo.jpg" alt="NER Smart Logistics Logo" class="auth-logo entry-logo">
        <h1>NER Smart Logistics</h1>
        <p class="entry-subtitle">Government &amp; Disaster Management Portal</p>
        <p class="entry-description">Select your authorized access area to continue.</p>

        <div class="role-grid">
            <button type="button" class="role-card disaster-role" data-role="Disaster Management Team">
                <div class="role-icon">🛡</div>
                <h2>Disaster Management Team</h2>
                <p>Monitor alerts, coordinate disaster response, field teams and route conditions.</p>
                <span>Continue →</span>
            </button>

            <button type="button" class="role-card government-role" data-role="Government">
                <div class="role-icon">🏛</div>
                <h2>Government</h2>
                <p>Access logistics information, manage operations and oversee regional services.</p>
                <span>Continue →</span>
            </button>
        </div>

        <div class="authorized-note">
            🔒 This system is for authorized personnel only.
        </div>
    </div>
</div>

<!-- 3. Shared Login Page -->
<div id="login-screen" class="auth-screen login-screen hidden">
    <div class="login-card">
        <img src="assets/logo.jpg" alt="NER Smart Logistics Logo" class="auth-logo login-logo">
        <h1>Welcome Back</h1>
        <p class="login-subtitle">Sign in to continue</p>

        <div class="selected-role" id="selected-role">Access: Government / Disaster Management Team</div>

        <form id="login-form">
            <label for="username">Username / Email</label>
            <input id="username" name="username" type="text" placeholder="Enter your username or email" required>

            <label for="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" required>

            <label class="robot-check" for="robot-checkbox">
                <input id="robot-checkbox" type="checkbox">
                <span>I am not a robot</span>
                <small>Verification</small>
            </label>

            <p id="login-error" class="login-error" aria-live="polite"></p>
            <button type="submit" class="login-button">Login</button>
            <button type="button" class="back-entry-button" id="back-entry">← Back to access selection</button>
        </form>

        <div class="secure-access">🔐 Secure Access &nbsp;•&nbsp; Government of India</div>
    </div>
</div>

<div class="app" id="main-app" style="display:none;">

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <!-- Sidebar Toggle -->
        <button type="button" id="sidebarToggleBtn" class="sidebar-toggle-btn" title="Toggle Sidebar">☰</button>

        <div class="government-brand">
            <div class="emblem">🇮🇳</div>
            <div>
                <h2>Ministry of Development</h2>
                <span>North Eastern Region</span>
                <small>Government of India</small>
            </div>
        </div>

        <nav>
            <button class="nav-item active" data-section="dashboard"><span>🏠</span> <span>Dashboard</span></button>
            <button class="nav-item" data-section="map"><span>📍</span> <span>Live Map</span></button>
            <button class="nav-item" data-section="cargo"><span>📦</span> <span>Cargo & Traveller Records</span></button>
            <button class="nav-item" data-section="schedule"><span>📅</span> <span>Priority Schedule</span></button>
            <button class="nav-item" data-section="weather"><span>🌧</span> <span>Weather & Field Deployment</span></button>
            <button class="nav-item" data-section="checkposts"><span>🛡</span> <span>Check-posts</span></button>
            <button class="nav-item" data-section="server"><span>🖥</span> <span>Server Management</span></button>
            <button class="nav-item" data-section="reports"><span>📊</span> <span>Reports</span></button>
            <button class="nav-item" data-section="settings"><span>⚙️</span> <span>Settings</span></button>
        </nav>

        <div class="sidebar-footer">
            <strong>Need help?</strong>
            <p>Government operations support</p>
            <button type="button">Contact Support →</button>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">
        <header class="header">
            <div>
                <h1>Operations Dashboard</h1>
                <p>Real-time logistics and accessibility intelligence for the North Eastern Region.</p>
            </div>
            <div class="header-right">
                <span class="system-status">● System Online</span>
                <span class="notification">🔔 <b>3</b></span>
                <div class="user">Operations Team</div>
            </div>
        </header>

        <!-- DASHBOARD -->
        <section id="dashboard" class="section active">
            <div class="dashboard-heading">
                <div>
                    <h2>Executive Overview</h2>
                    <p>Regional transportation and accessibility status across the North Eastern Region.</p>
                    <small class="demo-data-note">Prototype dashboard — demonstration data</small>
                </div>
                <div class="dashboard-updated">
                    Last updated: <strong id="dashboardLastUpdated">10:24 AM</strong>
                </div>
            </div>

            <div class="overview-grid">
                <div class="overview-card"><div class="overview-icon blue-icon">👥</div><div><strong>8,420</strong><span>Active Travellers</span></div></div>
                <div class="overview-card"><div class="overview-icon green-icon">🚗</div><div><strong>5,180</strong><span>Local Travellers</span></div></div>
                <div class="overview-card"><div class="overview-icon blue-icon">🚙</div><div><strong>3,240</strong><span>Interstate Travellers</span></div></div>
                <div class="overview-card"><div class="overview-icon purple-icon">🚚</div><div><strong>1,260</strong><span>Active Cargo Transports</span></div></div>
                <div class="overview-card"><div class="overview-icon blue-icon">🚘</div><div><strong>9,680</strong><span>Vehicles Travelling</span></div></div>
                <div class="overview-card"><div class="overview-icon orange-icon">🚗</div><div><strong>214</strong><span>Pending Departures</span></div></div>
                <div class="overview-card"><div class="overview-icon red-icon">◷</div><div><strong>97</strong><span>Delayed Vehicles</span></div></div>
                <div class="overview-card"><div class="overview-icon green-icon">✓</div><div><strong>88%</strong><span>Safe Routes</span></div></div>
                <div class="overview-card"><div class="overview-icon orange-icon">⚠</div><div><strong>24</strong><span>Travel Warnings</span></div></div>

                <div class="overview-weather">
                    <div class="weather-summary-icon" id="dashboardWeatherIcon">🌧</div>
                    <div>
                        <span>NER Regional Weather</span>
                        <strong id="dashboardWeatherTime">--:-- --</strong>
                        <div class="weather-temperature" id="dashboardWeatherTemperature">--°C</div>
                        <small id="dashboardWeatherCondition">Loading weather...</small>
                    </div>
                </div>
            </div>

            <div class="dashboard-main-grid">
                <div class="dashboard-panel map-panel">
                    <div class="panel-header map-panel-header">
                        <div>
                            <h3>Live Transport Map</h3>
                            <span>NER vehicles, routes, hazards and checkpoints</span>
                        </div>
                        <div class="map-search">
                            <input type="text" id="mapSearch" placeholder="Search location, route...">
                            <button type="button" id="clearMapSearch" title="Clear search">×</button>
                        </div>
                    </div>

                    <div class="transport-map-wrapper">
                        <div id="map" aria-label="North Eastern Region transport map"></div>
                        <div class="map-legend">
                            <div><span class="legend-dot normal-dot"></span> Normal Traveller</div>
                            <div><span class="legend-dot cargo-dot"></span> Cargo Transport</div>
                            <div><span class="legend-dot clear-dot"></span> Clear Route</div>
                            <div><span class="legend-dot warning-dot"></span> Warning</div>
                            <div><span class="legend-dot critical-dot"></span> Critical / Blocked</div>
                            <div><span class="legend-symbol">●</span> Accident</div>
                            <div><span class="legend-symbol">●</span> Landslide</div>
                            <div><span class="legend-symbol">▲</span> Checkpost</div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-panel alerts-panel">
                    <div class="panel-header">
                        <h3>Recent Alerts</h3>
                        <button type="button" class="view-all-button" id="viewAllAlerts">View All</button>
                    </div>

                    <div class="recent-alerts-list">
                        <div class="recent-alert critical-alert">
                            <div class="recent-alert-icon">⚠</div>
                            <div class="recent-alert-content">
                                <strong>Landslide Reported</strong>
                                <span>NH-6, Jowai – Silchar Corridor</span>
                                <small>10:12 AM</small>
                            </div>
                            <div class="alert-status">
                                <b class="high-status">High</b>
                                <small>AI Generated</small>
                            </div>
                        </div>

                        <div class="recent-alert warning-alert">
                            <div class="recent-alert-icon">🌧</div>
                            <div class="recent-alert-content">
                                <strong>Heavy Rainfall</strong>
                                <span>Shillong – Cherrapunji</span>
                                <small>09:45 AM</small>
                            </div>
                            <div class="alert-status">
                                <b class="moderate-status">Moderate</b>
                                <small>AI Generated</small>
                            </div>
                        </div>

                        <div class="recent-alert critical-alert">
                            <div class="recent-alert-icon">⚠</div>
                            <div class="recent-alert-content">
                                <strong>Accident Reported</strong>
                                <span>Guwahati – Nagaon Corridor</span>
                                <small>08:30 AM</small>
                            </div>
                            <div class="alert-status">
                                <b class="high-status">High</b>
                                <small>Manual Report</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-bottom-grid">
                <div class="dashboard-panel travel-analysis-panel">
                    <div class="panel-header">
                        <h3>Today's Travel Analysis <span class="ai-tag">AI</span></h3>
                    </div>
                    <div class="route-title">Guwahati <span>→</span> Shillong</div>
                    <div class="travel-analysis-grid">
                        <div><strong>3h 35m</strong><span>Estimated Duration</span></div>
                        <div><strong class="caution-text">Travel With Caution</strong><span>Feasibility</span></div>
                        <div><strong class="moderate-text">Moderate</strong><span>Risk Level</span></div>
                        <button type="button" class="details-button" id="travelDetailsButton">View Details</button>
                    </div>
                </div>

                <div class="dashboard-panel scheduling-panel">
                    <div class="panel-header">
                        <h3>Scheduling Status</h3>
                    </div>
                    <div class="scheduling-content">
                        <div><span>Current Mode</span><strong>Priority Scheduling</strong><small>(&lt; 15 min gap)</small></div>
                        <div><span>Next in Queue</span><strong>4 Vehicles</strong></div>
                        <button type="button" class="details-button" id="viewQueueButton">View Queue</button>
                    </div>
                </div>

                <div class="dashboard-panel quick-actions-panel">
                    <div class="panel-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div class="quick-actions">
                        <button type="button" class="quick-action" id="addAlertAction"><span>⚠</span><small>Add Alert</small></button>
                        <button type="button" class="quick-action" id="approveTravelAction"><span>✓</span><small>Approve Travel</small></button>
                        <button type="button" class="quick-action" id="viewReportsAction"><span>▤</span><small>View Reports</small></button>
                        <button type="button" class="quick-action" id="manageScheduleAction"><span>☷</span><small>Manage Schedules</small></button>
                    </div>
                </div>
            </div>
        </section>

        <!-- MAP SECTION -->
        <section id="map-section" class="section">
            <div class="page-title">
                <h2>Live Map</h2>
                <p>Monitor routes, vehicles, hazards and check-posts.</p>
            </div>
            <div class="card large-map">
                <div id="fullMap"></div>
            </div>
        </section>

        <!-- CARGO -->
        <section id="cargo" class="section">
            <div class="page-title">
                <h2>Cargo &amp; Traveller Records</h2>
                <p>Manage traveller information, cargo manifests, permits and supporting documents.</p>
            </div>
            <div class="card">
                <div class="table-header">
                    <button id="addRecordBtn" class="blue-button">+ Add Record</button>
                    <input type="text" placeholder="Search traveller/cargo..." id="searchCargo">
                </div>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Type</th><th>Name / Cargo</th><th>Route</th><th>Priority</th><th>Status</th></tr>
                    </thead>
                    <tbody id="cargoTable">
                        <tr><td>NER-001</td><td>Emergency Cargo</td><td>Medical Supplies</td><td>Imphal → Senapati</td><td><span class="badge emergency-badge">Emergency</span></td><td>In Transit</td></tr>
                        <tr><td>NER-002</td><td>Cargo</td><td>Food Supplies</td><td>Dimapur → Kohima</td><td><span class="badge high-badge">High</span></td><td>Scheduled</td></tr>
                        <tr><td>NER-003</td><td>Traveller</td><td>Passenger Group A</td><td>Guwahati → Shillong</td><td><span class="badge normal-badge">Normal</span></td><td>Cleared</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- SCHEDULE -->
        <section id="schedule" class="section">
            <div class="page-title">
                <h2>Priority-Based Scheduling</h2>
                <p>Schedule vehicles according to cargo urgency, route accessibility and emergency conditions.</p>
            </div>
            <div class="card">
                <div class="schedule-rule">
                    <h3>Scheduling Protocol</h3>
                    <p>Emergency override is allowed only when a verified emergency is reported through the system.</p>
                    <div class="protocol">
                        <span class="protocol emergency-protocol">🚨 Emergency → Override</span>
                        <span class="protocol">🔴 High → Priority Queue</span>
                        <span class="protocol">🟠 Medium → Priority Queue</span>
                        <span class="protocol">🟢 Normal → FCFS</span>
                    </div>
                </div>
                <button class="danger-button" onclick="requestEmergencyOverride()">Request Emergency Override</button>
            </div>
        </section>

        <!-- WEATHER -->
        <section id="weather" class="section">
            <div class="page-title">
                <h2>Weather &amp; Field Deployment</h2>
                <p>Monitor weather conditions and deploy field officers based on operational requirements.</p>
            </div>
            <div class="grid-three">
                <div class="card"><h3>Rainfall</h3><strong class="large-number" id="rainfallValue">-- mm</strong><p>Last 1 hour</p></div>
                <div class="card"><h3>Field Officers</h3><strong class="large-number">12</strong><p>Active deployment</p></div>
                <div class="card"><h3>Check-posts</h3><strong class="large-number">8</strong><p>Operational</p></div>
            </div>
        </section>

        <!-- CHECKPOSTS -->
        <section id="checkposts" class="section">
            <div class="page-title">
                <h2>Check-post Management</h2>
            </div>
            <div class="card">
                <table>
                    <thead>
                        <tr><th>Check-post</th><th>Location</th><th>Status</th><th>Vehicles</th><th>Officers</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>CP-01</td><td>Imphal East</td><td>🟢 Operational</td><td>28</td><td>3</td></tr>
                        <tr><td>CP-02</td><td>Kohima</td><td>🟢 Operational</td><td>19</td><td>2</td></tr>
                        <tr><td>CP-03</td><td>Senapati</td><td>🔴 Alert</td><td>34</td><td>4</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- SERVER -->
        <section id="server" class="section">
            <div class="page-title">
                <h2>Server Management</h2>
                <p>Monitor frontend, backend and infrastructure health.</p>
            </div>
            <div class="grid-three">
                <div class="server-card"><span>Frontend</span><strong id="frontendStatus" class="green">● Online</strong><p id="frontendUptime">Uptime: 99.98%</p></div>
                <div class="server-card"><span>Backend</span><strong id="backendStatus" class="green">● Checking...</strong><p id="backendUptime">Connecting to backend...</p></div>
                <div class="server-card"><span>Database</span><strong id="databaseStatus" class="green">● Checking...</strong><p id="databaseResponse">Checking response...</p></div>
            </div>
        </section>

        <!-- REPORTS -->
        <section id="reports" class="section">
            <div class="page-title">
                <h2>Reports</h2>
                <p>Logistics, accessibility and disaster-operation reports.</p>
            </div>
            <div class="card">
                <button class="blue-button">Generate Daily Operations Report</button>
                <button class="secondary-button">Download Route Accessibility Report</button>
            </div>
        </section>

        <!-- SETTINGS -->
        <section id="settings" class="section">
            <div class="page-title">
                <h2>System Settings</h2>
                <p>Configure language, scheduling, notifications and system preferences.</p>
            </div>
            <div class="settings-grid">
                <div class="card settings-card">
                    <h3>⚙️ General Settings</h3>
                    <div class="setting-row">
                        <div><strong>Language</strong><small>Select system language</small></div>
                        <select><option>English</option><option>Hindi</option><option>Assamese</option><option>Bengali</option></select>
                    </div>
                    <div class="setting-row">
                        <div><strong>Notifications</strong><small>Transport and emergency alerts</small></div>
                        <span class="setting-status active-status">Enabled</span>
                    </div>
                </div>
                <div class="card settings-card">
                    <h3>📅 Scheduling Settings</h3>
                    <div class="setting-row">
                        <div><strong>Priority Decision Window</strong><small>Vehicle gap threshold</small></div>
                        <select><option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option></select>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- LEAFLET JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script src="js/app.js"></script>
<script src="js/map.js"></script>
<script src="js/weather.js"></script>
<script src="js/schedule.js"></script>
<script src="js/auth.js"></script>
<script src="js/government.js"></script>
<script src="js/dmt.js"></script>

<!-- RECORD MODAL -->
<div id="recordModal" class="record-modal">
    <div class="record-modal-content">
        <div class="record-modal-header">
            <div>
                <h2>Add New Record</h2>
                <p>Add traveller or cargo information</p>
            </div>
            <button id="closeRecordModal" class="modal-close">×</button>
        </div>
        <form id="recordForm">
            <div class="form-group">
                <label>Record Type</label>
                <select id="recordType" required>
                    <option value="">Select type</option>
                    <option value="Traveller">Traveller</option>
                    <option value="Cargo">Cargo</option>
                    <option value="Emergency Cargo">Emergency Cargo</option>
                </select>
            </div>
            <div class="form-group">
                <label>Name / Cargo</label>
                <input type="text" id="recordName" placeholder="e.g. Medical Supplies" required>
            </div>
            <div class="form-group">
                <label>Route</label>
                <input type="text" id="recordRoute" placeholder="e.g. Imphal → Kohima" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Priority</label>
                    <select id="recordPriority" required>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Emergency">Emergency</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="recordStatus" required>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Cleared">Cleared</option>
                    </select>
                </div>
            </div>
            <div class="record-form-actions">
                <button type="button" id="cancelRecordBtn" class="secondary-btn">Cancel</button>
                <button type="submit" class="primary-btn">Add Record</button>
            </div>
        </form>
    </div>
</div>

<!-- SINGLE ROUTE ANALYSIS DETAILS MODAL -->
<div id="travelDetailsModal" class="travel-details-modal">
    <div class="travel-details-box">
        <div class="travel-details-header">
            <h2>Route Analysis</h2>
            <button type="button" id="closeTravelDetails" class="modal-close-button">×</button>
        </div>
        <div class="travel-details-content">
            <div class="detail-route">
                <span>Guwahati</span>
                <span>→</span>
                <span>Shillong</span>
            </div>
            <div class="detail-row">
                <div>
                    <span class="detail-label">Estimated Duration</span>
                    <strong>3h 35m</strong>
                </div>
                <div>
                    <span class="detail-label">Feasibility</span>
                    <strong class="caution-text">Travel With Caution</strong>
                </div>
            </div>
            <div class="detail-row">
                <div>
                    <span class="detail-label">Risk Level</span>
                    <strong class="moderate-text">Moderate</strong>
                </div>
                <div>
                    <span class="detail-label">Current Status</span>
                    <strong>Operational</strong>
                </div>
            </div>
            <div class="analysis-message">
                <h4>AI Analysis</h4>
                <p>The route is currently operational. Travellers are advised to proceed with caution and monitor weather and road conditions.</p>
            </div>
            <div class="recommended-action">
                <h4>Recommended Action</h4>
                <p>Travel with caution and monitor route conditions.</p>
            </div>
        </div>
    </div>
</div>
async function loadData() {
    // Fetch live alerts reported across both apps
    const backendAlerts = await ApiService.getAlerts();
    if (backendAlerts && backendAlerts.length > 0) {
        incidents = backendAlerts.map(a => ({
            id: a._id || generateId("DMT-INC"),
            type: a.hazardType || "Incident",
            location: a.locationName || "Corridor",
            state: "NER",
            severity: a.severity || "Moderate",
            status: a.verifiedByDisasterTeam ? "Responding" : "Reported",
            roadStatus: a.roadStatus || "Restricted",
            description: a.alertSummary || a.rawText,
            clearance: `${a.estimatedDelayMinutes || 30} mins`,
            source: a.reporterType || "Field Unit",
            updatedAt: a.updatedAt || new Date().toISOString()
        }));
    } else {
        incidents = readArray(STORAGE.incidents, defaultIncidents());
    }

    responses = readArray(STORAGE.responses, defaultResponses());
    checkposts = readArray(STORAGE.checkposts, defaultCheckposts());
    suggestions = readArray(STORAGE.suggestions, []);
    history = readArray(STORAGE.history, defaultHistory());
}

</body>
</html>
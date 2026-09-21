/* =========================================================
   NER SMART LOGISTICS
   APPLICATION CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SIDEBAR COLLAPSE TOGGLE (UNIVERSAL)
       ===================================================== */
    const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener("click", function(e) {
            e.preventDefault();
            document.body.classList.toggle("sidebar-collapsed");
            
            // Re-render Leaflet maps smoothly when width changes
            setTimeout(function() {
                if (window.transportMap) {
                    window.transportMap.invalidateSize(true);
                }
                if (window.fullTransportMap) {
                    window.fullTransportMap.invalidateSize(true);
                }
            }, 300);
        });
    }

    /* =====================================================
       NAVIGATION
       ===================================================== */
    const navItems = document.querySelectorAll(".nav-item");
    
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            
            const sectionName = item.dataset.section;
            
            // CRITICAL FIX: Ignore clicks on DMT/Gov specific buttons
            if (!sectionName) return; 

            /* Remove active state from all sidebar items dynamically */
            document.querySelectorAll(".nav-item").forEach(nav => {
                nav.classList.remove("active");
            });

            /* Activate clicked sidebar item */
            item.classList.add("active");

            /* Hide all sections and clear any inline 'display: none' applied by gov.js */
            document.querySelectorAll(".section").forEach(section => {
                section.classList.remove("active");
                section.style.display = "none";
            });

            /* Get requested section */
            let target = document.getElementById(sectionName);

            if (sectionName === "map") {
                target = document.getElementById("map-section");
            }

            /* Show requested section and force display block */
            if (target) {
                target.classList.add("active");
                target.style.display = "block"; // This overrides the bug!

                if (sectionName === "dashboard") {
                    setTimeout(() => {
                        if (window.transportMap) {
                            window.transportMap.invalidateSize(true);
                        }
                    }, 150);
                }

                if (sectionName === "map") {
                    setTimeout(() => {
                        if (typeof window.initialiseFullTransportMap === "function") {
                            window.initialiseFullTransportMap();
                        }
                        if (window.fullTransportMap) {
                            window.fullTransportMap.invalidateSize(true);
                        }
                    }, 150);
                }
            }
        });
    });

    /* =====================================================
       CARGO SEARCH
       ===================================================== */
    const searchCargo = document.getElementById("searchCargo");

    if (searchCargo) {
        searchCargo.addEventListener("input", function () {
            const search = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll("#cargoTable tr");

            rows.forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(search) ? "" : "none";
            });
        });
    }

    /* =========================================================
       ADD RECORD FUNCTIONALITY
       ========================================================= */
    const addRecordBtn = document.getElementById("addRecordBtn");
    const recordModal = document.getElementById("recordModal");
    const closeRecordModal = document.getElementById("closeRecordModal");
    const cancelRecordBtn = document.getElementById("cancelRecordBtn");
    const recordForm = document.getElementById("recordForm");

    if (addRecordBtn) {
        addRecordBtn.addEventListener("click", function () {
            if (recordModal) recordModal.classList.add("show");
        });
    }

    function closeRecordForm() {
        if (recordModal) recordModal.classList.remove("show");
        if (recordForm) recordForm.reset();
    }

    if (closeRecordModal) closeRecordModal.addEventListener("click", closeRecordForm);
    if (cancelRecordBtn) cancelRecordBtn.addEventListener("click", closeRecordForm);

    if (recordModal) {
        recordModal.addEventListener("click", function (event) {
            if (event.target === recordModal) closeRecordForm();
        });
    }

    function generateRecordId() {
        const rows = document.querySelectorAll("#cargoTable tr");
        return "NER-" + String(rows.length + 1).padStart(3, "0");
    }

    if (recordForm) {
        recordForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const type = document.getElementById("recordType").value;
            const name = document.getElementById("recordName").value.trim();
            const route = document.getElementById("recordRoute").value.trim();
            const priority = document.getElementById("recordPriority").value;
            const status = document.getElementById("recordStatus").value;

            if (!type || !name || !route) {
                alert("Please fill in all required fields.");
                return;
            }

            let origin = route;
            let destination = "Unknown";

            if (route.includes("→")) {
                const parts = route.split("→");
                origin = parts[0].trim();
                destination = parts[1].trim();
            } else if (route.toLowerCase().includes(" to ")) {
                const parts = route.split(/ to /i);
                origin = parts[0].trim();
                destination = parts[1].trim();
            } else if (route.includes("-")) {
                const parts = route.split("-");
                origin = parts[0].trim();
                destination = parts[1].trim();
            }

            let priorityLevel = 3;
            if (priority === "Emergency") priorityLevel = 1;
            else if (priority === "High") priorityLevel = 2;
            else priorityLevel = 3;

            try {
                const accountResponse = await fetch("http://localhost:5000/api/accounts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        accountType: type,
                        primaryIdentifier: name,
                        documents: {}
                    })
                });

                const accountData = await accountResponse.json();

                if (!accountResponse.ok) {
                    throw new Error(accountData.error || "Failed to create account");
                }

                const accountId = accountData.account._id;

                const tripResponse = await fetch("http://localhost:5000/api/trips", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        accountId: accountId,
                        origin: origin,
                        destination: destination,
                        priorityLevel: priorityLevel,
                        status: status
                    })
                });

                const tripData = await tripResponse.json();

                if (!tripResponse.ok) {
                    throw new Error(tripData.error || "Failed to create trip");
                }

                const table = document.getElementById("cargoTable");
                if (table) {
                    const row = document.createElement("tr");
                    const id = generateRecordId();
                    
                    let priorityClass = "normal";
                    if (priority === "High") priorityClass = "high";
                    else if (priority === "Emergency") priorityClass = "emergency";

                    row.innerHTML = `
                        <td>${id}</td>
                        <td>${type}</td>
                        <td>${name}</td>
                        <td>${origin} → ${destination}</td>
                        <td><span class="priority-badge ${priorityClass}">${priority}</span></td>
                        <td>${status}</td>
                    `;
                    table.appendChild(row);
                }

                closeRecordForm();
                alert("Record added successfully!");

            } catch (error) {
                console.error("Add Record Error:", error);
                alert("Could not add record: " + error.message);
            }
        });
    }

    /* =====================================================
       NEW QUICK ACTIONS WIRING
       ===================================================== */
    const quickAddRecord = document.getElementById("quickAddRecord");
    if (quickAddRecord) {
        quickAddRecord.addEventListener("click", () => {
            const recordModal = document.getElementById("recordModal");
            if (recordModal) recordModal.classList.add("show");
        });
    }

    const quickEmergency = document.getElementById("quickEmergency");
    if (quickEmergency) {
        quickEmergency.addEventListener("click", () => {
            if (typeof requestEmergencyOverride === "function") {
                requestEmergencyOverride();
            }
        });
    }

    const quickLiveMap = document.getElementById("quickLiveMap");
    if (quickLiveMap) {
        quickLiveMap.addEventListener("click", () => {
            const mapBtn = document.querySelector('.nav-item[data-section="map"]');
            if (mapBtn) mapBtn.click();
        });
    }

    const quickCheckposts = document.getElementById("quickCheckposts");
    if (quickCheckposts) {
        quickCheckposts.addEventListener("click", () => {
            const cpBtn = document.querySelector('.nav-item[data-section="checkposts"]');
            if (cpBtn) cpBtn.click();
        });
    }
});

/* =========================================================
   BACKEND HEALTH MONITOR
   ========================================================= */
async function checkBackendHealth() {
    const backendStatus = document.getElementById("backendStatus");
    const backendUptime = document.getElementById("backendUptime");
    const databaseStatus = document.getElementById("databaseStatus");
    const databaseResponse = document.getElementById("databaseResponse");

    if (!backendStatus || !backendUptime || !databaseStatus || !databaseResponse) return;

    try {
        const startTime = Date.now();
        const response = await fetch("http://localhost:5000/api/health");
        const data = await response.json();
        const frontendResponseTime = Date.now() - startTime;

        if (response.ok && data.backend === "online") {
            backendStatus.textContent = "● Online";
            backendStatus.className = "green";
            const uptimeSeconds = Number(data.uptime);
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            backendUptime.textContent = `Uptime: ${hours}h ${minutes}m`;
        } else {
            backendStatus.textContent = "● Offline";
            backendStatus.className = "red";
            backendUptime.textContent = "Backend unavailable";
        }

        if (data.database === "healthy") {
            databaseStatus.textContent = "● Healthy";
            databaseStatus.className = "green";
        } else {
            databaseStatus.textContent = "● Disconnected";
            databaseStatus.className = "red";
        }

        databaseResponse.textContent = `Response: ${data.databaseResponse}`;
        
    } catch (error) {
        backendStatus.textContent = "● Offline";
        backendStatus.className = "red";
        backendUptime.textContent = "Unable to connect";
        databaseStatus.textContent = "● Unavailable";
        databaseStatus.className = "red";
        databaseResponse.textContent = "No response";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkBackendHealth();
});

/* =========================================================
   REPORTS
   ========================================================= */
function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function getReportRecords() {
    const rows = document.querySelectorAll("#cargoTable tr");
    const records = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 6) {
            records.push({
                id: cells[0].innerText.trim(),
                type: cells[1].innerText.trim(),
                name: cells[2].innerText.trim(),
                route: cells[3].innerText.trim(),
                priority: cells[4].innerText.trim(),
                status: cells[5].innerText.trim()
            });
        }
    });
    return records;
}

const reportButtons = document.querySelectorAll("#reports button");

if (reportButtons.length >= 1) {
    reportButtons[0].addEventListener("click", function () {
        const records = getReportRecords();
        const today = new Date().toLocaleDateString("en-IN");
        let report = "NER SMART LOGISTICS\nDAILY OPERATIONS REPORT\n========================================\n\n";
        report += "Date: " + today + "\nTotal Active Records: " + records.length + "\n\n";

        let emergency = 0, high = 0, normal = 0, inTransit = 0, scheduled = 0, cleared = 0;

        records.forEach(record => {
            if (record.priority.includes("Emergency")) emergency++;
            else if (record.priority.includes("High")) high++;
            else normal++;

            if (record.status.includes("In Transit")) inTransit++;
            else if (record.status.includes("Scheduled")) scheduled++;
            else if (record.status.includes("Cleared")) cleared++;
        });

        report += "OPERATION SUMMARY\n----------------------------------------\n";
        report += "Emergency Priority: " + emergency + "\nHigh Priority: " + high + "\nNormal Priority: " + normal + "\n\n";
        report += "In Transit: " + inTransit + "\nScheduled: " + scheduled + "\nCleared: " + cleared + "\n\n";
        report += "RECORD DETAILS\n========================================\n\n";

        if (records.length === 0) {
            report += "No records available.\n";
        } else {
            records.forEach(record => {
                report += `ID: ${record.id}\nType: ${record.type}\nName/Cargo: ${record.name}\nRoute: ${record.route}\nPriority: ${record.priority}\nStatus: ${record.status}\n----------------------------------------\n`;
            });
        }

        report += "\nGenerated by NER Smart Logistics Operations Dashboard.\n";
        downloadFile("NER_Daily_Operations_Report.txt", report, "text/plain");
        alert("Daily Operations Report generated successfully.");
    });
}

if (reportButtons.length >= 2) {
    reportButtons[1].addEventListener("click", function () {
        const records = getReportRecords();
        let csv = "ID,Type,Name/Cargo,Route,Priority,Status\n";

        records.forEach(record => {
            const row = [record.id, record.type, record.name, record.route, record.priority, record.status];
            csv += row.map(value => '"' + value.replace(/"/g, '""') + '"').join(",") + "\n";
        });

        downloadFile("NER_Route_Accessibility_Report.csv", csv, "text/csv");
        alert("Route Accessibility Report downloaded successfully.");
    });
}

/* =========================================================
   TRAVEL ANALYSIS DETAILS
   ========================================================= */
const travelDetailsButton = document.getElementById("travelDetailsButton");
const travelDetailsModal = document.getElementById("travelDetailsModal");
const closeTravelDetails = document.getElementById("closeTravelDetails");

if (travelDetailsButton && travelDetailsModal) {
    travelDetailsButton.addEventListener("click", function () {
        travelDetailsModal.classList.add("show");
    });
}

if (closeTravelDetails && travelDetailsModal) {
    closeTravelDetails.addEventListener("click", function () {
        travelDetailsModal.classList.remove("show");
    });
}

if (travelDetailsModal) {
    travelDetailsModal.addEventListener("click", function (event) {
        if (event.target === travelDetailsModal) {
            travelDetailsModal.classList.remove("show");
        }
    });
}
console.log("APP.JS IS LOADED");
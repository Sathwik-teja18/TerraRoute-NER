/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   EMERGENCY.JS
   Traveller OTP / Cargo Login / SOS / GPS / Emergency Queue
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getStoredArray(key) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}


function saveStoredArray(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.warn(
            `Unable to save ${key}:`,
            error
        );

        return false;
    }
}


function getStoredObject(key) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.warn(
            `Unable to read ${key}:`,
            error
        );

        return null;
    }
}


function saveStoredObject(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.warn(
            `Unable to save ${key}:`,
            error
        );

        return false;
    }
}


/* =========================================================
   TRAVELLER OTP
   ========================================================= */

function sendTravellerOTP() {

    const phoneInput =
        document.getElementById(
            "travellerPhone"
        );

    const otpInput =
        document.getElementById(
            "travellerOTP"
        );


    if (!phoneInput) {
        return false;
    }


    const phone =
        phoneInput.value.trim();


    if (!/^[6-9]\d{9}$/.test(phone)) {

        showEmergencyMessage(
            "Enter a valid 10-digit mobile number.",
            "error"
        );

        phoneInput.focus();

        return false;
    }


    /*
     * Demo OTP.
     * Backend OTP service can replace this later.
     */

    const demoOTP = "1234";


    sessionStorage.setItem(
        "smartTransportOTP",
        demoOTP
    );

    sessionStorage.setItem(
        "smartTransportOTPPhone",
        phone
    );


    if (otpInput) {

        otpInput.disabled = false;

        otpInput.focus();

    }


    showEmergencyMessage(
        "OTP sent successfully. Demo OTP: 1234",
        "success"
    );

    return true;
}


/* =========================================================
   VERIFY TRAVELLER OTP
   ========================================================= */

function verifyTravellerOTP() {

    const phoneInput =
        document.getElementById(
            "travellerPhone"
        );

    const otpInput =
        document.getElementById(
            "travellerOTP"
        );


    if (!phoneInput || !otpInput) {
        return false;
    }


    const phone =
        phoneInput.value.trim();

    const otp =
        otpInput.value.trim();


    const savedOTP =
        sessionStorage.getItem(
            "smartTransportOTP"
        );

    const savedPhone =
        sessionStorage.getItem(
            "smartTransportOTPPhone"
        );


    if (!phone || !otp) {

        showEmergencyMessage(
            "Enter your mobile number and OTP.",
            "error"
        );

        return false;
    }


    if (
        otp !== savedOTP ||
        phone !== savedPhone
    ) {

        showEmergencyMessage(
            "Invalid OTP. Please try again.",
            "error"
        );

        return false;
    }


    const loginData = {

        phone: phone,

        loginTime:
            new Date().toISOString(),

        role: "traveller"

    };


    saveStoredObject(
        "travellerLogin",
        loginData
    );


    showEmergencyMessage(
        "Traveller login verified.",
        "success"
    );


    return true;
}


/* =========================================================
   CARGO LOGIN
   ========================================================= */

function loginCargo() {

    const vehicleInput =
        document.getElementById(
            "cargoVehicle"
        );

    const passwordInput =
        document.getElementById(
            "cargoPassword"
        );


    if (
        !vehicleInput ||
        !passwordInput
    ) {
        return false;
    }


    const vehicle =
        vehicleInput.value
            .trim()
            .toUpperCase();

    const password =
        passwordInput.value;


    if (!vehicle) {

        showEmergencyMessage(
            "Enter your vehicle number.",
            "error"
        );

        vehicleInput.focus();

        return false;
    }


    if (!password) {

        showEmergencyMessage(
            "Enter your password.",
            "error"
        );

        passwordInput.focus();

        return false;
    }


    /*
     * Demo credentials.
     * Backend authentication will replace this later.
     */

    const demoVehicle =
        "AS01AB4521";

    const demoPassword =
        "cargo123";


    if (
        vehicle !== demoVehicle ||
        password !== demoPassword
    ) {

        showEmergencyMessage(
            "Invalid cargo login credentials.",
            "error"
        );

        return false;
    }


    const cargoData = {

        vehicleNumber:
            vehicle,

        loginTime:
            new Date().toISOString(),

        role:
            "cargo",

        cargoType:
            "Furniture",

        priority:
            "P3",

        origin:
            "Guwahati",

        destination:
            "Shillong",

        status:
            "Waiting",

        queuePosition:
            2,

        schedulingMethod:
            "Priority Scheduling + FCFS"

    };


    saveStoredObject(
        "cargoLogin",
        cargoData
    );

    saveStoredObject(
        "cargoData",
        cargoData
    );


    showEmergencyMessage(
        "Cargo login verified.",
        "success"
    );


    return true;
}


/* =========================================================
   CARGO LOGIN COMPATIBILITY
   ========================================================= */

function verifyCargoLogin() {

    return loginCargo();

}


/* =========================================================
   CARGO PASSWORD TOGGLE
   ========================================================= */

function toggleCargoPassword() {

    const passwordInput =
        document.getElementById(
            "cargoPassword"
        );

    const toggleButton =
        document.getElementById(
            "cargoPasswordToggle"
        );


    if (!passwordInput) {
        return;
    }


    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type =
            "text";


        if (toggleButton) {

            toggleButton.textContent =
                "Hide";

        }

    } else {

        passwordInput.type =
            "password";


        if (toggleButton) {

            toggleButton.textContent =
                "Show";

        }

    }
}


/* =========================================================
   OPEN SOS
   ========================================================= */

async function openSOS() {
    const rawReason = prompt("EMERGENCY ASSISTANCE REQUEST\nEnter incident details (accident, roadblock, landslide):");
    if (!rawReason || !rawReason.trim()) return;

    const source = document.getElementById("routeOrigin")?.textContent || "Guwahati";
    const dest = document.getElementById("routeDestination")?.textContent || "Shillong";

    const emergencyPayload = {
        reporterId: localStorage.getItem("smartTransportUser") || "LocalTraveller_01",
        reporterType: localStorage.getItem("smartTransportCurrentRole") === "cargo" ? "Cargo" : "Traveller",
        rawText: rawReason,
        hazardType: "Road Emergency",
        locationName: `${source} → ${dest} Corridor`,
        coordinates: { lat: 25.8, lng: 92.8 },
        severity: "Critical",
        roadStatus: "Partially Blocked",
        recommendedVehicleAction: "Halt and await clearance",
        estimatedDelayMinutes: 60,
        alertSummary: rawReason,
        verifiedByDisasterTeam: false
    };

    const result = await ApiService.createAlert(emergencyPayload);
    if (result && !result.error) {
        alert("Emergency report broadcasted to Regional Disaster Management Teams.");
    } else {
        alert("SOS broadcasted locally (offline cache active).");
    }
}

/* =========================================================
   CLOSE SOS
   ========================================================= */

function closeSOS() {

    const modal =
        document.getElementById(
            "sosModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );

    modal.style.display =
        "none";


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   EMERGENCY GPS LOCATION
   ========================================================= */

function captureEmergencyLocation() {

    const locationInput =
        document.getElementById(
            "sosLocation"
        );


    if (!locationInput) {
        return;
    }


    if (!navigator.geolocation) {

        locationInput.value =
            "GPS unavailable";

        return;
    }


    locationInput.placeholder =
        "Getting current location...";


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            locationInput.value =
                `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;


            locationInput.dataset.latitude =
                latitude;

            locationInput.dataset.longitude =
                longitude;


            showEmergencyMessage(
                "Current location captured.",
                "success"
            );

        },


        function () {

            locationInput.placeholder =
                "Enter your location manually";

            showEmergencyMessage(
                "GPS permission unavailable. Enter your location manually.",
                "info"
            );

        },


        {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 30000
        }

    );
}


/* =========================================================
   SUBMIT SOS
   ========================================================= */

function submitSOS(event) {

    if (event) {
        event.preventDefault();
    }


    const incidentInput =
        document.getElementById(
            "sosIncidentType"
        );

    const locationInput =
        document.getElementById(
            "sosLocation"
        );

    const descriptionInput =
        document.getElementById(
            "sosDescription"
        );

    const photoInput =
        document.getElementById(
            "sosPhoto"
        );


    const incident =
        incidentInput
            ? incidentInput.value.trim()
            : "";


    const location =
        locationInput
            ? locationInput.value.trim()
            : "";


    const description =
        descriptionInput
            ? descriptionInput.value.trim()
            : "";


    /* Validate emergency type */

    if (!incident) {

        showEmergencyMessage(
            "Please select the emergency type.",
            "error"
        );

        return false;
    }


    /* Validate location */

    if (!location) {

        showEmergencyMessage(
            "Please provide your current location.",
            "error"
        );

        return false;
    }


    /*
     * Identify logged-in user.
     */

    const travellerLogin =
        getStoredObject(
            "travellerLogin"
        );

    const cargoLogin =
        getStoredObject(
            "cargoLogin"
        );


    let userType =
        "Guest";

    let userIdentifier =
        "Unknown";


    if (travellerLogin) {

        userType =
            "Traveller";

        userIdentifier =
            travellerLogin.phone ||
            "Traveller";
    }


    if (cargoLogin) {

        userType =
            "Cargo";

        userIdentifier =
            cargoLogin.vehicleNumber ||
            "Cargo";
    }


    /*
     * Build emergency report.
     */

    const report = {

        id:
            `SOS-${Date.now()}`,

        incident:
            incident,

        location:
            location,

        description:
            description,

        userType:
            userType,

        userIdentifier:
            userIdentifier,

        latitude:
            locationInput &&
            locationInput.dataset.latitude
                ? Number(
                    locationInput.dataset.latitude
                )
                : null,

        longitude:
            locationInput &&
            locationInput.dataset.longitude
                ? Number(
                    locationInput.dataset.longitude
                )
                : null,

        photoAttached:
            !!(
                photoInput &&
                photoInput.files &&
                photoInput.files.length
            ),

        status:
            "active",

        priority:
            "P1",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    /* =====================================================
       SAVE SOS REPORT
       ===================================================== */

    const reports =
        getStoredArray(
            "sosReports"
        );


    reports.unshift(
        report
    );


    saveStoredArray(
        "sosReports",
        reports
    );


    /*
     * Keep old storage key for compatibility.
     */

    saveStoredArray(
        "smartTransportEmergencyReports",
        reports
    );


    /* =====================================================
       ADD EMERGENCY TO TRANSPORT QUEUE
       ===================================================== */

    const queue =
        getStoredArray(
            "transportQueue"
        );


    const emergencyQueueItem = {

        id:
            report.id,

        type:
            "Emergency",

        cargo:
            incident,

        priority:
            "P1",

        status:
            "MOVING",

        location:
            location,

        createdAt:
            report.createdAt,

        userType:
            userType,

        schedulingReason:
            "P1 Emergency — highest transport priority"

    };


    queue.unshift(
        emergencyQueueItem
    );


    saveStoredArray(
        "transportQueue",
        queue
    );


    /* =====================================================
       CLOSE SOS
       ===================================================== */

    closeSOS();


    /*
     * Reset SOS form.
     */

    const form =
        document.getElementById(
            "sosForm"
        );


    if (form) {
        form.reset();
    }


    /*
     * Success message.
     */

    showEmergencyMessage(
        "Emergency report submitted successfully. Help has been alerted.",
        "success"
    );


    /*
     * Update emergency badge if settings.js exists.
     */

    if (
        window.smartTransportSettings &&
        typeof window
            .smartTransportSettings
            .updateEmergencyBadge ===
            "function"
    ) {

        window.smartTransportSettings
            .updateEmergencyBadge();

    }


    /*
     * Notify other dashboard components.
     */

    window.dispatchEvent(
        new CustomEvent(
            "smartTransportEmergencyCreated",
            {
                detail: report
            }
        )
    );


    return true;
}


/* =========================================================
   EMERGENCY MESSAGE
   ========================================================= */

function showEmergencyMessage(
    message,
    type = "info"
) {

    let container =
        document.getElementById(
            "emergencyMessage"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "emergencyMessage";

        container.setAttribute(
            "role",
            "status"
        );

        container.style.position =
            "fixed";

        container.style.top =
            "20px";

        container.style.right =
            "20px";

        container.style.zIndex =
            "10000";

        container.style.maxWidth =
            "380px";

        container.style.padding =
            "14px 18px";

        container.style.borderRadius =
            "10px";

        container.style.fontWeight =
            "600";

        container.style.lineHeight =
            "1.45";

        container.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.2)";

        container.style.fontSize =
            "14px";

        document.body.appendChild(
            container
        );
    }


    container.textContent =
        message;


    if (type === "error") {

        container.style.background =
            "#D62828";

        container.style.color =
            "#FFFFFF";

    } else if (type === "success") {

        container.style.background =
            "#2E7D32";

        container.style.color =
            "#FFFFFF";

    } else if (type === "warning") {

        container.style.background =
            "#F59E0B";

        container.style.color =
            "#081C2C";

    } else {

        container.style.background =
            "#124E70";

        container.style.color =
            "#FFFFFF";
    }


    container.style.display =
        "block";


    clearTimeout(
        window.smartTransportMessageTimer
    );


    window.smartTransportMessageTimer =
        setTimeout(
            function () {

                if (container) {
                    container.style.display =
                        "none";
                }

            },
            4000
        );
}


/* =========================================================
   UPDATE EMERGENCY BADGES
   ========================================================= */

function updateEmergencyBadges() {

    const reports =
        getStoredArray(
            "sosReports"
        );


    const activeReports =
        reports.filter(
            function (report) {

                return (
                    report.status ===
                        "active" ||
                    report.status ===
                        "Active"
                );

            }
        );


    document
        .querySelectorAll(
            "[data-emergency-count]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    activeReports.length;

            }
        );


    document
        .querySelectorAll(
            ".emergency-count"
        )
        .forEach(
            function (element) {

                element.textContent =
                    activeReports.length;

            }
        );
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeSOS();

        }

    }
);


/* =========================================================
   SOS BACKDROP CLICK
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "sosModal"
            );


        if (!modal) {
            return;
        }


        if (
            event.target ===
            modal
        ) {

            closeSOS();

        }

    }
);


/* =========================================================
   EMERGENCY MANAGEMENT API
   ========================================================= */

window.sosManagement = {

    getReports:
        function () {

            return getStoredArray(
                "sosReports"
            );

        },


    getActiveReports:
        function () {

            return getStoredArray(
                "sosReports"
            ).filter(
                function (report) {

                    return (
                        report.status ===
                            "active" ||
                        report.status ===
                            "Active"
                    );

                }
            );

        },


    getReportById:
        function (id) {

            return (
                getStoredArray(
                    "sosReports"
                ).find(
                    function (report) {

                        return (
                            report.id ===
                            id
                        );

                    }
                ) || null
            );

        },


    getPendingCount:
        function () {

            return getStoredArray(
                "sosReports"
            ).filter(
                function (report) {

                    return (
                        report.status ===
                        "active"
                    );

                }
            ).length;

        },


    resolveReport:
        function (id) {

            const reports =
                getStoredArray(
                    "sosReports"
                );


            const report =
                reports.find(
                    function (item) {

                        return (
                            item.id === id
                        );

                    }
                );


            if (!report) {
                return false;
            }


            report.status =
                "resolved";

            report.updatedAt =
                new Date().toISOString();


            saveStoredArray(
                "sosReports",
                reports
            );


            saveStoredArray(
                "smartTransportEmergencyReports",
                reports
            );


            window.dispatchEvent(
                new CustomEvent(
                    "smartTransportEmergencyUpdated",
                    {
                        detail: report
                    }
                )
            );


            updateEmergencyBadges();


            return true;
        },


    clearReports:
        function () {

            localStorage.removeItem(
                "sosReports"
            );

            localStorage.removeItem(
                "smartTransportEmergencyReports"
            );

            updateEmergencyBadges();

        }

};


/* =========================================================
   GLOBAL EMERGENCY API
   ========================================================= */

window.smartTransportEmergency = {

    openSOS:
        openSOS,

    closeSOS:
        closeSOS,

    submitSOS:
        submitSOS,

    sendTravellerOTP:
        sendTravellerOTP,

    verifyTravellerOTP:
        verifyTravellerOTP,

    loginCargo:
        loginCargo,

    verifyCargoLogin:
        verifyCargoLogin,

    toggleCargoPassword:
        toggleCargoPassword,

    captureEmergencyLocation:
        captureEmergencyLocation,

    updateEmergencyBadges:
        updateEmergencyBadges

};


/* =========================================================
   INITIALIZE EMERGENCY BADGES
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateEmergencyBadges();

    }
);
const modal = document.getElementById('customEmergencyModal');
const emergencyButton = document.getElementById('yourEmergencySosButtonId'); // The red button from your UI
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const emergencyInput = document.getElementById('emergencyInput');

// Show modal when SOS is clicked
emergencyButton.addEventListener('click', () => {
  modal.classList.remove('hidden');
  emergencyInput.value = ''; // Clear previous input
  emergencyInput.focus();
});

// Hide modal on Cancel
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Handle Submit
submitBtn.addEventListener('click', () => {
  const incidentDetails = emergencyInput.value;
  if (incidentDetails.trim() !== "") {
    // Process the emergency request here (e.g., send to your backend)
    console.log("Emergency Reported:", incidentDetails);
    modal.classList.add('hidden');
  } else {
    alert("Please enter incident details."); // You can replace this with a custom error text in the modal too
  }
});
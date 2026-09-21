/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   SETTINGS.JS
   Shared Settings / Language / Notifications / Preferences
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const SETTINGS_KEYS = {
    language: "smartTransportLanguage",
    notifications: "smartTransportNotifications",
    emergencyAlerts: "smartTransportEmergencyAlerts",
    priorityWindow: "smartTransportPriorityWindow",
    offlineMode: "smartTransportOfflineMode"
};


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
    language: "en",
    notifications: true,
    emergencyAlerts: true,
    priorityWindow: 15,
    offlineMode: true
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeSettings();
    updateEmergencyBadge();
});


/* =========================================================
   INITIALIZE SETTINGS
   ========================================================= */

function initializeSettings() {

    loadLanguageSetting();
    loadNotificationSetting();
    loadEmergencyAlertSetting();
    loadPriorityWindow();
    loadOfflinePreference();

    updateGPSStatus();
    updateOfflineStatus();
    updateEmergencyBadge();
}


/* =========================================================
   HELPER
   GET ELEMENT BY MULTIPLE POSSIBLE IDS
   ========================================================= */

function getSettingElement(...ids) {

    for (const id of ids) {

        const element = document.getElementById(id);

        if (element) {
            return element;
        }
    }

    return null;
}


/* =========================================================
   LANGUAGE
   ========================================================= */

function loadLanguageSetting() {

    const languageSelect =
        getSettingElement("language", "languageSelect");

    if (!languageSelect) {
        return;
    }

    const savedLanguage =
        localStorage.getItem(SETTINGS_KEYS.language) ||
        DEFAULT_SETTINGS.language;

    languageSelect.value = savedLanguage;

    /*
       If language.js already populated the dropdown,
       this keeps the saved language selected.
    */

    languageSelect.addEventListener("change", function () {

        const language = this.value;

        localStorage.setItem(
            SETTINGS_KEYS.language,
            language
        );

        /*
           language.js owns the actual translation logic.
        */

        if (
            window.smartTransportLanguage &&
            typeof window.smartTransportLanguage.change === "function"
        ) {

            window.smartTransportLanguage.change(language);

        } else if (
            typeof window.changeLanguage === "function"
        ) {

            window.changeLanguage(language);

        }

        document.dispatchEvent(
            new CustomEvent("smartTransportLanguageChanged", {
                detail: {
                    language: language
                }
            })
        );

    });
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function loadNotificationSetting() {

    const toggle =
        getSettingElement(
            "notificationToggle",
            "notificationsToggle"
        );

    if (!toggle) {
        return;
    }

    const saved =
        localStorage.getItem(
            SETTINGS_KEYS.notifications
        );

    toggle.checked =
        saved === null
            ? DEFAULT_SETTINGS.notifications
            : saved === "true";

    updateNotificationStatus(toggle.checked);

    toggle.addEventListener("change", function () {

        localStorage.setItem(
            SETTINGS_KEYS.notifications,
            String(this.checked)
        );

        updateNotificationStatus(this.checked);

        document.dispatchEvent(
            new CustomEvent("smartTransportNotificationsChanged", {
                detail: {
                    enabled: this.checked
                }
            })
        );

    });
}


/* =========================================================
   NOTIFICATION STATUS
   ========================================================= */

function updateNotificationStatus(enabled) {

    const status =
        getSettingElement(
            "notificationStatus",
            "notificationsStatus"
        );

    if (!status) {
        return;
    }

    status.textContent =
        enabled
            ? "Notifications enabled"
            : "Notifications disabled";
}


/* =========================================================
   EMERGENCY ALERTS
   ========================================================= */

function loadEmergencyAlertSetting() {

    const toggle =
        getSettingElement(
            "emergencyAlertToggle",
            "emergencyAlertsToggle"
        );

    if (!toggle) {
        return;
    }

    const saved =
        localStorage.getItem(
            SETTINGS_KEYS.emergencyAlerts
        );

    toggle.checked =
        saved === null
            ? DEFAULT_SETTINGS.emergencyAlerts
            : saved === "true";

    updateEmergencyAlertStatus(toggle.checked);

    toggle.addEventListener("change", function () {

        localStorage.setItem(
            SETTINGS_KEYS.emergencyAlerts,
            String(this.checked)
        );

        updateEmergencyAlertStatus(this.checked);

        document.dispatchEvent(
            new CustomEvent("smartTransportEmergencyAlertsChanged", {
                detail: {
                    enabled: this.checked
                }
            })
        );

    });
}


/* =========================================================
   EMERGENCY ALERT STATUS
   ========================================================= */

function updateEmergencyAlertStatus(enabled) {

    const status =
        getSettingElement(
            "emergencyAlertStatus",
            "emergencyAlertsStatus"
        );

    if (!status) {
        return;
    }

    status.textContent =
        enabled
            ? "Emergency alerts enabled"
            : "Emergency alerts disabled";
}


/* =========================================================
   PRIORITY WINDOW
   ========================================================= */

function loadPriorityWindow() {

    const input =
        getSettingElement("priorityWindow");

    if (!input) {
        return;
    }

    const saved =
        localStorage.getItem(
            SETTINGS_KEYS.priorityWindow
        );

    let value =
        saved !== null
            ? parseInt(saved, 10)
            : DEFAULT_SETTINGS.priorityWindow;

    if (Number.isNaN(value)) {
        value = DEFAULT_SETTINGS.priorityWindow;
    }

    value = Math.max(
        1,
        Math.min(60, value)
    );

    input.value = value;

    input.addEventListener("change", function () {

        let newValue =
            parseInt(this.value, 10);

        if (Number.isNaN(newValue)) {
            newValue = DEFAULT_SETTINGS.priorityWindow;
        }

        newValue = Math.max(
            1,
            Math.min(60, newValue)
        );

        this.value = newValue;

        localStorage.setItem(
            SETTINGS_KEYS.priorityWindow,
            String(newValue)
        );

        document.dispatchEvent(
            new CustomEvent("smartTransportPriorityWindowChanged", {
                detail: {
                    minutes: newValue
                }
            })
        );

    });
}


/* =========================================================
   OFFLINE MODE
   ========================================================= */

function loadOfflinePreference() {

    /*
       Support both the new ID and the older ID.
    */

    const toggle =
        getSettingElement(
            "offlineMode",
            "offlineModeToggle"
        );

    if (!toggle) {
        return;
    }

    const saved =
        localStorage.getItem(
            SETTINGS_KEYS.offlineMode
        );

    toggle.checked =
        saved === null
            ? DEFAULT_SETTINGS.offlineMode
            : saved === "true";

    toggle.addEventListener("change", function () {

        localStorage.setItem(
            SETTINGS_KEYS.offlineMode,
            String(this.checked)
        );

        updateOfflineModeStatus(this.checked);

        document.dispatchEvent(
            new CustomEvent("smartTransportOfflineModeChanged", {
                detail: {
                    enabled: this.checked
                }
            })
        );

    });

    updateOfflineModeStatus(toggle.checked);
}


/* =========================================================
   OFFLINE MODE STATUS
   ========================================================= */

function updateOfflineModeStatus(enabled) {

    const status =
        getSettingElement(
            "offlineModeStatus"
        );

    if (!status) {
        return;
    }

    status.textContent =
        enabled
            ? "Offline-first mode enabled"
            : "Offline-first mode disabled";
}


/* =========================================================
   GPS STATUS
   ========================================================= */

function updateGPSStatus() {

    const status =
        getSettingElement("gpsStatus");

    if (!status) {
        return;
    }

    if (!navigator.geolocation) {

        status.textContent =
            "GPS unavailable";

        status.classList.remove("status-success");
        status.classList.add("status-warning");

        return;
    }

    status.textContent =
        "Checking GPS...";

    navigator.geolocation.getCurrentPosition(

        function () {

            status.textContent =
                "GPS available";

            status.classList.remove(
                "status-warning"
            );

            status.classList.add(
                "status-success"
            );

        },

        function () {

            status.textContent =
                "GPS permission required";

            status.classList.remove(
                "status-success"
            );

            status.classList.add(
                "status-warning"
            );

        },

        {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000
        }
    );
}


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

function updateOfflineStatus() {

    const status =
        getSettingElement(
            "offlineStatus",
            "networkStatus"
        );

    if (!status) {
        return;
    }

    if (navigator.onLine) {

        status.textContent =
            "Online";

        status.classList.remove(
            "status-warning"
        );

        status.classList.add(
            "status-success"
        );

    } else {

        status.textContent =
            "Offline";

        status.classList.remove(
            "status-success"
        );

        status.classList.add(
            "status-warning"
        );
    }
}


/* =========================================================
   CONNECTION EVENTS
   ========================================================= */

window.addEventListener("online", function () {

    updateOfflineStatus();

    showConnectionMessage(
        "Connection restored"
    );

});


window.addEventListener("offline", function () {

    updateOfflineStatus();

    showConnectionMessage(
        "You are currently offline"
    );

});


/* =========================================================
   CONNECTION MESSAGE
   ========================================================= */

function showConnectionMessage(message) {

    const status =
        getSettingElement(
            "connectionMessage"
        );

    if (!status) {
        return;
    }

    status.textContent = message;

    status.classList.add("visible");

    setTimeout(function () {

        status.classList.remove("visible");

    }, 3000);
}


/* =========================================================
   SETTING CONTROLS
   ========================================================= */

function initializeSettingControls() {

    const saveButtons =
        document.querySelectorAll(
            "[data-save-settings]"
        );

    saveButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                saveAllSettings();

            }
        );

    });


    const resetButtons =
        document.querySelectorAll(
            "[data-reset-settings]"
        );

    resetButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                resetSettings();

            }
        );

    });
}


/* =========================================================
   SAVE ALL SETTINGS
   ========================================================= */

function saveAllSettings() {

    const language =
        getSettingElement(
            "language",
            "languageSelect"
        );

    const notifications =
        getSettingElement(
            "notificationToggle",
            "notificationsToggle"
        );

    const emergencyAlerts =
        getSettingElement(
            "emergencyAlertToggle",
            "emergencyAlertsToggle"
        );

    const priorityWindow =
        getSettingElement(
            "priorityWindow"
        );

    const offlineMode =
        getSettingElement(
            "offlineMode",
            "offlineModeToggle"
        );


    if (language) {

        localStorage.setItem(
            SETTINGS_KEYS.language,
            language.value
        );

    }


    if (notifications) {

        localStorage.setItem(
            SETTINGS_KEYS.notifications,
            String(notifications.checked)
        );

    }


    if (emergencyAlerts) {

        localStorage.setItem(
            SETTINGS_KEYS.emergencyAlerts,
            String(emergencyAlerts.checked)
        );

    }


    if (priorityWindow) {

        let value =
            parseInt(priorityWindow.value, 10);

        if (Number.isNaN(value)) {
            value = DEFAULT_SETTINGS.priorityWindow;
        }

        value = Math.max(
            1,
            Math.min(60, value)
        );

        priorityWindow.value = value;

        localStorage.setItem(
            SETTINGS_KEYS.priorityWindow,
            String(value)
        );

    }


    if (offlineMode) {

        localStorage.setItem(
            SETTINGS_KEYS.offlineMode,
            String(offlineMode.checked)
        );

    }


    updateNotificationStatus(
        notifications
            ? notifications.checked
            : DEFAULT_SETTINGS.notifications
    );

    updateEmergencyAlertStatus(
        emergencyAlerts
            ? emergencyAlerts.checked
            : DEFAULT_SETTINGS.emergencyAlerts
    );

    updateOfflineModeStatus(
        offlineMode
            ? offlineMode.checked
            : DEFAULT_SETTINGS.offlineMode
    );


    showSettingsSavedMessage();

    document.dispatchEvent(
        new CustomEvent("smartTransportSettingsSaved")
    );
}


/* =========================================================
   SAVED MESSAGE
   ========================================================= */

function showSettingsSavedMessage() {

    const message =
        getSettingElement(
            "settingsSavedMessage"
        );

    if (!message) {

        if (
            window.smartTransportApp &&
            typeof window.smartTransportApp.toast === "function"
        ) {

            window.smartTransportApp.toast(
                "Settings saved successfully.",
                "success"
            );

        }

        return;
    }

    message.textContent =
        "Settings saved successfully.";

    message.classList.add("visible");

    setTimeout(function () {

        message.classList.remove("visible");

    }, 2500);
}


/* =========================================================
   RESET SETTINGS
   ========================================================= */

function resetSettings() {

    const confirmed =
        window.confirm(
            "Reset Smart Transport settings to default?"
        );

    if (!confirmed) {
        return;
    }


    localStorage.setItem(
        SETTINGS_KEYS.language,
        DEFAULT_SETTINGS.language
    );

    localStorage.setItem(
        SETTINGS_KEYS.notifications,
        String(DEFAULT_SETTINGS.notifications)
    );

    localStorage.setItem(
        SETTINGS_KEYS.emergencyAlerts,
        String(DEFAULT_SETTINGS.emergencyAlerts)
    );

    localStorage.setItem(
        SETTINGS_KEYS.priorityWindow,
        String(DEFAULT_SETTINGS.priorityWindow)
    );

    localStorage.setItem(
        SETTINGS_KEYS.offlineMode,
        String(DEFAULT_SETTINGS.offlineMode)
    );


    /*
       Refresh controls without reloading the page.
    */

    const language =
        getSettingElement(
            "language",
            "languageSelect"
        );

    const notifications =
        getSettingElement(
            "notificationToggle",
            "notificationsToggle"
        );

    const emergencyAlerts =
        getSettingElement(
            "emergencyAlertToggle",
            "emergencyAlertsToggle"
        );

    const priorityWindow =
        getSettingElement(
            "priorityWindow"
        );

    const offlineMode =
        getSettingElement(
            "offlineMode",
            "offlineModeToggle"
        );


    if (language) {
        language.value =
            DEFAULT_SETTINGS.language;
    }

    if (notifications) {
        notifications.checked =
            DEFAULT_SETTINGS.notifications;
    }

    if (emergencyAlerts) {
        emergencyAlerts.checked =
            DEFAULT_SETTINGS.emergencyAlerts;
    }

    if (priorityWindow) {
        priorityWindow.value =
            DEFAULT_SETTINGS.priorityWindow;
    }

    if (offlineMode) {
        offlineMode.checked =
            DEFAULT_SETTINGS.offlineMode;
    }


    updateNotificationStatus(
        DEFAULT_SETTINGS.notifications
    );

    updateEmergencyAlertStatus(
        DEFAULT_SETTINGS.emergencyAlerts
    );

    updateOfflineModeStatus(
        DEFAULT_SETTINGS.offlineMode
    );


    /*
       Tell language.js to switch back to English.
    */

    if (
        window.smartTransportLanguage &&
        typeof window.smartTransportLanguage.change === "function"
    ) {

        window.smartTransportLanguage.change("en");

    } else if (
        typeof window.changeLanguage === "function"
    ) {

        window.changeLanguage("en");

    }


    showSettingsSavedMessage();

    document.dispatchEvent(
        new CustomEvent("smartTransportSettingsReset")
    );
}


/* =========================================================
   ACTIVE EMERGENCY COUNT
   ========================================================= */

function getActiveEmergencyCount() {

    let reports = [];

    try {

        const stored =
            localStorage.getItem(
                "sosReports"
            );

        if (stored) {

            reports =
                JSON.parse(stored);

        }

    } catch (error) {

        console.warn(
            "Unable to read SOS reports:",
            error
        );

    }


    if (!Array.isArray(reports)) {
        return 0;
    }


    return reports.filter(function (report) {

        return (
            report.status === "active" ||
            report.status === "Active" ||
            report.status === "ACTIVE"
        );

    }).length;
}


/* =========================================================
   UPDATE EMERGENCY BADGE
   ========================================================= */

function updateEmergencyBadge() {

    const count =
        getActiveEmergencyCount();

    const badges =
        document.querySelectorAll(
            ".emergency-count, [data-emergency-count]"
        );


    badges.forEach(function (badge) {

        badge.textContent = count;

        if (count > 0) {

            badge.style.display =
                "inline-flex";

        } else {

            badge.style.display =
                "none";

        }

    });
}


/* =========================================================
   STORAGE API
   ========================================================= */

function getSetting(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(key);

        return value !== null
            ? value
            : fallback;

    } catch (error) {

        console.warn(
            "Unable to read setting:",
            key,
            error
        );

        return fallback;
    }
}


function setSetting(key, value) {

    try {

        localStorage.setItem(
            key,
            String(value)
        );

        return true;

    } catch (error) {

        console.warn(
            "Unable to save setting:",
            key,
            error
        );

        return false;
    }
}


/* =========================================================
   PUBLIC SETTINGS API
   ========================================================= */

window.smartTransportSettings = {

    keys: SETTINGS_KEYS,

    defaults: DEFAULT_SETTINGS,

    get: getSetting,

    set: setSetting,

    save: saveAllSettings,

    reset: resetSettings,

    initialize: initializeSettings,

    getActiveEmergencyCount:
        getActiveEmergencyCount,

    updateEmergencyBadge:
        updateEmergencyBadge,

    updateGPSStatus:
        updateGPSStatus,

    updateOfflineStatus:
        updateOfflineStatus
};


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

window.saveSettings = saveAllSettings;

window.loadSettings = initializeSettings;

window.resetSmartTransportSettings =
    resetSettings;
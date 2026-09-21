/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   APP.JS
   Shared UI / Navigation / Mobile / Clock / Utilities
   ========================================================= */

"use strict";

/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializePortalNavigation();
    initializeMobileSidebar();
    initializeClock();
    initializeSmoothScrolling();
    initializeKeyboardControls();
    initializeQuickActions();
    initializeNotificationButtons();
    initializeOnlineStatus();
    initializePortalPage();
});


/* =========================================================
   PORTAL PAGE INITIALIZATION
   ========================================================= */

function initializePortalPage() {
    document.body.classList.add("smart-transport-app");

    /*
     * Add current page information to the body.
     * Useful for styling and future integrations.
     */
    const pageName = window.location.pathname
        .split("/")
        .pop()
        .replace(".html", "")
        .toLowerCase();

    if (pageName) {
        document.body.dataset.page = pageName;
    }

    /*
     * Mark external navigation links correctly.
     */
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
        link.setAttribute("rel", "noopener noreferrer");
    });
}


/* =========================================================
   PORTAL NAVIGATION
   ========================================================= */

function initializePortalNavigation() {

    const sidebarLinks = document.querySelectorAll(
        ".portal-sidebar a[href^='#']"
    );

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                setActiveSidebarLink(link);
                closePortalSidebar();
            }

        });

    });


    /*
     * Mobile bottom navigation
     */

    const mobileLinks = document.querySelectorAll(
        ".mobile-nav a[href^='#']"
    );

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });
}


/* =========================================================
   ACTIVE SIDEBAR LINK
   ========================================================= */

function setActiveSidebarLink(activeLink) {

    const links = document.querySelectorAll(
        ".portal-sidebar a"
    );

    links.forEach(function (link) {
        link.classList.remove("active");
    });

    if (activeLink) {
        activeLink.classList.add("active");
    }
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function initializeMobileSidebar() {

    const sidebar = document.querySelector(".portal-sidebar");

    /*
     * Login / entry page has no sidebar.
     */
    if (!sidebar) {
        return;
    }

    createMobileMenuButton();
    createSidebarOverlay();

    const menuButton = document.querySelector(
        ".portal-menu-toggle"
    );

    const overlay = document.querySelector(
        ".portal-sidebar-overlay"
    );


    /* Menu button */

    if (menuButton) {

        menuButton.addEventListener("click", function (event) {

            event.stopPropagation();

            togglePortalSidebar();

        });

    }


    /* Overlay */

    if (overlay) {

        overlay.addEventListener("click", function () {

            closePortalSidebar();

        });

    }


    /* Close sidebar after selecting navigation */

    sidebar.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 850) {
                closePortalSidebar();
            }

        });

    });


    /*
     * Close when clicking outside
     */

    document.addEventListener("click", function (event) {

        if (window.innerWidth > 850) {
            return;
        }

        const clickedInsideSidebar =
            sidebar.contains(event.target);

        const clickedMenu =
            menuButton &&
            menuButton.contains(event.target);

        if (!clickedInsideSidebar && !clickedMenu) {
            closePortalSidebar();
        }

    });


    /*
     * Close when returning to desktop
     */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 850) {
            closePortalSidebar();
        }

    });

}


/* =========================================================
   CREATE MOBILE MENU BUTTON
   ========================================================= */

function createMobileMenuButton() {

    const header = document.querySelector(
        ".portal-header"
    );

    if (!header) {
        return;
    }

    let rightSide =
        header.querySelector(".portal-header-right");

    if (!rightSide) {

        rightSide = document.createElement("div");

        rightSide.className =
            "portal-header-right";

        header.appendChild(rightSide);
    }


    /*
     * Prevent duplicate buttons.
     */

    if (
        rightSide.querySelector(
            ".portal-menu-toggle"
        )
    ) {
        return;
    }


    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "portal-header-icon portal-menu-toggle";

    button.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    button.setAttribute(
        "title",
        "Open navigation menu"
    );

    button.innerHTML = "☰";


    rightSide.insertBefore(
        button,
        rightSide.firstChild
    );


    /*
     * Mobile-only styling.
     */

    const style =
        document.createElement("style");

    style.textContent = `

        .portal-menu-toggle {
            display: none;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }

        @media (max-width: 850px) {

            .portal-menu-toggle {
                display: inline-flex !important;
            }

        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   SIDEBAR OVERLAY
   ========================================================= */

function createSidebarOverlay() {

    if (
        document.querySelector(
            ".portal-sidebar-overlay"
        )
    ) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "portal-sidebar-overlay";

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(overlay);


    const style =
        document.createElement("style");

    style.textContent = `

        .portal-sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.48);
            z-index: 998;
            backdrop-filter: blur(2px);
        }

        @media (max-width: 850px) {

            .portal-sidebar-overlay.active {
                display: block;
            }

        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   OPEN / CLOSE SIDEBAR
   ========================================================= */

function togglePortalSidebar() {

    const sidebar =
        document.querySelector(
            ".portal-sidebar"
        );

    if (!sidebar) {
        return;
    }

    const isOpen =
        sidebar.classList.contains("open") ||
        sidebar.classList.contains("mobile-open");

    if (isOpen) {
        closePortalSidebar();
    } else {
        openPortalSidebar();
    }
}


function openPortalSidebar() {

    const sidebar =
        document.querySelector(
            ".portal-sidebar"
        );

    const overlay =
        document.querySelector(
            ".portal-sidebar-overlay"
        );

    if (!sidebar) {
        return;
    }

    sidebar.classList.add("open");
    sidebar.classList.add("mobile-open");

    if (overlay) {
        overlay.classList.add("active");
        overlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    document.body.classList.add(
        "sidebar-open"
    );
}


function closePortalSidebar() {

    const sidebar =
        document.querySelector(
            ".portal-sidebar"
        );

    const overlay =
        document.querySelector(
            ".portal-sidebar-overlay"
        );

    if (sidebar) {

        sidebar.classList.remove("open");
        sidebar.classList.remove("mobile-open");

    }

    if (overlay) {

        overlay.classList.remove("active");

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    document.body.classList.remove(
        "sidebar-open"
    );
}


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

function toggleSidebar() {
    togglePortalSidebar();
}


/* =========================================================
   CLOCK
   ========================================================= */

let smartTransportClockInterval = null;


function initializeClock() {

    const clock =
        document.getElementById(
            "current-time"
        );

    if (!clock) {
        return;
    }

    updateClock();

    /*
     * Prevent duplicate intervals.
     */

    if (smartTransportClockInterval) {
        clearInterval(
            smartTransportClockInterval
        );
    }

    smartTransportClockInterval =
        setInterval(
            updateClock,
            1000
        );
}


function updateClock() {

    const clock =
        document.getElementById(
            "current-time"
        );

    if (!clock) {
        return;
    }

    const now = new Date();

    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");

    const period =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    clock.textContent =
        `${hours}:${minutes}:${seconds} ${period}`;
}


/* =========================================================
   SMOOTH SCROLLING
   ========================================================= */

function initializeSmoothScrolling() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });
}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

function initializeKeyboardControls() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            /*
             * Close sidebar
             */

            closePortalSidebar();


            /*
             * Close SOS
             */

            if (
                typeof closeSOS ===
                "function"
            ) {

                try {
                    closeSOS();
                } catch (error) {
                    console.warn(
                        "Unable to close SOS:",
                        error
                    );
                }
            }


            /*
             * Traveller route planner
             */

            if (
                typeof closeRoutePlanner ===
                "function"
            ) {

                try {
                    closeRoutePlanner();
                } catch (error) {
                    console.warn(
                        "Unable to close route planner:",
                        error
                    );
                }
            }


            /*
             * Cargo shipment planner
             */

            if (
                typeof closeShipmentPlanner ===
                "function"
            ) {

                try {
                    closeShipmentPlanner();
                } catch (error) {
                    console.warn(
                        "Unable to close shipment planner:",
                        error
                    );
                }
            }

        }
    );
}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

function initializeQuickActions() {

    const quickActions =
        document.querySelectorAll(
            ".quick-action"
        );

    quickActions.forEach(function (action) {

        action.addEventListener(
            "click",
            function () {

                const targetId =
                    action.dataset.target;

                if (!targetId) {
                    return;
                }

                const target =
                    document.getElementById(
                        targetId
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });
}


/* =========================================================
   NOTIFICATION BUTTONS
   ========================================================= */

function initializeNotificationButtons() {

    const notificationButtons =
        document.querySelectorAll(
            ".portal-notification, .notification-btn, .notification-button"
        );

    notificationButtons.forEach(
        function (button) {

            /*
             * Do not interfere with existing
             * inline handlers.
             */

            if (
                button.getAttribute(
                    "onclick"
                )
            ) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    if (
                        typeof showTravellerNotifications ===
                        "function"
                    ) {

                        showTravellerNotifications();
                        return;
                    }


                    if (
                        typeof showCargoNotifications ===
                        "function"
                    ) {

                        showCargoNotifications();
                        return;
                    }


                    showGenericNotifications();

                }
            );

        }
    );
}


/* =========================================================
   GENERIC NOTIFICATIONS
   ========================================================= */

function showGenericNotifications() {

    const emergencyReports =
        getStoredArray(
            "sosReports"
        );

    const activeEmergencies =
        emergencyReports.filter(
            function (report) {

                return (
                    report.status === "active" ||
                    report.status === "Active"
                );

            }
        );


    if (
        activeEmergencies.length > 0
    ) {

        alert(
            `You have ${activeEmergencies.length} active emergency report(s).`
        );

    } else {

        alert(
            "No new notifications."
        );

    }
}


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

function initializeOnlineStatus() {

    updateOnlineStatus();

    window.addEventListener(
        "online",
        function () {

            updateOnlineStatus();

            showConnectionMessage(
                "System back online",
                "success"
            );

        }
    );

    window.addEventListener(
        "offline",
        function () {

            updateOnlineStatus();

            showConnectionMessage(
                "Offline mode active — saved data remains available.",
                "warning"
            );

        }
    );
}


function updateOnlineStatus() {

    const isOnline =
        navigator.onLine;


    /*
     * Update common status indicators.
     */

    const statusElements =
        document.querySelectorAll(
            "[data-network-status], .network-status"
        );

    statusElements.forEach(
        function (element) {

            element.textContent =
                isOnline
                    ? "System Online"
                    : "Offline Mode";

            element.classList.toggle(
                "offline",
                !isOnline
            );

            element.classList.toggle(
                "online",
                isOnline
            );

        }
    );


    /*
     * Body state.
     */

    document.body.classList.toggle(
        "offline-mode",
        !isOnline
    );
}


function showConnectionMessage(
    message,
    type
) {

    /*
     * Avoid creating duplicate messages.
     */

    const existing =
        document.querySelector(
            ".smart-transport-toast"
        );

    if (existing) {
        existing.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "smart-transport-toast";

    toast.textContent =
        message;

    toast.dataset.type =
        type || "info";


    const style =
        document.createElement("style");

    style.textContent = `

        .smart-transport-toast {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 3000;
            max-width: 360px;
            padding: 13px 17px;
            border-radius: 12px;
            background: #081C2C;
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 10px 30px rgba(0,0,0,0.22);
            font-size: 14px;
            line-height: 1.45;
        }

        .smart-transport-toast[data-type="success"] {
            border-left: 4px solid #2E7D32;
        }

        .smart-transport-toast[data-type="warning"] {
            border-left: 4px solid #F59E0B;
        }

        .smart-transport-toast[data-type="error"] {
            border-left: 4px solid #D62828;
        }

        .smart-transport-toast[data-type="info"] {
            border-left: 4px solid #124E70;
        }

        @media (max-width: 600px) {

            .smart-transport-toast {
                left: 15px;
                right: 15px;
                bottom: 15px;
                max-width: none;
            }

        }

    `;

    /*
     * Only add the style once.
     */

    if (
        !document.querySelector(
            "#smartTransportToastStyles"
        )
    ) {

        style.id =
            "smartTransportToastStyles";

        document.head.appendChild(
            style
        );
    }

    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            if (toast) {
                toast.remove();
            }

        },
        3500
    );
}


/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function getStoredArray(key) {

    try {

        const data =
            localStorage.getItem(
                key
            );

        if (!data) {
            return [];
        }

        const parsed =
            JSON.parse(data);

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


function saveStoredArray(
    key,
    value
) {

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
            localStorage.getItem(
                key
            );

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


function saveStoredObject(
    key,
    value
) {

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
   SAFE DOM HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element =
        getElement(id);

    if (element) {
        element.textContent =
            value ?? "";
    }
}


function setHTML(id, value) {

    const element =
        getElement(id);

    if (element) {
        element.innerHTML =
            value ?? "";
    }
}


function showElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.style.display = "";
    }
}


function hideElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.style.display = "none";
    }
}


/* =========================================================
   MODAL HELPERS
   ========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    modal.style.display =
        "flex";

    document.body.classList.add(
        "modal-open"
    );
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

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
   BODY SCROLL LOCK
   ========================================================= */

const sidebarBodyStyle =
    document.createElement(
        "style"
    );

sidebarBodyStyle.id =
    "smartTransportGlobalStyles";

sidebarBodyStyle.textContent = `

    body.sidebar-open {
        overflow: hidden;
    }

    body.modal-open {
        overflow: hidden;
    }

    body.offline-mode .online-only {
        opacity: 0.55;
    }

`;

if (
    !document.getElementById(
        "smartTransportGlobalStyles"
    )
) {
    document.head.appendChild(
        sidebarBodyStyle
    );
}


/* =========================================================
   PUBLIC APP API
   ========================================================= */

window.smartTransportApp = {

    openSidebar:
        openPortalSidebar,

    closeSidebar:
        closePortalSidebar,

    toggleSidebar:
        togglePortalSidebar,

    updateClock:
        updateClock,

    getStoredArray:
        getStoredArray,

    saveStoredArray:
        saveStoredArray,

    getStoredObject:
        getStoredObject,

    saveStoredObject:
        saveStoredObject,

    openModal:
        openModal,

    closeModal:
        closeModal,

    updateOnlineStatus:
        updateOnlineStatus,

    showConnectionMessage:
        showConnectionMessage,

    setText:
        setText,

    setHTML:
        setHTML,

    showElement:
        showElement,

    hideElement:
        hideElement

};


/* =========================================================
   GLOBAL COMPATIBILITY HELPERS
   ========================================================= */

window.togglePortalSidebar =
    togglePortalSidebar;

window.openPortalSidebar =
    openPortalSidebar;

window.closePortalSidebar =
    closePortalSidebar;

window.toggleSidebar =
    toggleSidebar;

window.getStoredArray =
    getStoredArray;

window.saveStoredArray =
    saveStoredArray;

window.getStoredObject =
    getStoredObject;

window.saveStoredObject =
    saveStoredObject;
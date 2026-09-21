/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   SERVICE WORKER
   Offline-First Progressive Web App
   ========================================================= */

"use strict";

/* =========================================================
   VERSION
   ========================================================= */

const CACHE_VERSION = "smart-transport-v1.1.0";

const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;


/* =========================================================
   APPLICATION FILES
   ========================================================= */

const CORE_FILES = [

    /* Root */
    "./",
    "./index.html",
    "./manifest.json",

    /* Main HTML pages */
    "./travellers.html",
    "./cargo.html",
    "./alerts.html",
    "./analysis.html",
    "./emergency.html",
    "./live-map.html",
    "./reports.html",
    "./schedule.html",
    "./settings.html",

    /* CSS */
    "./css/style.css",
    "./css/portal-ui.css",

    /* JavaScript */
    "./js/app.js",
    "./js/alerts.js",
    "./js/algorithms.js",
    "./js/cargo.js",
    "./js/emergency.js",
    "./js/index.js",
    "./js/languages.js",
    "./js/settings.js",
    "./js/travellers.js",

    /* Images */
    "./images/background.png",
    "./images/logo.png",

    /* PWA icons */
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"

];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", function (event) {

    console.log(
        "[Smart Transport SW] Installing:",
        CACHE_VERSION
    );

    event.waitUntil(

        caches
            .open(STATIC_CACHE)
            .then(function (cache) {

                console.log(
                    "[Smart Transport SW] Caching application files..."
                );

                return cache.addAll(CORE_FILES);

            })
            .then(function () {

                /*
                   Activate immediately.
                */

                return self.skipWaiting();

            })
            .catch(function (error) {

                console.error(
                    "[Smart Transport SW] Cache installation failed:",
                    error
                );

                /*
                   Do not silently hide installation problems.
                   The browser will retry installation later.
                */

                throw error;

            })

    );

});


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", function (event) {

    console.log(
        "[Smart Transport SW] Activating:",
        CACHE_VERSION
    );

    event.waitUntil(

        caches
            .keys()
            .then(function (cacheNames) {

                return Promise.all(

                    cacheNames.map(function (cacheName) {

                        /*
                           Delete old Smart Transport caches.
                        */

                        if (

                            cacheName.startsWith(
                                "smart-transport-"
                            )

                            &&

                            cacheName !== STATIC_CACHE

                            &&

                            cacheName !== DYNAMIC_CACHE

                        ) {

                            console.log(
                                "[Smart Transport SW] Removing old cache:",
                                cacheName
                            );

                            return caches.delete(
                                cacheName
                            );

                        }

                        return null;

                    })

                );

            })
            .then(function () {

                /*
                   Take control of open pages immediately.
                */

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", function (event) {

    const request = event.request;

    /*
       Only handle GET requests.

       POST requests such as:

       /api/translate
       /api/login
       /api/emergency
       /api/routes

       go directly to the backend.
    */

    if (request.method !== "GET") {

        return;

    }


    const url = new URL(request.url);


    /* =====================================================
       EXTERNAL RESOURCES
       ===================================================== */

    /*
       External map tiles, weather APIs, live APIs,
       CDNs, etc. should use the network.

       This prevents stale live information.
    */

    if (
        url.origin !== self.location.origin
    ) {

        event.respondWith(
            networkOnly(request)
        );

        return;

    }


    /* =====================================================
       API REQUESTS
       ===================================================== */

    /*
       API GET requests use network-first.

       This is useful for:
       - Live transport information
       - Routes
       - Weather
       - Emergency data
       - Backend data
       - Sarvam integration
    */

    if (
        url.pathname.startsWith("/api/")
    ) {

        event.respondWith(
            networkFirstAPI(request)
        );

        return;

    }


    /* =====================================================
       STATIC APPLICATION FILES
       ===================================================== */

    event.respondWith(
        cacheFirst(request)
    );

});


/* =========================================================
   CACHE FIRST
   ========================================================= */

async function cacheFirst(request) {

    const cachedResponse =
        await caches.match(request);

    if (cachedResponse) {

        /*
           Return cached version immediately.

           Refresh it in the background so the next
           visit gets the newest version.
        */

        eventRefreshCache(request);

        return cachedResponse;

    }


    try {

        const networkResponse =
            await fetch(request);


        if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
        ) {

            const cache =
                await caches.open(
                    DYNAMIC_CACHE
                );

            await cache.put(
                request,
                networkResponse.clone()
            );

        }


        return networkResponse;

    }

    catch (error) {

        console.warn(
            "[Smart Transport SW] Resource unavailable:",
            request.url
        );

        return offlineFallback(request);

    }

}


/* =========================================================
   BACKGROUND CACHE REFRESH
   ========================================================= */

function eventRefreshCache(request) {

    refreshCache(request).catch(function () {

        /*
           Background refresh failures are expected
           when the device is offline.
        */

    });

}


async function refreshCache(request) {

    try {

        const response =
            await fetch(request);


        if (
            response &&
            response.status === 200 &&
            response.type === "basic"
        ) {

            const cache =
                await caches.open(
                    STATIC_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }

    }

    catch (error) {

        /*
           Offline is normal here.
        */

    }

}


/* =========================================================
   NETWORK FIRST API
   ========================================================= */

async function networkFirstAPI(request) {

    try {

        const response =
            await fetch(request);


        /*
           Only cache successful GET API responses.

           This allows selected backend GET requests
           to remain available briefly if needed.
        */

        if (
            response &&
            response.status === 200
        ) {

            const cache =
                await caches.open(
                    DYNAMIC_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        console.warn(
            "[Smart Transport SW] API unavailable:",
            request.url
        );


        /*
           Try previously cached GET API data.
        */

        const cachedResponse =
            await caches.match(request);


        if (cachedResponse) {

            return cachedResponse;

        }


        /*
           Return a structured offline response.
        */

        return new Response(

            JSON.stringify({

                success: false,
                offline: true,

                message:
                    "This service is currently unavailable offline."

            }),

            {

                status: 503,

                headers: {

                    "Content-Type":
                        "application/json",

                    "Cache-Control":
                        "no-store"

                }

            }

        );

    }

}


/* =========================================================
   NETWORK ONLY
   ========================================================= */

async function networkOnly(request) {

    try {

        return await fetch(request);

    }

    catch (error) {

        return new Response(

            JSON.stringify({

                success: false,

                offline: true,

                message:
                    "Network connection required."

            }),

            {

                status: 503,

                headers: {

                    "Content-Type":
                        "application/json",

                    "Cache-Control":
                        "no-store"

                }

            }

        );

    }

}


/* =========================================================
   OFFLINE FALLBACK
   ========================================================= */

async function offlineFallback(request) {

    /*
       If a requested HTML page isn't cached,
       try the main entry page.
    */

    if (
        request.destination === "document"
    ) {

        const cachedIndex =
            await caches.match(
                "./index.html"
            );


        if (cachedIndex) {

            return cachedIndex;

        }

    }


    /*
       Generic offline response.
    */

    return new Response(

        `
        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <meta
                name="theme-color"
                content="#124E70"
            >

            <title>
                Smart Transport - Offline
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    margin: 0;

                    min-height: 100vh;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    padding: 24px;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    background:
                        linear-gradient(
                            135deg,
                            #081C2C,
                            #124E70
                        );

                    color: #ffffff;

                    text-align: center;

                }


                .offline-card {

                    width: 100%;

                    max-width: 500px;

                    padding: 42px 32px;

                    border-radius: 22px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.08
                        );

                    border:
                        1px solid
                        rgba(
                            255,
                            255,
                            255,
                            0.16
                        );

                    box-shadow:
                        0 20px 60px
                        rgba(
                            0,
                            0,
                            0,
                            0.25
                        );

                    backdrop-filter:
                        blur(12px);

                }


                .offline-icon {

                    font-size: 56px;

                    margin-bottom: 20px;

                }


                h1 {

                    margin:
                        0 0 14px;

                    font-size: 28px;

                }


                p {

                    margin: 0;

                    line-height: 1.7;

                    opacity: 0.85;

                }


                button {

                    margin-top: 26px;

                    padding:
                        13px 24px;

                    border: 0;

                    border-radius: 10px;

                    background: #124E70;

                    color: #ffffff;

                    font-size: 15px;

                    font-weight: 700;

                    cursor: pointer;

                }


                button:hover {

                    opacity: 0.9;

                }

            </style>

        </head>


        <body>

            <div class="offline-card">

                <div class="offline-icon">
                    📴
                </div>


                <h1>
                    You're Offline
                </h1>


                <p>

                    Smart Transport is currently
                    unable to reach the network.

                    <br><br>

                    Your cached application features
                    remain available whenever possible.

                </p>


                <button
                    onclick="location.reload()"
                >

                    Try Again

                </button>

            </div>

        </body>

        </html>
        `,

        {

            status: 200,

            headers: {

                "Content-Type":
                    "text/html; charset=UTF-8"

            }

        }

    );

}


/* =========================================================
   MESSAGE HANDLING
   ========================================================= */

self.addEventListener(
    "message",
    function (event) {

        if (!event.data) {

            return;

        }


        /* =================================================
           FORCE UPDATE
           ================================================= */

        if (
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }


        /* =================================================
           CLEAR ALL CACHES
           ================================================= */

        if (
            event.data.type ===
            "CLEAR_CACHE"
        ) {

            event.waitUntil(

                caches
                    .keys()
                    .then(function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function (cacheName) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }
                            )

                        );

                    })

            );

        }

    }
);


/* =========================================================
   SERVICE WORKER READY
   ========================================================= */

console.log(
    "[Smart Transport SW] Loaded:",
    CACHE_VERSION
);
/* =========================================================
   SMART TRANSPORT MANAGEMENT SYSTEM
   LANGUAGES.JS
   Automatic Multilingual Translation System
   ========================================================= */

"use strict";


/* =========================================================
   SUPPORTED LANGUAGES
   ========================================================= */

const SMART_TRANSPORT_LANGUAGES = {

    en: {
        name: "English",
        nativeName: "English"
    },

    hi: {
        name: "Hindi",
        nativeName: "हिन्दी"
    },

    kn: {
        name: "Kannada",
        nativeName: "ಕನ್ನಡ"
    },

    ta: {
        name: "Tamil",
        nativeName: "தமிழ்"
    },

    te: {
        name: "Telugu",
        nativeName: "తెలుగు"
    },

    ml: {
        name: "Malayalam",
        nativeName: "മലയാളം"
    },

    mr: {
        name: "Marathi",
        nativeName: "मराठी"
    },

    bn: {
        name: "Bengali",
        nativeName: "বাংলা"
    },

    as: {
        name: "Assamese",
        nativeName: "অসমীয়া"
    },

    gu: {
        name: "Gujarati",
        nativeName: "ગુજરાતી"
    },

    or: {
        name: "Odia",
        nativeName: "ଓଡ଼ିଆ"
    },

    pa: {
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ"
    },

    ur: {
        name: "Urdu",
        nativeName: "اردو"
    },

    ne: {
        name: "Nepali",
        nativeName: "नेपाली"
    },

    mni: {
        name: "Manipuri",
        nativeName: "মৈতৈলোন্"
    },

    bodo: {
        name: "Bodo",
        nativeName: "बड़ो"
    }

};


/* =========================================================
   STORAGE
   ========================================================= */

const LANGUAGE_STORAGE_KEY =
    "smartTransportLanguage";


/* =========================================================
   CURRENT LANGUAGE
   ========================================================= */

let currentLanguage =
    localStorage.getItem(
        LANGUAGE_STORAGE_KEY
    ) || "en";


/* =========================================================
   TRANSLATION CACHE
   ========================================================= */

const translationCache = {};


/* =========================================================
   LOCAL TRANSLATIONS
   ========================================================= */

const PRE_TRANSLATIONS = {

    en: {

        dashboard: "My Dashboard",
        planJourney: "Plan Journey",
        myVehicle: "My Vehicle",
        myAlerts: "My Alerts",
        travelHistory: "Travel History",
        settings: "Settings",
        reportEmergency: "Report Emergency",
        signOut: "Sign Out",

        cargoDashboard: "Cargo Dashboard",
        transportQueue: "Transport Queue",
        planShipment: "Plan Shipment",
        myCargo: "My Cargo",
        cargoAlerts: "Cargo Alerts",
        shipmentHistory: "Shipment History",

        welcome: "Welcome",
        travellerPortal: "TRAVELLER PORTAL",
        cargoPortal: "CARGO PORTAL",

        systemOnline: "System Online",

        currentJourney: "Current Journey",
        routeAnalysis: "Route Analysis",
        vehicle: "Vehicle",
        alerts: "Alerts",
        journeyPlanner: "Journey Planner",

        currentShipment: "Current Shipment",
        whyWaiting: "Why Am I Waiting?",
        currentTransportQueue: "Current Transport Queue",

        origin: "Origin",
        destination: "Destination",
        vehicleType: "Vehicle Type",
        cargoType: "Cargo Type",
        priority: "Priority",
        status: "Status",

        planYourJourney: "Plan Your Journey",
        analyseRoute: "Analyse Route",
        analyseShipment: "Analyse Shipment",

        emergency: "Emergency SOS",
        reportEmergencyNow: "Report Emergency",

        save: "Save",
        cancel: "Cancel",
        close: "Close",
        submit: "Submit",

        online: "Online",
        offline: "Offline",

        safeRoute: "Safe Route",
        warning: "Warning",
        critical: "Critical",

        loading: "Loading...",
        noNotifications: "No new notifications."

    },


    hi: {

        dashboard: "मेरा डैशबोर्ड",
        planJourney: "यात्रा की योजना",
        myVehicle: "मेरा वाहन",
        myAlerts: "मेरी चेतावनियाँ",
        travelHistory: "यात्रा इतिहास",
        settings: "सेटिंग्स",
        reportEmergency: "आपातकाल रिपोर्ट करें",
        signOut: "साइन आउट",

        cargoDashboard: "कार्गो डैशबोर्ड",
        transportQueue: "परिवहन कतार",
        planShipment: "शिपमेंट की योजना",
        myCargo: "मेरा कार्गो",
        cargoAlerts: "कार्गो चेतावनियाँ",
        shipmentHistory: "शिपमेंट इतिहास",

        welcome: "स्वागत है",
        travellerPortal: "यात्री पोर्टल",
        cargoPortal: "कार्गो पोर्टल",

        systemOnline: "सिस्टम ऑनलाइन",

        currentJourney: "वर्तमान यात्रा",
        routeAnalysis: "मार्ग विश्लेषण",
        vehicle: "वाहन",
        alerts: "चेतावनियाँ",
        journeyPlanner: "यात्रा योजनाकार",

        currentShipment: "वर्तमान शिपमेंट",
        whyWaiting: "मैं प्रतीक्षा क्यों कर रहा हूँ?",
        currentTransportQueue: "वर्तमान परिवहन कतार",

        origin: "प्रस्थान",
        destination: "गंतव्य",
        vehicleType: "वाहन का प्रकार",
        cargoType: "कार्गो का प्रकार",
        priority: "प्राथमिकता",
        status: "स्थिति",

        planYourJourney: "अपनी यात्रा की योजना बनाएं",
        analyseRoute: "मार्ग का विश्लेषण करें",
        analyseShipment: "शिपमेंट का विश्लेषण करें",

        emergency: "आपातकाल SOS",
        reportEmergencyNow: "आपातकाल रिपोर्ट करें",

        save: "सहेजें",
        cancel: "रद्द करें",
        close: "बंद करें",
        submit: "जमा करें",

        online: "ऑनलाइन",
        offline: "ऑफलाइन",

        safeRoute: "सुरक्षित मार्ग",
        warning: "चेतावनी",
        critical: "गंभीर",

        loading: "लोड हो रहा है...",
        noNotifications: "कोई नई सूचना नहीं है।"

    },


    kn: {

        dashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        planJourney: "ಪ್ರಯಾಣ ಯೋಜನೆ",
        myVehicle: "ನನ್ನ ವಾಹನ",
        myAlerts: "ನನ್ನ ಎಚ್ಚರಿಕೆಗಳು",
        travelHistory: "ಪ್ರಯಾಣ ಇತಿಹಾಸ",
        settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        reportEmergency: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ವರದಿ",
        signOut: "ಸೈನ್ ಔಟ್",

        cargoDashboard: "ಕಾರ್ಗೋ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        transportQueue: "ಸಾರಿಗೆ ಸರದಿ",
        planShipment: "ಶಿಪ್‌ಮೆಂಟ್ ಯೋಜನೆ",
        myCargo: "ನನ್ನ ಕಾರ್ಗೋ",
        cargoAlerts: "ಕಾರ್ಗೋ ಎಚ್ಚರಿಕೆಗಳು",
        shipmentHistory: "ಶಿಪ್‌ಮೆಂಟ್ ಇತಿಹಾಸ",

        welcome: "ಸ್ವಾಗತ",
        travellerPortal: "ಪ್ರಯಾಣಿಕರ ಪೋರ್ಟಲ್",
        cargoPortal: "ಕಾರ್ಗೋ ಪೋರ್ಟಲ್",

        systemOnline: "ಸಿಸ್ಟಮ್ ಆನ್‌ಲೈನ್",

        currentJourney: "ಪ್ರಸ್ತುತ ಪ್ರಯಾಣ",
        routeAnalysis: "ಮಾರ್ಗ ವಿಶ್ಲೇಷಣೆ",
        vehicle: "ವಾಹನ",
        alerts: "ಎಚ್ಚರಿಕೆಗಳು",
        journeyPlanner: "ಪ್ರಯಾಣ ಯೋಜಕ",

        currentShipment: "ಪ್ರಸ್ತುತ ಶಿಪ್‌ಮೆಂಟ್",
        whyWaiting: "ನಾನು ಏಕೆ ಕಾಯುತ್ತಿದ್ದೇನೆ?",
        currentTransportQueue: "ಪ್ರಸ್ತುತ ಸಾರಿಗೆ ಸರದಿ",

        origin: "ಆರಂಭಿಕ ಸ್ಥಳ",
        destination: "ಗಮ್ಯಸ್ಥಾನ",
        vehicleType: "ವಾಹನದ ಪ್ರಕಾರ",
        cargoType: "ಕಾರ್ಗೋ ಪ್ರಕಾರ",
        priority: "ಆದ್ಯತೆ",
        status: "ಸ್ಥಿತಿ",

        planYourJourney: "ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಯೋಜಿಸಿ",
        analyseRoute: "ಮಾರ್ಗವನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
        analyseShipment: "ಶಿಪ್‌ಮೆಂಟ್ ವಿಶ್ಲೇಷಿಸಿ",

        emergency: "ತುರ್ತು SOS",
        reportEmergencyNow: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ವರದಿ ಮಾಡಿ",

        save: "ಉಳಿಸಿ",
        cancel: "ರದ್ದುಮಾಡಿ",
        close: "ಮುಚ್ಚಿ",
        submit: "ಸಲ್ಲಿಸಿ",

        online: "ಆನ್‌ಲೈನ್",
        offline: "ಆಫ್‌ಲೈನ್",

        safeRoute: "ಸುರಕ್ಷಿತ ಮಾರ್ಗ",
        warning: "ಎಚ್ಚರಿಕೆ",
        critical: "ಗಂಭೀರ",

        loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        noNotifications: "ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ."

    },


    ta: {

        dashboard: "எனது டாஷ்போர்டு",
        planJourney: "பயணத் திட்டம்",
        myVehicle: "எனது வாகனம்",
        myAlerts: "எனது எச்சரிக்கைகள்",
        travelHistory: "பயண வரலாறு",
        settings: "அமைப்புகள்",
        reportEmergency: "அவசரநிலையைப் புகாரளிக்கவும்",
        signOut: "வெளியேறு",

        cargoDashboard: "சரக்கு டாஷ்போர்டு",
        transportQueue: "போக்குவரத்து வரிசை",
        planShipment: "சரக்கு திட்டம்",
        myCargo: "எனது சரக்கு",
        cargoAlerts: "சரக்கு எச்சரிக்கைகள்",
        shipmentHistory: "சரக்கு வரலாறு",

        welcome: "வரவேற்கிறோம்",
        travellerPortal: "பயணியர் போர்டல்",
        cargoPortal: "சரக்கு போர்டல்",

        systemOnline: "கணினி ஆன்லைனில் உள்ளது",

        currentJourney: "தற்போதைய பயணம்",
        routeAnalysis: "வழி பகுப்பாய்வு",
        vehicle: "வாகனம்",
        alerts: "எச்சரிக்கைகள்",
        journeyPlanner: "பயண திட்டமிடுபவர்",

        currentShipment: "தற்போதைய சரக்கு",
        whyWaiting: "நான் ஏன் காத்திருக்கிறேன்?",
        currentTransportQueue: "தற்போதைய போக்குவரத்து வரிசை",

        origin: "தொடக்கம்",
        destination: "இலக்கு",
        vehicleType: "வாகன வகை",
        cargoType: "சரக்கு வகை",
        priority: "முன்னுரிமை",
        status: "நிலை",

        planYourJourney: "உங்கள் பயணத்தைத் திட்டமிடுங்கள்",
        analyseRoute: "வழியைப் பகுப்பாய்வு செய்க",
        analyseShipment: "சரக்கைப் பகுப்பாய்வு செய்க",

        emergency: "அவசர SOS",
        reportEmergencyNow: "அவசரநிலையைப் புகாரளிக்கவும்",

        save: "சேமி",
        cancel: "ரத்து",
        close: "மூடு",
        submit: "சமர்ப்பிக்கவும்",

        online: "ஆன்லைன்",
        offline: "ஆஃப்லைன்",

        safeRoute: "பாதுகாப்பான வழி",
        warning: "எச்சரிக்கை",
        critical: "அவசரம்",

        loading: "ஏற்றப்படுகிறது...",
        noNotifications: "புதிய அறிவிப்புகள் இல்லை."

    },


    te: {

        dashboard: "నా డాష్‌బోర్డ్",
        planJourney: "ప్రయాణ ప్రణాళిక",
        myVehicle: "నా వాహనం",
        myAlerts: "నా హెచ్చరికలు",
        travelHistory: "ప్రయాణ చరిత్ర",
        settings: "సెట్టింగ్‌లు",
        reportEmergency: "అత్యవసర పరిస్థితిని నివేదించండి",
        signOut: "సైన్ అవుట్",

        cargoDashboard: "కార్గో డాష్‌బోర్డ్",
        transportQueue: "రవాణా క్యూ",
        planShipment: "షిప్‌మెంట్ ప్రణాళిక",
        myCargo: "నా కార్గో",
        cargoAlerts: "కార్గో హెచ్చరికలు",
        shipmentHistory: "షిప్‌మెంట్ చరిత్ర",

        welcome: "స్వాగతం",
        travellerPortal: "ప్రయాణికుల పోర్టల్",
        cargoPortal: "కార్గో పోర్టల్",

        systemOnline: "సిస్టమ్ ఆన్‌లైన్‌లో ఉంది",

        currentJourney: "ప్రస్తుత ప్రయాణం",
        routeAnalysis: "మార్గ విశ్లేషణ",
        vehicle: "వాహనం",
        alerts: "హెచ్చరికలు",
        journeyPlanner: "ప్రయాణ ప్రణాళిక",

        currentShipment: "ప్రస్తుత షిప్‌మెంట్",
        whyWaiting: "నేను ఎందుకు వేచి ఉన్నాను?",
        currentTransportQueue: "ప్రస్తుత రవాణా క్యూ",

        origin: "ప్రారంభ స్థానం",
        destination: "గమ్యం",
        vehicleType: "వాహనం రకం",
        cargoType: "కార్గో రకం",
        priority: "ప్రాధాన్యత",
        status: "స్థితి",

        planYourJourney: "మీ ప్రయాణాన్ని ప్లాన్ చేయండి",
        analyseRoute: "మార్గాన్ని విశ్లేషించండి",
        analyseShipment: "షిప్‌మెంట్‌ను విశ్లేషించండి",

        emergency: "అత్యవసర SOS",
        reportEmergencyNow: "అత్యవసర పరిస్థితిని నివేదించండి",

        save: "సేవ్ చేయండి",
        cancel: "రద్దు చేయండి",
        close: "మూసివేయండి",
        submit: "సమర్పించండి",

        online: "ఆన్‌లైన్",
        offline: "ఆఫ్‌లైన్",

        safeRoute: "సురక్షిత మార్గం",
        warning: "హెచ్చరిక",
        critical: "తీవ్రమైన ప్రమాదం",

        loading: "లోడ్ అవుతోంది...",
        noNotifications: "కొత్త నోటిఫికేషన్‌లు లేవు."

    }

};


/* =========================================================
   TRANSLATION LOOKUP
   ========================================================= */

function translateKey(
    key
) {

    const selected =
        PRE_TRANSLATIONS[
            currentLanguage
        ];


    if (
        selected &&
        selected[key]
    ) {

        return selected[key];

    }


    if (
        PRE_TRANSLATIONS.en &&
        PRE_TRANSLATIONS.en[key]
    ) {

        return PRE_TRANSLATIONS.en[key];

    }


    return key;

}


/* =========================================================
   APPLY LOCAL TRANSLATIONS
   ========================================================= */

function applyPreTranslations() {

    const elements =
        document.querySelectorAll(
            "[data-translate]"
        );


    elements.forEach(
        function (element) {

            const key =
                element.getAttribute(
                    "data-translate"
                );


            if (!key) {
                return;
            }


            if (
                !element.hasAttribute(
                    "data-original-translate-key"
                )
            ) {

                element.setAttribute(
                    "data-original-translate-key",
                    key
                );

            }


            element.textContent =
                translateKey(key);

        }
    );


    const placeholders =
        document.querySelectorAll(
            "[data-translate-placeholder]"
        );


    placeholders.forEach(
        function (element) {

            const key =
                element.getAttribute(
                    "data-translate-placeholder"
                );


            if (!key) {
                return;
            }


            if (
                !element.hasAttribute(
                    "data-original-placeholder"
                )
            ) {

                element.setAttribute(
                    "data-original-placeholder",
                    element.placeholder || ""
                );

            }


            const translated =
                translateKey(key);


            if (
                translated !== key
            ) {

                element.placeholder =
                    translated;

            }

        }
    );


    const titles =
        document.querySelectorAll(
            "[data-translate-title]"
        );


    titles.forEach(
        function (element) {

            const key =
                element.getAttribute(
                    "data-translate-title"
                );


            if (!key) {
                return;
            }


            if (
                !element.hasAttribute(
                    "data-original-title"
                )
            ) {

                element.setAttribute(
                    "data-original-title",
                    element.title || ""
                );

            }


            const translated =
                translateKey(key);


            if (
                translated !== key
            ) {

                element.title =
                    translated;

            }

        }
    );

}


/* =========================================================
   LANGUAGE DROPDOWNS
   ========================================================= */

function populateLanguageDropdowns() {

    const dropdowns =
        document.querySelectorAll(
            "#language, .language-select, [data-language-select]"
        );


    dropdowns.forEach(
        function (dropdown) {

            /*
               Do not recreate an already
               initialized dropdown.
            */

            if (
                dropdown.dataset.languageInitialized ===
                "true"
            ) {

                dropdown.value =
                    currentLanguage;

                return;

            }


            dropdown.innerHTML = "";


            Object.keys(
                SMART_TRANSPORT_LANGUAGES
            ).forEach(
                function (code) {

                    const language =
                        SMART_TRANSPORT_LANGUAGES[
                            code
                        ];


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        code;


                    option.textContent =
                        `${language.name} — ${language.nativeName}`;


                    if (
                        code === currentLanguage
                    ) {

                        option.selected =
                            true;

                    }


                    dropdown.appendChild(
                        option
                    );

                }
            );


            dropdown.addEventListener(
                "change",
                function () {

                    changeLanguage(
                        this.value
                    );

                }
            );


            dropdown.dataset.languageInitialized =
                "true";

        }
    );

}


/* =========================================================
   CHANGE LANGUAGE
   ========================================================= */

async function changeLanguage(
    languageCode
) {

    if (
        !SMART_TRANSPORT_LANGUAGES[
            languageCode
        ]
    ) {

        console.warn(
            "Unsupported language:",
            languageCode
        );

        return;

    }


    /*
       If switching back to English,
       restore original text.
    */

    if (
        languageCode === "en"
    ) {

        restoreOriginalDynamicText();


        currentLanguage =
            "en";


        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            "en"
        );


        document.documentElement.lang =
            "en";


        applyPreTranslations();


        updateAllLanguageDropdowns();


        dispatchLanguageChange();


        return;

    }


    /*
       If changing from one non-English
       language to another, restore English
       first so we never translate an
       already-translated sentence.
    */

    if (
        currentLanguage !== "en"
    ) {

        restoreOriginalDynamicText();

    }


    currentLanguage =
        languageCode;


    localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        currentLanguage
    );


    document.documentElement.lang =
        currentLanguage;


    applyPreTranslations();


    showTranslationLoading(
        true
    );


    try {

        await translateEntirePage(
            currentLanguage
        );

    } finally {

        showTranslationLoading(
            false
        );

    }


    updateAllLanguageDropdowns();


    dispatchLanguageChange();

}


/* =========================================================
   LANGUAGE CHANGE EVENT
   ========================================================= */

function dispatchLanguageChange() {

    window.dispatchEvent(
        new CustomEvent(
            "smartTransportLanguageChanged",
            {
                detail: {
                    language:
                        currentLanguage
                }
            }
        )
    );

}


/* =========================================================
   TRANSLATION LOADING INDICATOR
   ========================================================= */

function showTranslationLoading(
    isLoading
) {

    document.body.classList.toggle(
        "translation-loading",
        Boolean(isLoading)
    );


    const indicators =
        document.querySelectorAll(
            "[data-translation-loading]"
        );


    indicators.forEach(
        function (element) {

            element.style.display =
                isLoading
                    ? ""
                    : "none";

        }
    );

}


/* =========================================================
   TRANSLATE ENTIRE PAGE
   ========================================================= */

async function translateEntirePage(
    targetLanguage
) {

    const textNodes =
        collectTranslatableTextNodes();


    if (
        textNodes.length === 0
    ) {

        return;

    }


    const uniqueTexts =
        [
            ...new Set(
                textNodes.map(
                    function (item) {
                        return item.text;
                    }
                )
            )
        ];


    const batchSize =
        15;


    for (
        let i = 0;
        i < uniqueTexts.length;
        i += batchSize
    ) {

        const batch =
            uniqueTexts.slice(
                i,
                i + batchSize
            );


        try {

            const translations =
                await requestBatchTranslation(
                    batch,
                    targetLanguage
                );


            if (
                !Array.isArray(
                    translations
                )
            ) {

                continue;

            }


            batch.forEach(
                function (
                    originalText,
                    index
                ) {

                    const translated =
                        translations[index];


                    if (
                        !translated ||
                        translated ===
                            originalText
                    ) {

                        return;

                    }


                    textNodes
                        .filter(
                            function (item) {

                                return (
                                    item.text ===
                                    originalText
                                );

                            }
                        )
                        .forEach(
                            function (item) {

                                /*
                                   Save original text
                                   before replacing it.
                                */

                                if (
                                    !item.node.hasAttribute(
                                        "data-original-text"
                                    )
                                ) {

                                    item.node.setAttribute(
                                        "data-original-text",
                                        originalText
                                    );

                                }


                                item.node.setAttribute(
                                    "data-auto-translated",
                                    "true"
                                );


                                item.node.textContent =
                                    translated;

                            }
                        );

                }
            );


        } catch (error) {

            console.warn(
                "Translation batch failed:",
                error
            );

            /*
               Continue with remaining batches.
            */

        }

    }

}


/* =========================================================
   COLLECT TRANSLATABLE TEXT
   ========================================================= */

function collectTranslatableTextNodes() {

    const results = [];


    const ignoredTags =
        new Set([
            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "CODE",
            "PRE",
            "INPUT",
            "TEXTAREA",
            "SELECT",
            "OPTION"
        ]);


    const walker =
        document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );


    let node;


    while (
        node =
            walker.nextNode()
    ) {

        const parent =
            node.parentElement;


        if (!parent) {
            continue;
        }


        if (
            ignoredTags.has(
                parent.tagName
            )
        ) {

            continue;

        }


        const style =
            window.getComputedStyle(
                parent
            );


        if (
            style.display === "none" ||
            style.visibility === "hidden"
        ) {

            continue;

        }


        if (
            parent.closest(
                "[data-no-translate]"
            )
        ) {

            continue;

        }


        /*
           Elements with explicit local
           translation keys are already
           handled by applyPreTranslations().
        */

        if (
            parent.closest(
                "[data-translate]"
            )
        ) {

            continue;

        }


        const text =
            node.textContent.trim();


        if (!text) {
            continue;
        }


        if (
            shouldIgnoreTranslation(
                text
            )
        ) {

            continue;

        }


        /*
           Don't translate something that
           this same page has already translated.
        */

        if (
            node.parentElement &&
            node.parentElement.hasAttribute(
                "data-auto-translated"
            )
        ) {

            continue;

        }


        if (
            node.hasAttribute &&
            node.hasAttribute(
                "data-auto-translated"
            )
        ) {

            continue;

        }


        results.push({

            node:
                node,

            text:
                text

        });

    }


    return results;

}


/* =========================================================
   IGNORE TECHNICAL TEXT
   ========================================================= */

function shouldIgnoreTranslation(
    text
) {

    const value =
        String(
            text
        ).trim();


    if (!value) {
        return true;
    }


    /*
       Priority codes.
    */

    if (
        /^P[1-3]$/i.test(
            value
        )
    ) {

        return true;

    }


    /*
       Vehicle registration numbers.
    */

    if (
        /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/i
            .test(value)
    ) {

        return true;

    }


    /*
       Pure numbers.
    */

    if (
        /^\d+([.,]\d+)?$/.test(
            value
        )
    ) {

        return true;

    }


    /*
       Time.
    */

    if (
        /^\d{1,2}:\d{2}(:\d{2})?\s?(AM|PM)?$/i
            .test(value)
    ) {

        return true;

    }


    /*
       Coordinates.
    */

    if (
        /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/
            .test(value)
    ) {

        return true;

    }


    /*
       Very short technical values.
    */

    if (
        value.length <= 2
    ) {

        return true;

    }


    /*
       Do not translate file extensions,
       API paths or technical identifiers.
    */

    if (
        /^https?:\/\//i.test(value) ||
        /^\/api\//i.test(value) ||
        /\.(js|css|html|json)$/i.test(value)
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   BACKEND TRANSLATION REQUEST
   ========================================================= */

/*
   Frontend expects:

   POST /api/translate

   {
       "text": [
           "Welcome",
           "Plan Journey"
       ],
       "targetLanguage": "kn"
   }

   Backend returns:

   {
       "translations": [
           "ಸ್ವಾಗತ",
           "ಪ್ರಯಾಣ ಯೋಜನೆ"
       ]
   }

   IMPORTANT:
   Sarvam API key remains on the backend.
*/

async function requestBatchTranslation(
    texts,
    targetLanguage
) {

    if (
        !texts ||
        texts.length === 0
    ) {

        return [];

    }


    const cacheKey =
        `${targetLanguage}::${texts.join("||")}`;


    if (
        translationCache[
            cacheKey
        ]
    ) {

        return translationCache[
            cacheKey
        ];

    }


    const response =
        await fetch(
            "/api/translate",
            {

                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        text:
                            texts,

                        targetLanguage:
                            targetLanguage

                    })

            }
        );


    if (!response.ok) {

        throw new Error(
            `Translation API error: ${response.status}`
        );

    }


    const data =
        await response.json();


    let translations =
        null;


    if (
        Array.isArray(
            data.translations
        )
    ) {

        translations =
            data.translations;

    } else if (
        Array.isArray(
            data.translatedTexts
        )
    ) {

        translations =
            data.translatedTexts;

    } else if (
        texts.length === 1
    ) {

        const translated =
            data.translatedText ||
            data.translation ||
            data.text;


        if (translated) {

            translations =
                [
                    translated
                ];

        }

    }


    if (
        !Array.isArray(
            translations
        )
    ) {

        throw new Error(
            "Unexpected translation API response."
        );

    }


    translationCache[
        cacheKey
    ] =
        translations;


    return translations;

}


/* =========================================================
   RESTORE ORIGINAL PAGE TEXT
   ========================================================= */

function restoreOriginalDynamicText() {

    const translatedNodes =
        document.querySelectorAll(
            "[data-auto-translated]"
        );


    translatedNodes.forEach(
        function (node) {

            const original =
                node.getAttribute(
                    "data-original-text"
                );


            if (
                original !== null
            ) {

                node.textContent =
                    original;

            }


            node.removeAttribute(
                "data-auto-translated"
            );


            node.removeAttribute(
                "data-original-text"
            );

        }
    );


    /*
       Restore placeholders.
    */

    document
        .querySelectorAll(
            "[data-auto-translated-placeholder]"
        )
        .forEach(
            function (element) {

                const original =
                    element.getAttribute(
                        "data-original-placeholder"
                    );


                if (
                    original !== null
                ) {

                    element.placeholder =
                        original;

                }


                element.removeAttribute(
                    "data-auto-translated-placeholder"
                );


                element.removeAttribute(
                    "data-original-placeholder"
                );

            }
        );


    /*
       Restore titles.
    */

    document
        .querySelectorAll(
            "[data-auto-translated-title]"
        )
        .forEach(
            function (element) {

                const original =
                    element.getAttribute(
                        "data-original-title"
                    );


                if (
                    original !== null
                ) {

                    element.title =
                        original;

                }


                element.removeAttribute(
                    "data-auto-translated-title"
                );


                element.removeAttribute(
                    "data-original-title"
                );

            }
        );

}


/* =========================================================
   UPDATE LANGUAGE DROPDOWNS
   ========================================================= */

function updateAllLanguageDropdowns() {

    const dropdowns =
        document.querySelectorAll(
            "#language, .language-select, [data-language-select]"
        );


    dropdowns.forEach(
        function (dropdown) {

            dropdown.value =
                currentLanguage;

        }
    );

}


/* =========================================================
   SINGLE TEXT TRANSLATION
   ========================================================= */

async function translateText(
    text,
    targetLanguage = currentLanguage
) {

    if (!text) {
        return text;
    }


    if (
        targetLanguage === "en"
    ) {

        return text;

    }


    try {

        const translations =
            await requestBatchTranslation(
                [text],
                targetLanguage
            );


        return (
            translations[0] ||
            text
        );

    } catch (error) {

        console.warn(
            "Translation failed:",
            error
        );


        return text;

    }

}


/* =========================================================
   INITIALIZE LANGUAGE SYSTEM
   ========================================================= */

function initializeLanguageSystem() {

    /*
       Validate saved language.
    */

    if (
        !SMART_TRANSPORT_LANGUAGES[
            currentLanguage
        ]
    ) {

        currentLanguage =
            "en";


        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            "en"
        );

    }


    document.documentElement.lang =
        currentLanguage;


    populateLanguageDropdowns();


    applyPreTranslations();


    /*
       If a non-English language was
       selected previously, automatically
       translate the page after loading.
    */

    if (
        currentLanguage !== "en"
    ) {

        setTimeout(
            async function () {

                showTranslationLoading(
                    true
                );


                try {

                    await translateEntirePage(
                        currentLanguage
                    );

                } finally {

                    showTranslationLoading(
                        false
                    );

                }

            },
            300
        );

    }

}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLanguageSystem();

    }
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.smartTransportLanguage = {

    languages:
        SMART_TRANSPORT_LANGUAGES,

    current:
        function () {

            return currentLanguage;

        },

    change:
        changeLanguage,

    translate:
        translateText,

    translateKey:
        translateKey,

    translatePage:
        translateEntirePage,

    restore:
        restoreOriginalDynamicText,

    populate:
        populateLanguageDropdowns

};


/*
   Backward compatibility.
*/

window.changeLanguage =
    changeLanguage;

window.translateText =
    translateText;

window.translateEntirePage =
    translateEntirePage;

window.restoreOriginalDynamicText =
    restoreOriginalDynamicText;

window.populateLanguageDropdowns =
    populateLanguageDropdowns;


console.log(
    "Smart Transport Language System Loaded"
);
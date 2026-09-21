/* =========================================================
   SHARED SMART TRANSPORT & NER LOGISTICS API CLIENT
   Connects Local App and Government/DMT Portals
   ========================================================= */

const API_BASE_URL = "http://localhost:5000/api";

const ApiService = {
    // 1. ACCOUNTS
    async createAccount(accountType, primaryIdentifier, documents = {}) {
        try {
            const res = await fetch(`${API_BASE_URL}/accounts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountType, primaryIdentifier, documents })
            });
            return await res.json();
        } catch (err) {
            console.error("Account API Error:", err);
            return null;
        }
    },
    // 4. AI ROUTE ANALYSIS
    async getRouteAnalysis(routeDetails) {
        try {
            const res = await fetch(`${API_BASE_URL}/analysis`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(routeDetails)
            });
            return await res.json();
        } catch (err) {
            console.error("AI Analysis Error:", err);
            return null;
        }
    }
    async getAccounts() {
        try {
            const res = await fetch(`${API_BASE_URL}/accounts`);
            return await res.json();
        } catch (err) {
            return [];
        }
    },

    // 2. TRIPS / CARGO MOVEMENTS
    async createTrip(tripData) {
        try {
            const res = await fetch(`${API_BASE_URL}/trips`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tripData)
            });
            return await res.json();
        } catch (err) {
            console.error("Trip Creation Error:", err);
            return null;
        }
    },

    async getTrips() {
        try {
            const res = await fetch(`${API_BASE_URL}/trips`);
            return await res.json();
        } catch (err) {
            return [];
        }
    },

    // 3. ALERTS & INCIDENTS (DMT & SOS)
    async createAlert(alertData) {
        try {
            const res = await fetch(`${API_BASE_URL}/alerts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alertData)
            });
            return await res.json();
        } catch (err) {
            console.error("Alert Creation Error:", err);
            return null;
        }
    },

    async getAlerts() {
        try {
            const res = await fetch(`${API_BASE_URL}/alerts`);
            return await res.json();
        } catch (err) {
            return [];
        }
    }
};

window.ApiService = ApiService;
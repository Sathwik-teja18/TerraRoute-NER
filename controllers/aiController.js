const axios = require('axios');
const Alert = require('../models/Alert');

exports.createIncidentReport = async (req, res) => {
    const { reporterId, reporterType, rawReport, coordinates } = req.body;

    const prompt = `
    You are an emergency disaster response parser for logistics in Northeast India.
    Analyze this incident report: "${rawReport}"
    
    Extract and return ONLY a valid JSON object matching this schema:
    {
      "hazardType": "Landslide" | "Accident" | "Flooding" | "Road Collapse" | "Severe Weather",
      "locationName": "string describing location accurately",
      "severity": "Low" | "Moderate" | "High" | "Critical",
      "roadStatus": "Passable" | "Partially Blocked" | "Completely Blocked",
      "recommendedVehicleAction": "Halt" | "Reroute" | "Proceed with Caution",
      "estimatedDelayMinutes": number,
      "alertSummary": "concise 10-word headline"
    }
    `;

    try {
        const response = await axios.post(process.env.OLLAMA_URL, {
            model: "llama3.2",
            prompt: prompt,
            stream: false,
            format: "json"
        });

        const parsed = JSON.parse(response.data.response);

        // Save parsed alert directly to MongoDB
        const newAlert = await Alert.create({
            reporterId,
            reporterType,
            rawText: rawReport,
            coordinates,
            ...parsed
        });

        res.status(201).json({ success: true, alert: newAlert });
    } catch (error) {
        console.error("Alert Processing Error:", error);
        res.status(500).json({ success: false, error: "Failed to process alert with AI" });
    }
};

exports.getActiveAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ success: true, alerts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
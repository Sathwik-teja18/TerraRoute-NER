const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');

// Create a new Hazard/Emergency Alert
router.post('/', async (req, res) => {
    try {
        const { 
            reporterId, reporterType, rawText, hazardType, 
            locationName, coordinates, severity, roadStatus, 
            recommendedVehicleAction, estimatedDelayMinutes, alertSummary 
        } = req.body;

        const alert = new Alert({
            reporterId,
            reporterType,
            rawText,
            hazardType,
            locationName,
            coordinates,
            severity,
            roadStatus,
            recommendedVehicleAction,
            estimatedDelayMinutes,
            alertSummary
        });

        await alert.save();
        res.status(201).json({ message: 'Alert processed and broadcasted', alert });
    } catch (error) {
        console.error('Alert Generation Error:', error);
        res.status(500).json({ error: 'Server error while generating alert.' });
    }
});

// Get all Alerts (Used for Map markers and DMT Incidents list)
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active alerts.' });
    }
});

// THIS IS THE LINE THAT PREVENTS THE CRASH:
module.exports = router;
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Create a new Trip (Journey/Shipment)
router.post('/', async (req, res) => {
    try {
        const { accountId, origin, destination, priorityLevel, status } = req.body;

        const trip = new Trip({
            accountId,
            origin,
            destination,
            priorityLevel,
            status: status || 'Pending'
        });

        await trip.save();
        
        // Populate account details before sending response for frontend rendering
        await trip.populate('accountId', 'accountType primaryIdentifier');
        
        res.status(201).json({ message: 'Trip registered successfully', trip });
    } catch (error) {
        console.error('Trip Registration Error:', error);
        res.status(500).json({ error: 'Server error while registering trip.' });
    }
});

// Get all Trips (Used for Government Scheduling Dashboard and Queue)
router.get('/', async (req, res) => {
    try {
        // Sort by priority first (1 is highest), then by creation time (FCFS)
        const trips = await Trip.find()
            .populate('accountId', 'accountType primaryIdentifier')
            .sort({ priorityLevel: 1, createdAt: 1 });
            
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trips.' });
    }
});

module.exports = router;
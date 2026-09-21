const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    reporterId: { type: String, required: true }, // User Name or Truck Plate
    reporterType: { type: String, enum: ['Traveller', 'Cargo', 'FieldOfficer'], required: true },
    rawText: { type: String, required: true },
    hazardType: { type: String, required: true },
    locationName: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
    roadStatus: { type: String, enum: ['Passable', 'Partially Blocked', 'Completely Blocked'], required: true },
    recommendedVehicleAction: { type: String, required: true },
    estimatedDelayMinutes: { type: Number, default: 0 },
    alertSummary: { type: String, required: true },
    verifiedByDisasterTeam: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
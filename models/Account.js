const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountType: { type: String, enum: ['Traveller', 'Cargo'], required: true },
    primaryIdentifier: { type: String, required: true, unique: true }, // Name for Traveller, Plate for Cargo
    documents: {
        drivingLicense: {
            type: String
        },

        emissionTest: {
            type: String
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
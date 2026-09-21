const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    priorityLevel: { type: Number, default: 3, min: 1, max: 3 },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
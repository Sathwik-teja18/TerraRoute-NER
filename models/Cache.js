const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
    cacheKey: { type: String, required: true, unique: true },
    serviceType: { type: String, enum: ['Weather', 'Geocode', 'Route'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-purges after 1 hour
});

module.exports = mongoose.model('Cache', cacheSchema);
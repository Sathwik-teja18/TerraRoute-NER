const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { origin, destination, distance, duration, risk, status } = req.body;
    
    const prompt = `Act as an expert logistics AI for the North Eastern Region of India. 
    Analyze this route:
    - Origin: ${origin}
    - Destination: ${destination}
    - Distance: ${distance}
    - ETA: ${duration}
    - Risk Level: ${risk}
    - Status: ${status}
    
    Provide a concise, professional 2-sentence safety and feasibility analysis for the driver. Do not use formatting.`;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'mistral',
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();
        res.status(200).json({ analysis: data.response });
    } catch (error) {
        console.error('Mistral Engine Error:', error);
        res.status(500).json({ error: 'AI analysis engine is currently unreachable.' });
    }
});

module.exports = router;
const express = require('express');

const router = express.Router();


const {
    createIncidentReport
} = require('../controllers/aiController');


const {
    getWeather
} = require('../controllers/serviceController');


const {
    getTrips,
    createTrip
} = require('../controllers/tripController');


const {
    getAccounts,
    createAccount
} = require('../controllers/accountController');



/* =========================================================
   AI ALERTS
   ========================================================= */

router.post(
    '/ai/alert',
    createIncidentReport
);



/* =========================================================
   WEATHER
   ========================================================= */

router.get(
    '/services/weather',
    getWeather
);



/* =========================================================
   TRIPS
   ========================================================= */

router.get(
    '/trips',
    getTrips
);

router.post(
    '/trips',
    createTrip
);



/* =========================================================
   ACCOUNTS
   ========================================================= */

router.get(
    '/accounts',
    getAccounts
);

router.post(
    '/accounts',
    createAccount
);



module.exports = router;
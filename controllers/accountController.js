const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Create a new Account (Traveller or Cargo)
router.post('/', async (req, res) => {
    try {
        const { accountType, primaryIdentifier, documents } = req.body;

        // Check if account already exists
        let account = await Account.findOne({ primaryIdentifier });
        if (account) {
            return res.status(400).json({ error: 'Identifier already registered in the system.' });
        }

        account = new Account({
            accountType,
            primaryIdentifier,
            documents
        });

        await account.save();
        res.status(201).json({ message: 'Account created successfully', account });
    } catch (error) {
        console.error('Account Creation Error:', error);
        res.status(500).json({ error: 'Server error while creating account.' });
    }
});

// Get all Accounts
router.get('/', async (req, res) => {
    try {
        const accounts = await Account.find().sort({ createdAt: -1 });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch accounts.' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { calculateTax } = require('../controllers/taxController');

router.post('/calculate', calculateTax);

module.exports = router; 
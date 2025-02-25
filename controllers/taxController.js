const TaxCalculator = require('../models/TaxCalculator');

const calculateTax = (req, res) => {
    try {
        const { annualIncome, deductions } = req.body;
        
        if (!annualIncome) {
            return res.status(400).json({ error: 'Annual income is required' });
        }

        const calculator = new TaxCalculator(annualIncome, deductions || 0);
        const result = calculator.calculate();

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    calculateTax
}; 
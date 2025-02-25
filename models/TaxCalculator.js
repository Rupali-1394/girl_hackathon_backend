class TaxCalculator {
    constructor(annualIncome, deductions) {
        this.annualIncome = parseFloat(annualIncome);
        this.deductions = parseFloat(deductions);
        this.taxableIncome = Math.max(0, this.annualIncome - this.deductions);
    }

    calculate() {
        let tax = 0;
        
        // US Tax Brackets 2024 (Simplified)
        if (this.taxableIncome <= 11600) {
            tax = this.taxableIncome * 0.10;
        } else if (this.taxableIncome <= 47150) {
            tax = 11600 * 0.10 + (this.taxableIncome - 11600) * 0.12;
        } else if (this.taxableIncome <= 100525) {
            tax = 11600 * 0.10 + 35550 * 0.12 + (this.taxableIncome - 47150) * 0.22;
        } else {
            tax = 11600 * 0.10 + 35550 * 0.12 + 53375 * 0.22 + (this.taxableIncome - 100525) * 0.24;
        }

        return {
            annualIncome: this.annualIncome,
            deductions: this.deductions,
            taxableIncome: this.taxableIncome,
            taxAmount: Math.round(tax * 100) / 100,
            netIncome: Math.round((this.annualIncome - tax) * 100) / 100
        };
    }
}

module.exports = TaxCalculator; 
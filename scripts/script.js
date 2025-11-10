 // Tab switching functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and sections
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.calculator-section').forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding section
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Format currency function
        function formatCurrency(amount) {
            return 'Rs. ' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        }
        
        // Withholding Tax Calculation
        document.getElementById('calculateWithholding').addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('withholdingAmount').value);
            const taxType = document.querySelector('input[name="taxType"]:checked').value;
            const errorElement = document.getElementById('withholdingError');
            const resultElement = document.getElementById('withholdingResult');
            
            // Validation
            if (isNaN(amount) || amount <= 0) {
                errorElement.style.display = 'block';
                resultElement.style.display = 'none';
                return;
            }
            
            errorElement.style.display = 'none';
            
            let taxRate, taxAmount, netAmount;
            let taxTypeName = '';
            
            // Calculate based on tax type
            switch(taxType) {
                case 'rent':
                    taxTypeName = 'Rent Tax';
                    taxRate = amount > 100000 ? 0.10 : 0;
                    break;
                case 'bank':
                    taxTypeName = 'Bank Interest Tax';
                    taxRate = 0.05;
                    break;
                case 'dividend':
                    taxTypeName = 'Dividend Tax';
                    taxRate = amount > 100000 ? 0.14 : 0;
                    break;
            }
            
            taxAmount = amount * taxRate;
            netAmount = amount - taxAmount;
            
            // Display results
            document.getElementById('resultTaxType').textContent = taxTypeName;
            document.getElementById('resultAmount').textContent = formatCurrency(amount);
            document.getElementById('resultTaxRate').textContent = (taxRate * 100) + '%';
            document.getElementById('resultTaxAmount').textContent = formatCurrency(taxAmount);
            document.getElementById('resultNetAmount').textContent = formatCurrency(netAmount);
            
            resultElement.style.display = 'block';
        });
        
        // Reset Withholding Tax
        document.getElementById('resetWithholding').addEventListener('click', function() {
            document.getElementById('withholdingAmount').value = '';
            document.getElementById('withholdingError').style.display = 'none';
            document.getElementById('withholdingResult').style.display = 'none';
        });
        
        // Monthly Payable Tax Calculation
        document.getElementById('calculatePayable').addEventListener('click', function() {
            const salary = parseFloat(document.getElementById('monthlySalary').value);
            const errorElement = document.getElementById('monthlySalaryError');
            const resultElement = document.getElementById('payableResult');
            
            // Validation
            if (isNaN(salary) || salary <= 0) {
                errorElement.style.display = 'block';
                resultElement.style.display = 'none';
                return;
            }
            
            errorElement.style.display = 'none';
            
            // Tax brackets for monthly salary
            const brackets = [
                { min: 0, max: 100000, rate: 0 },
                { min: 100001, max: 141667, rate: 0.06 },
                { min: 141668, max: 183333, rate: 0.12 },
                { min: 183334, max: 225000, rate: 0.18 },
                { min: 225001, max: 266667, rate: 0.24 },
                { min: 266668, max: 308333, rate: 0.30 },
                { min: 308334, max: Infinity, rate: 0.36 }
            ];
            
            let remainingSalary = salary;
            let totalTax = 0;
            let breakdownHTML = '';
            
            // Calculate tax for each bracket
            for (let i = 0; i < brackets.length; i++) {
                const bracket = brackets[i];
                let taxableAmount = 0;
                
                if (remainingSalary > bracket.min) {
                    taxableAmount = Math.min(remainingSalary, bracket.max) - bracket.min;
                    if (taxableAmount < 0) taxableAmount = 0;
                    
                    const bracketTax = taxableAmount * bracket.rate;
                    totalTax += bracketTax;
                    
                    // Add to breakdown table
                    const rangeText = bracket.max === Infinity ? 
                        `Above ${formatCurrency(bracket.min)}` : 
                        `${formatCurrency(bracket.min)} - ${formatCurrency(bracket.max)}`;
                    
                    breakdownHTML += `
                        <tr>
                            <td>${rangeText}</td>
                            <td>${bracket.rate * 100}%</td>
                            <td>${formatCurrency(taxableAmount)}</td>
                            <td>${formatCurrency(bracketTax)}</td>
                        </tr>
                    `;
                }
            }
            
            // Display results
            document.getElementById('resultMonthlySalary').textContent = formatCurrency(salary);
            document.getElementById('resultMonthlyTax').textContent = formatCurrency(totalTax);
            document.getElementById('resultNetSalary').textContent = formatCurrency(salary - totalTax);
            document.getElementById('payableBreakdown').innerHTML = breakdownHTML;
            
            resultElement.style.display = 'block';
        });
        
        // Reset Payable Tax
        document.getElementById('resetPayable').addEventListener('click', function() {
            document.getElementById('monthlySalary').value = '';
            document.getElementById('monthlySalaryError').style.display = 'none';
            document.getElementById('payableResult').style.display = 'none';
        });
        
        // Annual Income Tax Calculation
        document.getElementById('calculateIncome').addEventListener('click', function() {
            const income = parseFloat(document.getElementById('annualIncome').value);
            const errorElement = document.getElementById('annualIncomeError');
            const resultElement = document.getElementById('incomeResult');
            
            // Validation
            if (isNaN(income) || income <= 0) {
                errorElement.style.display = 'block';
                resultElement.style.display = 'none';
                return;
            }
            
            errorElement.style.display = 'none';
            
            // Tax brackets for annual income
            const brackets = [
                { min: 0, max: 1200000, rate: 0 },
                { min: 1200001, max: 1700000, rate: 0.06 },
                { min: 1700001, max: 2200000, rate: 0.12 },
                { min: 2200001, max: 2700000, rate: 0.18 },
                { min: 2700001, max: 3200000, rate: 0.24 },
                { min: 3200001, max: 3700000, rate: 0.30 },
                { min: 3700001, max: Infinity, rate: 0.36 }
            ];
            
            let remainingIncome = income;
            let totalTax = 0;
            let breakdownHTML = '';
            
            // Calculate tax for each bracket
            for (let i = 0; i < brackets.length; i++) {
                const bracket = brackets[i];
                let taxableAmount = 0;
                
                if (remainingIncome > bracket.min) {
                    taxableAmount = Math.min(remainingIncome, bracket.max) - bracket.min;
                    if (taxableAmount < 0) taxableAmount = 0;
                    
                    const bracketTax = taxableAmount * bracket.rate;
                    totalTax += bracketTax;
                    
                    // Add to breakdown table
                    const rangeText = bracket.max === Infinity ? 
                        `Above ${formatCurrency(bracket.min)}` : 
                        `${formatCurrency(bracket.min)} - ${formatCurrency(bracket.max)}`;
                    
                    breakdownHTML += `
                        <tr>
                            <td>${rangeText}</td>
                            <td>${bracket.rate * 100}%</td>
                            <td>${formatCurrency(taxableAmount)}</td>
                            <td>${formatCurrency(bracketTax)}</td>
                        </tr>
                    `;
                }
            }
            
            // Display results
            document.getElementById('resultAnnualIncome').textContent = formatCurrency(income);
            document.getElementById('resultAnnualTax').textContent = formatCurrency(totalTax);
            document.getElementById('resultAnnualNet').textContent = formatCurrency(income - totalTax);
            document.getElementById('incomeBreakdown').innerHTML = breakdownHTML;
            
            resultElement.style.display = 'block';
        });
        
        // Reset Income Tax
        document.getElementById('resetIncome').addEventListener('click', function() {
            document.getElementById('annualIncome').value = '';
            document.getElementById('annualIncomeError').style.display = 'none';
            document.getElementById('incomeResult').style.display = 'none';
        });
        
        // SSCL Tax Calculation
        document.getElementById('calculateSSCL').addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('ssclAmount').value);
            const errorElement = document.getElementById('ssclError');
            const resultElement = document.getElementById('ssclResult');
            
            // Validation
            if (isNaN(amount) || amount <= 0) {
                errorElement.style.display = 'block';
                resultElement.style.display = 'none';
                return;
            }
            
            errorElement.style.display = 'none';
            
            // Calculate SSCL tax
            const saleTax = amount * 0.025;
            const afterSaleTax = amount + saleTax;
            const vat = afterSaleTax * 0.15;
            const totalSSCL = saleTax + vat;
            
            // Display results
            document.getElementById('resultSSCLOriginal').textContent = formatCurrency(amount);
            document.getElementById('resultSaleTax').textContent = formatCurrency(saleTax);
            document.getElementById('resultAfterSale').textContent = formatCurrency(afterSaleTax);
            document.getElementById('resultVAT').textContent = formatCurrency(vat);
            document.getElementById('resultSSCLTotal').textContent = formatCurrency(totalSSCL);
            
            resultElement.style.display = 'block';
        });
        
        // Reset SSCL Tax
        document.getElementById('resetSSCL').addEventListener('click', function() {
            document.getElementById('ssclAmount').value = '';
            document.getElementById('ssclError').style.display = 'none';
            document.getElementById('ssclResult').style.display = 'none';
        });
        
        // Leasing Calculation
        document.getElementById('calculateLeasing').addEventListener('click', function() {
            const loanAmount = parseFloat(document.getElementById('loanAmount').value);
            const interestRate = parseFloat(document.getElementById('interestRate').value);
            const loanYears = parseInt(document.getElementById('loanYears').value);
            
            const loanAmountError = document.getElementById('loanAmountError');
            const interestRateError = document.getElementById('interestRateError');
            const loanYearsError = document.getElementById('loanYearsError');
            const resultElement = document.getElementById('leasingResult');
            
            // Validation
            let hasError = false;
            
            if (isNaN(loanAmount) || loanAmount <= 0) {
                loanAmountError.style.display = 'block';
                hasError = true;
            } else {
                loanAmountError.style.display = 'none';
            }
            
            if (isNaN(interestRate) || interestRate <= 0) {
                interestRateError.style.display = 'block';
                hasError = true;
            } else {
                interestRateError.style.display = 'none';
            }
            
            if (isNaN(loanYears) || loanYears <= 0 || loanYears > 5) {
                loanYearsError.style.display = 'block';
                hasError = true;
            } else {
                loanYearsError.style.display = 'none';
            }
            
            if (hasError) {
                resultElement.style.display = 'none';
                return;
            }
            
            // Calculate EMI using the formula: (A × i) / (1 - (1 / (1 + i)^n))
            const monthlyInterestRate = interestRate / 100 / 12;
            const numberOfPayments = loanYears * 12;
            const emi = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
            const totalPayment = emi * numberOfPayments;
            const totalInterest = totalPayment - loanAmount;
            
            // Display results
            document.getElementById('resultLoanAmount').textContent = formatCurrency(loanAmount);
            document.getElementById('resultInterestRate').textContent = interestRate.toFixed(2) + '%';
            document.getElementById('resultLoanTerm').textContent = loanYears + ' years';
            document.getElementById('resultEMI').textContent = formatCurrency(emi);
            document.getElementById('resultTotalPayment').textContent = formatCurrency(totalPayment);
            document.getElementById('resultTotalInterest').textContent = formatCurrency(totalInterest);
            
            // Generate plan comparison
            let comparisonHTML = '';
            for (let years = 3; years <= 5; years++) {
                const n = years * 12;
                const comparisonEMI = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -n));
                const comparisonTotal = comparisonEMI * n;
                const comparisonInterest = comparisonTotal - loanAmount;
                
                comparisonHTML += `
                    <tr>
                        <td>${years} years</td>
                        <td>${formatCurrency(comparisonEMI)}</td>
                        <td>${formatCurrency(comparisonTotal)}</td>
                        <td>${formatCurrency(comparisonInterest)}</td>
                    </tr>
                `;
            }
            
            document.getElementById('leasingComparison').innerHTML = comparisonHTML;
            resultElement.style.display = 'block';
        });
        
        // Reset Leasing
        document.getElementById('resetLeasing').addEventListener('click', function() {
            document.getElementById('loanAmount').value = '';
            document.getElementById('interestRate').value = '';
            document.getElementById('loanYears').value = '';
            document.getElementById('loanAmountError').style.display = 'none';
            document.getElementById('interestRateError').style.display = 'none';
            document.getElementById('loanYearsError').style.display = 'none';
            document.getElementById('leasingResult').style.display = 'none';
        });
document.getElementById('wage-mode').addEventListener('change', function() {
    const mode = this.value;
    const hoursWorkedInput = document.getElementById('hours-worked-input');
    const totalAmountInput = document.getElementById('total-amount-input');

    if (mode === 'calculate-wage') {
        hoursWorkedInput.style.display = 'block';
        totalAmountInput.style.display = 'none';
    } else {
        hoursWorkedInput.style.display = 'none';
        totalAmountInput.style.display = 'block';
    }
});

function calculateWage() {
    const hourlyWage = parseFloat(document.getElementById('hourly-wage').value);
    const hoursWorked = document.getElementById('hours-worked').value;

    if (isNaN(hourlyWage) || !hoursWorked) {
        document.getElementById('wage-result').textContent = 'Please enter valid numbers for hourly wage and hours worked.';
        return;
    }

    const [days, hours, minutes] = hoursWorked.split(':').map(Number);
    const totalHours = (days || 0) * 24 + (hours || 0) + (minutes || 0) / 60;

    const totalAmount = hourlyWage * totalHours;
    document.getElementById('wage-result').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

function calculateHours() {
    const hourlyWage = parseFloat(document.getElementById('hourly-wage').value);
    const totalAmount = parseFloat(document.getElementById('total-amount').value);

    if (isNaN(hourlyWage) || isNaN(totalAmount)) {
        document.getElementById('wage-result').textContent = 'Please enter valid numbers for hourly wage and total amount.';
        return;
    }

    const totalHours = totalAmount / hourlyWage;
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);
    const minutes = Math.round((totalHours % 1) * 60);

    document.getElementById('wage-result').textContent = `Hours Worked: ${days}d ${hours}h ${minutes}m`;
}

document.getElementById('calculate').addEventListener('click', function() {
    const mode = document.getElementById('wage-mode').value;
    if (mode === 'calculate-wage') {
        calculateWage();
    } else {
        calculateHours();
    }
});
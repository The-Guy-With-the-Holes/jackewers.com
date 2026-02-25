document.getElementById('convert').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (isNaN(amount)) {
        document.getElementById('conversion-result').textContent = 'Please enter a valid amount.';
        return;
    }

    // Fetch exchange rates from the API
    fetch(`https://v6.exchangerate-api.com/v6/7c0b48b00fedd24f0c45ce67/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                const exchangeRate = data.conversion_rates[toCurrency];
                const convertedAmount = amount * exchangeRate;
                document.getElementById('conversion-result').textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
            } else {
                document.getElementById('conversion-result').textContent = 'Error fetching exchange rates.';
            }
        })
        .catch(error => {
            document.getElementById('conversion-result').textContent = 'Error fetching exchange rates.';
            console.error('Error:', error);
        });
});


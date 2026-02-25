document.querySelectorAll('nav ul li a').forEach(navItem => {
    navItem.addEventListener('click', function(event) {
        showCalculator(event.target.id.replace('nav-', '') + '-container', this);
    });
});

function showCalculator(calculatorId, navElement) {
    const calculators = ['calculator-container', 'wage-calculator-container', 'currency-converter-container'];
    calculators.forEach(id => {
        document.getElementById(id).style.display = (id === calculatorId) ? 'block' : 'none';
    });
    setActiveNav(navElement);
}

function setActiveNav(activeElement) {
    document.querySelectorAll('nav ul li a').forEach(navItem => {
        navItem.classList.remove('active');
    });
    activeElement.classList.add('active');
}

// Set default active nav item
document.getElementById('nav-calculator').classList.add('active');
document.getElementById('calculator-container').style.display = 'block';
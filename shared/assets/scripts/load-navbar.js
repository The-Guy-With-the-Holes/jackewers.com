// Load navbar component
(function() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('/shared/assets/components/navbar.html')
            .then(response => response.text())
            .then(html => {
                navPlaceholder.innerHTML = html;
                
                // Initialize navbar after it's loaded
                initializeNavbar();
          })
            .catch(error => {
                console.error('Error loading navbar:', error);
            });
    }
})();

function initializeNavbar() {
    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.textContent = navLinks.classList.contains('open') ? 'CLOSE ✕' : 'MENU ☰';
        });
        
        // Mobile dropdown toggle
        document.querySelectorAll('.nav-item .has-dropdown').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closest('.nav-item').classList.toggle('mobile-open');
                }
            });
        });
        
        // Close nav when clicking on a non-dropdown link
        document.querySelectorAll('.nav-link:not(.has-dropdown)').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.textContent = 'MENU ☰';
            });
        });
        
        // Close nav when clicking dropdown items
        document.querySelectorAll('.nav-dropdown-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.textContent = 'MENU ☰';
            });
        });
        
        // Set active page
        const currentPage = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (
                (page === 'home' && currentPage === '/') ||
                (page !== 'home' && currentPage.includes(`/${page}`))
            ) {
                link.classList.add('active');
            }
        });
    }
}

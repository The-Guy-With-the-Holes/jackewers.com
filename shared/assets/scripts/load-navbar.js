// Load navbar component
(function() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        const siteBaseUrl = getSiteBaseUrl();
        const navbarUrl = new URL('shared/assets/components/navbar.html', siteBaseUrl).toString();

        fetch(navbarUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} while loading navbar`);
                }
                return response.text();
            })
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

function getSiteBaseUrl() {
    const currentScript = document.currentScript ||
        Array.from(document.scripts).find(script =>
            script.src && script.src.includes('/shared/assets/scripts/load-navbar.js')
        );

    if (currentScript && currentScript.src) {
        // load-navbar.js lives at shared/assets/scripts/, so 3 levels up is project base.
        return new URL('../../../', currentScript.src);
    }

    const baseHref = document.querySelector('base')?.getAttribute('href');
    if (baseHref) {
        return new URL(baseHref, window.location.href);
    }

    return new URL('./', window.location.href);
}

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
        
        // Set active page on top-level nav links
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

        // Set active state on matching dropdown item
        document.querySelectorAll('.nav-dropdown-link').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            // Exact match, or current path starts with href (for sub-pages)
            if (
                currentPage === href ||
                (href !== '/' && currentPage.startsWith(href + '/')) ||
                (href !== '/' && currentPage === href)
            ) {
                link.classList.add('active');
                // Also ensure the parent nav-link shows active
                const parentNavItem = link.closest('.nav-item');
                if (parentNavItem) {
                    const parentLink = parentNavItem.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        });
    }
}

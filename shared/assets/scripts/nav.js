/**
 * Modern Navigation System
 * Handles responsive navigation, mobile menu, theme switching, and active states
 */

class ModernNavigation {
    constructor() {
        this.mobileMenuOpen = false;

        // Check for existing dark mode preference from localStorage
        const existingPreference = localStorage.getItem('user-prefers-colorMode');

        // Default to browser preference if no user preference is found
        if (!existingPreference) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        } else {
            this.currentTheme = existingPreference;
        }

        // Apply the theme immediately
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        this.currentPage = this.detectCurrentPage();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setActiveNavItem();
        this.applyTheme();

        // Defer the updateThemeIcons call until the DOM is fully loaded
        window.addEventListener('load', () => {
            this.updateThemeIcons();
        });

        this.handleResponsiveLayout();

        // Listen for window resize
        window.addEventListener('resize', () => this.handleResponsiveLayout());

        console.log('Modern Navigation initialized');
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileClose = document.getElementById('mobile-menu-close');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Add click handler to entire navigation container on mobile
        const mainNavigation = document.querySelector('.main-navigation');
        if (mainNavigation) {
            console.log('Main navigation found, adding click handler');
            mainNavigation.addEventListener('click', (e) => {
                console.log('Navigation clicked, window width:', window.innerWidth);
                // Only handle clicks on mobile screens
                if (window.innerWidth <= 767) {
                    // Prevent clicks on desktop menu items from triggering mobile menu
                    if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-actions .theme-toggle')) {
                        console.log('Triggering mobile menu toggle');
                        this.toggleMobileMenu();
                    }
                }
            });
        } else {
            console.log('Main navigation not found');
        }
        
        if (mobileClose) {
            mobileClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Theme toggle buttons
        const themeToggles = [
            document.getElementById('theme-toggle'),
            document.getElementById('sidebar-theme-toggle'),
            document.getElementById('mobile-theme-toggle')
        ].filter(Boolean);
        
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
        
        // Navigation link clicks
        document.querySelectorAll('.nav-link, .sidebar-nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Close mobile menu if clicking internal links
                if (link.classList.contains('mobile-nav-link') && !link.href.startsWith('http')) {
                    this.closeMobileMenu();
                }
                
                // Update active state
                this.updateActiveState(link);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }
    
    detectCurrentPage() {
        let path = window.location.pathname.toLowerCase();
        // Remove trailing slashes and index.html (including subfolders)
        path = path.replace(/\/index\.html$/, '/');
        path = path.replace(/\/$/, '');
        if (path === '' || path === '/') return 'home';
        if (path === '/About' || path === '/About/index.html') return 'about';
        if (path === '/projects' || path === '/projects/' || path === '/projects') return 'projects';
        if (path === '/projects/index.html') return 'projects';
        if (path === '/linktree' || path === '/linktree.html') return 'linktree';
        if (path === '/certificates' || path === '/certificates/certificates.html') return 'certificates';
        return 'other';
    }
    
    updatePageIndicator() {
        const pageIcon = document.getElementById('current-page-icon');
        const pageName = document.getElementById('current-page-name');
        
        if (!pageIcon || !pageName) return;
        
        const pageInfo = {
            'home': { icon: '🏠', name: 'Home' },
            'about': { icon: '👤', name: 'About Me' },
            'projects': { icon: '💼', name: 'Projects' },
            'linktree': { icon: '🔗', name: 'Links' },
            'certificates': { icon: '🏆', name: 'Certificates' },
            'other': { icon: '📄', name: 'Page' }
        };
        
        const info = pageInfo[this.currentPage] || pageInfo['other'];
        pageIcon.textContent = info.icon;
        pageName.textContent = info.name;
    }
    
    setActiveNavItem() {
        // Remove all active states
        document.querySelectorAll('.nav-link, .sidebar-nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active state to current page
        document.querySelectorAll(`[data-page="${this.currentPage}"]`).forEach(link => {
            link.classList.add('active');
        });
        
        // Update page indicator
        this.updatePageIndicator();
    }
    
    updateActiveState(clickedLink) {
        const page = clickedLink.getAttribute('data-page');
        if (page) {
            this.currentPage = page;
            this.setActiveNavItem();
        }
    }
    
    toggleMobileMenu() {
        console.log('toggleMobileMenu called, current state:', this.mobileMenuOpen);
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        console.log('Menu element:', menu);
        console.log('Overlay element:', overlay);
        
        if (this.mobileMenuOpen) {
            console.log('Opening mobile menu');
            this.openMobileMenu();
        } else {
            console.log('Closing mobile menu');
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.mobileMenuOpen = true;
            
            // // Focus management
            // const firstLink = menu.querySelector('.mobile-nav-link');
            // if (firstLink) {
            //     setTimeout(() => firstLink.focus(), 100);
            // }
        }
    }
    
    closeMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.mobileMenuOpen = false;
            // Always re-apply active nav item after closing menu
            this.setActiveNavItem();
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme() {
        // Update the root data-theme attribute
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Update theme toggle icons
        setTimeout(() => {
            this.updateThemeIcons(); // Ensure icons are updated after theme is applied
        }, 0);

        // Store preference
        localStorage.setItem('user-prefers-colorMode', this.currentTheme);

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.currentTheme } 
        }));
    }
    
    updateHeaderImage(theme) {
        const headerImg = document.getElementById('header-img');
        if (headerImg) {
            if (theme === 'dark') {
                headerImg.src = '/i/branding/banner-img-dark.webp';
            } else {
                headerImg.src = '/i/branding/banner-img-light.webp';
            }
        }
    }
    
    updateThemeIcons() {
        const themeIcons = document.querySelectorAll('.theme-icon.nav-icon');
        const currentTheme = document.documentElement.getAttribute('data-theme');

        themeIcons.forEach(icon => {
            icon.innerText = currentTheme === 'dark' ? '🌙': '☀️'
        });
    }
    
    handleKeyboardNavigation(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Enter or Space on theme toggle
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('theme-toggle')) {
            e.preventDefault();
            this.toggleTheme();
        }
    }
    
    // Public methods for external use
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getCurrentPage() {
        return this.currentPage;
    }
    
    setCurrentPage(page) {
        this.currentPage = page;
        this.setActiveNavItem();
    }

        /**
         * Handles responsive layout changes for navigation
         * Shows/hides mobile/desktop nav based on window width
         */
        handleResponsiveLayout() {
            const isDesktop = window.innerWidth >= 1024;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            const isMobile = window.innerWidth < 768;

            // Desktop nav
            const desktopNav = document.getElementById('desktop-nav');
            // Sidebar nav
            const sidebarNav = document.getElementById('sidebar-nav');
            // Mobile nav
            const mobileNav = document.getElementById('mobile-menu');
            // Mobile menu toggle
            const mobileToggle = document.getElementById('mobile-menu-toggle');

            if (isDesktop) {
                if (desktopNav) desktopNav.style.display = '';
                if (sidebarNav) sidebarNav.style.display = '';
                if (mobileNav) mobileNav.style.display = 'none';
                if (mobileToggle) mobileToggle.style.display = 'none';
            } else if (isTablet) {
                if (desktopNav) desktopNav.style.display = 'none';
                if (sidebarNav) sidebarNav.style.display = '';
                if (mobileNav) mobileNav.style.display = 'none';
                if (mobileToggle) mobileToggle.style.display = '';
            } else if (isMobile) {
                if (desktopNav) desktopNav.style.display = 'none';
                if (sidebarNav) sidebarNav.style.display = 'none';
                if (mobileNav) mobileNav.style.display = '';
                if (mobileToggle) mobileToggle.style.display = '';
            }
        }
}

// Layout Management Class
class LayoutManager {
    constructor() {
        this.currentLayout = this.detectLayout();
        this.init();
    }
    
    init() {
        this.setupLayoutContainer();
        this.handleWindowResize();
        
        window.addEventListener('resize', () => this.handleWindowResize());
        
        console.log('Layout Manager initialized');
    }
    
    detectLayout() {
        const width = window.innerWidth;
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }
    
    setupLayoutContainer() {
        const body = document.body;
        
        // Add layout container class if not present
        if (!body.classList.contains('layout-container')) {
            body.classList.add('layout-container');
        }
        
        this.updateLayoutClasses();
    }
    
    updateLayoutClasses() {
        const body = document.body;
        
        // Remove old layout classes
        body.classList.remove('desktop-layout', 'tablet-layout', 'mobile-layout');
        
        // Add current layout class
        body.classList.add(`${this.currentLayout}-layout`);
        
        // Update main content structure
        this.updateContentStructure();
    }
    
    updateContentStructure() {
        const main = document.querySelector('main');
        if (!main) return;
        
        // Add appropriate classes based on layout
        main.classList.toggle('main-content', true);
        
        // For desktop layout, ensure proper grid structure
        if (this.currentLayout === 'desktop') {
            this.setupDesktopGrid();
        }
    }
    
    setupDesktopGrid() {
        const main = document.querySelector('main');
        if (!main) return;
        
        // Check if page should use grid layout
        const shouldUseGrid = !main.classList.contains('no-grid') && 
                             !document.body.classList.contains('single-column');
        
        if (shouldUseGrid && !main.querySelector('.content-grid')) {
            // Wrap content in grid if not already done
            const content = Array.from(main.children);
            const gridContainer = document.createElement('div');
            gridContainer.className = 'content-grid';
            
            const mainContent = document.createElement('div');
            mainContent.className = 'content-main';
            
            // Move existing content to main area
            content.forEach(child => mainContent.appendChild(child));
            
            gridContainer.appendChild(mainContent);
            main.appendChild(gridContainer);
        }
    }
    
    handleWindowResize() {
        const newLayout = this.detectLayout();
        
        if (newLayout !== this.currentLayout) {
            this.currentLayout = newLayout;
            this.updateLayoutClasses();
            
            // Dispatch layout change event
            window.dispatchEvent(new CustomEvent('layoutChanged', {
                detail: { layout: this.currentLayout }
            }));
        }
    }
    
    // Public methods
    getCurrentLayout() {
        return this.currentLayout;
    }
    
    isDesktop() {
        return this.currentLayout === 'desktop';
    }
    
    isTablet() {
        return this.currentLayout === 'tablet';
    }
    
    isMobile() {
        return this.currentLayout === 'mobile';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation system
    window.modernNav = new ModernNavigation();
    
    // Initialize layout manager
    window.layoutManager = new LayoutManager();
    
    // Global utility functions for backward compatibility
    window.toggleVerticalNav = (action) => {
        if (action === 'open') {
            window.modernNav.openMobileMenu();
        } else if (action === 'close') {
            window.modernNav.closeMobileMenu();
        } else {
            window.modernNav.toggleMobileMenu();
        }
    };
    

    // Override existing DarkModeSwitch to work with new system
    window.DarkModeSwitch = () => {
        window.modernNav.toggleTheme();
    };
    
    // Also update any existing dark mode functions
    if (typeof window.checkDarkMode === 'function') {
        const originalCheckDarkMode = window.checkDarkMode;
        window.checkDarkMode = () => {
            return window.modernNav ? window.modernNav.getCurrentTheme() === 'dark' : originalCheckDarkMode();
        };
    }
    
    // Enhanced console styling for development
    console.log(
        '%c🚀 Modern Navigation & Layout System Loaded!', 
        'color: #00aabb; font-weight: bold; font-size: 14px;'
    );
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernNavigation, LayoutManager };
}
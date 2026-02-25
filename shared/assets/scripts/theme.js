// Theme Manager - Dark Mode Default, Light Mode Optional
(function() {
    // Check for saved theme preference or default to 'dark' 
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply LIGHT theme if saved (dark is default, no class needed)
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.body.classList.add('light-mode');
    }
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create and inject theme toggle button - fixed in bottom right
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle light mode');
        themeToggle.textContent = currentTheme === 'light' ? '☀️' : '🌙';
        
        // Add to body
        document.body.appendChild(themeToggle);
        
        // Toggle theme on click
        themeToggle.addEventListener('click', function() {
            const isLight = document.body.classList.contains('light-mode');
            
            if (isLight) {
                // Switch to dark (remove light-mode class)
                document.documentElement.classList.remove('light-mode');
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                this.textContent = '🌙';
            } else {
                // Switch to light (add light-mode class)
                document.documentElement.classList.add('light-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                this.textContent = '☀️';
            }
        });
    });
})();

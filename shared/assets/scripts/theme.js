// Theme toggle button.
//
// The theme itself is resolved and applied by early-theme.js in <head> (see
// that file for why both a class and an attribute are set). This script only
// builds the toggle control and delegates the actual switch to applyTheme.
(function() {
    // Fallback if early-theme.js is missing, so the toggle still works.
    var applyTheme = window.applyTheme || function(next, persist) {
        var isLight = next === 'light';
        document.documentElement.setAttribute('data-theme', next);
        document.documentElement.classList.toggle('light-mode', isLight);
        document.body.classList.toggle('light-mode', isLight);
        if (persist) {
            try {
                localStorage.setItem('theme', next);
                localStorage.setItem('user-prefers-colorMode', next);
            } catch (e) { /* non-fatal */ }
        }
    };
    var getTheme = window.getTheme || function() {
        return document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    };

    document.addEventListener('DOMContentLoaded', function() {
        var themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle light mode');

        function render() {
            var isLight = getTheme() === 'light';
            themeToggle.textContent = isLight ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-pressed', String(isLight));
        }

        render();
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', function() {
            applyTheme(getTheme() === 'light' ? 'dark' : 'light', true);
            render();
        });

        // Keep in sync if another script (e.g. nav.js) switches the theme.
        window.addEventListener('themeChanged', render);
    });
})();

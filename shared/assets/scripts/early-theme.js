// Canonical theme resolver.
//
// Load this in <head>, BEFORE any stylesheet-dependent paint. Without it the
// page paints nav.css's hardcoded dark background first and only corrects to
// light once a body-level script runs - a visible flash on every navigation.
//
// Two hooks are set because the stylesheets are split across two conventions:
//   .light-mode class -> design-system.css, nav.css, styles.css
//   [data-theme] attr -> vars.css, simple-nav.css, projects.css
// Keeping both in sync is what makes a preference set on one page hold on the
// next. Likewise two storage keys are written: 'theme' is canonical, but
// nav.js still reads the older 'user-prefers-colorMode'.
(function () {
    var STORAGE_KEY = 'theme';
    var LEGACY_KEY = 'user-prefers-colorMode';

    function read() {
        try {
            return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        } catch (e) {
            return null; // storage blocked (private mode, embedded webview)
        }
    }

    // Dark is the site default when nothing is stored.
    var stored = read();
    var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';

    // Shared by theme.js's toggle so both hooks always move together.
    window.applyTheme = function (next, persist) {
        var isLight = next === 'light';
        var root = document.documentElement;

        root.setAttribute('data-theme', next);
        root.classList.toggle('light-mode', isLight);
        // <body> doesn't exist yet when this runs in <head>.
        if (document.body) {
            document.body.classList.toggle('light-mode', isLight);
        }

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, next);
                localStorage.setItem(LEGACY_KEY, next);
            } catch (e) { /* non-fatal */ }
        }
    };

    window.getTheme = function () {
        return document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    };

    window.applyTheme(theme, false);

    // Mirror the class onto <body> once it has been parsed.
    document.addEventListener('DOMContentLoaded', function () {
        window.applyTheme(window.getTheme(), false);
    });
})();

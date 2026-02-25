// Set initial theme before other scripts run

(function() {
    const root = document.documentElement;
    const userPreference = localStorage.getItem('user-prefers-colorMode');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = userPreference || systemPreference;
    root.setAttribute('data-theme', theme);
})();
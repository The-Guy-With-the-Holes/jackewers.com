/**
 * set-base-href.js
 * 
 * Dynamically sets the <base> href to ensure all root-absolute paths work
 * correctly in both production (domain root) and development (nested paths).
 * 
 * This script must run before any other scripts that load resources.
 */
(function() {
    function getProjectBaseUrl() {
        const currentScript = document.currentScript;
        
        if (currentScript && currentScript.src) {
            // Script is at /shared/assets/scripts/set-base-href.js
            // Project root is 3 levels up: shared/assets/scripts/ -> project root
            return new URL('../../../', currentScript.src).toString();
        }
        
        // Fallback: check for existing base tag
        const existingBase = document.querySelector('base');
        if (existingBase && existingBase.href) {
            return existingBase.href;
        }
        
        // Fallback: use current page location as base
        // This works for root-level pages and nested pages
        return window.location.href.split('?')[0].split('#')[0];
    }
    
    // Create or update the <base> tag
    let baseTag = document.querySelector('base');
    if (!baseTag) {
        baseTag = document.createElement('base');
        document.head.insertBefore(baseTag, document.head.firstChild);
    }
    
    const baseUrl = getProjectBaseUrl();
    baseTag.href = baseUrl;
})();

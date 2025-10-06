/**
 * Social Links API - Configuration Examples
 * Define SocialConfig before including SocialLinksAPI.js
 */

// ============================================
// FULL CONFIGURATION EXAMPLE
// ============================================

const SocialConfig = {
    // Auto-create components
    createFooter: true,
    createLinkTree: false,

    // Profile information
    profile: {
        name: 'Jack Ewers',
        handle: '@the_guy_with_the_holes',
        avatar: '/i/web-ready/image_1.jpeg'
    },

    // Theme settings
    theme: {
        type: 'balls',        // 'balls' | 'list' | 'cards'
        layout: 'horizontal', // 'horizontal' | 'vertical'
        radius: '50%',        // CSS border-radius value
        hoverEffect: true
    },

    // Typography
    typography: {
        fontFamily: 'Rubik, sans-serif',
        fontSize: '1rem',
        fontWeight: '500',
        color: 'var(--font-main)'
    },

    // Footer configuration
    footer: {
        container: 'footer',           // selector or element
        className: 'social-footer',
        showIcons: true,
        showText: false,
        layout: 'horizontal'
    },

    // Linktree configuration
    linktree: {
        container: '#AML_linkcontainer', // selector or element
        className: 'social-linktree',
        showHeader: true,
        showShareButtons: true,
        maxWidth: '600px'
    },

    // Branding
    branding: {
        enabled: true,
        text: 'Powered by JackEwers.com',
        url: 'https://jackewers.com',
        logo: '/favicon.ico'
    },

    // Social media links [name, url, icon, settings]
    links: [
        ['JackEwers.com', 'https://jackewers.com', '/favicon.ico'],
        ['Phone', 'tel:+61479000429', '/i/Icons/Phone.png', 'footer:no,shareable:no'],
        ['Email', 'mailto:webmaster@jackewers.com', '/i/Icons/Mail.png', 'shareable:no'],
        ['LinkedIn', 'https://linkedin.com/in/jack-ewers-14a155212/', 'https://linkedin.com/favicon.ico'],
        ['GitHub', 'https://github.com/The-Guy-With-the-Holes', 'https://github.com/favicon.ico'],
    ],

    // Custom Styling System (Override API styles)
    customStyles: {
        enabled: false,         // Set to true to enable custom styling
        useApiStyles: false,    // Set to true to merge with API styles, false to replace

        // Main container styling
        container: {
            classes: 'my-custom-container',
            styles: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                padding: '3rem 2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }
        },

        // Links container styling
        linksContainer: {
            classes: 'my-links-wrapper',
            styles: {
                gap: '1.5rem'
            }
        },

        // Individual link styling
        linkItem: {
            classes: 'my-custom-link',
            styles: {
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '15px',
                padding: '1.2rem 1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }
        },

        // Header styling
        header: {
            classes: 'my-custom-header',
            styles: {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '2rem',
                marginBottom: '2rem'
            }
        },

        // Icon styling
        icon: {
            classes: 'my-custom-icon',
            styles: {
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }
        },

        // Text styling
        text: {
            classes: 'my-custom-text',
            styles: {
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }
        }
    }
};

// ============================================
// MINIMAL CONFIGURATION EXAMPLES
// ============================================

/*
// Simple Footer Only
const SocialConfig = {
    createFooter: true,
    theme: { type: 'balls' },
    links: [
        ['Website', 'https://yoursite.com', '/favicon.ico'],
        ['Email', 'mailto:you@yoursite.com', '/email-icon.png'],
    ]
};
*/

/*
// Simple Linktree Only
const SocialConfig = {
    createLinkTree: true,
    profile: {
        handle: '@your_handle',
        avatar: '/avatar.jpg'
    },
    links: [
        ['Website', 'https://yoursite.com', '/favicon.ico'],
        ['Instagram', 'https://instagram.com/you', '/insta-icon.png'],
        ['Twitter', 'https://twitter.com/you', '/twitter-icon.png'],
    ]
};
*/

// ============================================
// MANUAL USAGE (No auto-create)
// ============================================

/*
// Create API instance without auto-creation
const socialAPI = new SocialLinksAPI({
    profile: { handle: '@username', avatar: '/avatar.jpg' },
    links: [
        ['Website', 'https://site.com', '/favicon.ico'],
        ['Email', 'mailto:contact@site.com', '/email.png']
    ]
});

// Manually create components when needed
socialAPI.createFooter({ container: '#footer', showText: true });
socialAPI.createLinkTree({ container: '#linktree' });

// Or with custom options
socialAPI.createFooter({
    container: document.querySelector('.my-footer'),
    showIcons: false,
    showText: true,
    layout: 'vertical'
});
*/
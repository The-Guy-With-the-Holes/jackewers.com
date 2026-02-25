/**
 * Social Links API - Modular & Robust
 * A clean, focused API for creating social media link components
 * Core Functions: createFooter() and createLinkTree()
 */

class SocialLinksAPI {
    constructor(config = {}) {
        // Core configuration with sensible defaults
        this.config = {
            // Data
            links: config.links || [],
            profile: config.profile || { name: '', handle: '', avatar: '' },
            
            // Behavior
            createFooter: config.createFooter || false,
            createLinkTree: config.createLinkTree || false,
            
            // Styling
            theme: {
                type: 'balls', // 'balls' | 'list' | 'cards'
                layout: 'horizontal', // 'horizontal' | 'vertical'
                radius: '50%',
                hoverEffect: true,
                ...config.theme
            },
            
            // Typography
            typography: {
                fontFamily: 'inherit',
                fontSize: '1rem',
                fontWeight: 'normal',
                color: 'inherit',
                ...config.typography
            },
            
            // Components
            footer: {
                container: null, // DOM element or selector
                className: 'social-footer',
                showIcons: true,
                showText: false,
                layout: 'horizontal',
                ...config.footer
            },
            
            linktree: {
                container: null, // DOM element or selector
                className: 'social-linktree',
                showHeader: true,
                showShareButtons: true,
                maxWidth: '600px',
                ...config.linktree
            },
            
            // Branding
            branding: {
                enabled: false,
                text: '',
                url: '',
                logo: '',
                ...config.branding
            },

            // Custom Styling Override System
            customStyles: {
                enabled: false,                    // Enable custom styling mode
                useApiStyles: false,              // Whether to merge with API styles or replace
                
                // Container styles
                container: {
                    classes: '',                   // Custom CSS classes for main container
                    styles: {}                     // Custom inline styles for main container
                },
                
                // Links container styles
                linksContainer: {
                    classes: '',                   // Custom CSS classes for links container
                    styles: {}                     // Custom inline styles for links container
                },
                
                // Individual link styles
                linkItem: {
                    classes: '',                   // Custom CSS classes for each link
                    styles: {}                     // Custom inline styles for each link
                },
                
                // Header styles (for linktree)
                header: {
                    classes: '',                   // Custom CSS classes for header
                    styles: {}                     // Custom inline styles for header
                },
                
                // Icon styles
                icon: {
                    classes: '',                   // Custom CSS classes for icons
                    styles: {}                     // Custom inline styles for icons
                },
                
                // Text styles
                text: {
                    classes: '',                   // Custom CSS classes for text
                    styles: {}                     // Custom inline styles for text
                },
                
                ...config.customStyles
            }
        };

        // Initialize if auto-create is enabled
        this.init();
    }

    // Initialize API - only runs auto-create functions
    init() {
        if (this.config.createFooter) this.createFooter();
        if (this.config.createLinkTree) this.createLinkTree();
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    // Create DOM element with attributes
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        // Handle different attribute types
        Object.entries(options).forEach(([key, value]) => {
            switch (key) {
                case 'text':
                    element.textContent = value;
                    break;
                case 'html':
                    element.innerHTML = value;
                    break;
                case 'class':
                case 'className':
                    element.className = value;
                    break;
                case 'style':
                    if (typeof value === 'object') {
                        Object.assign(element.style, value);
                    } else {
                        element.style.cssText = value;
                    }
                    break;
                case 'data':
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                    break;
                default:
                    element.setAttribute(key, value);
            }
        });
        
        return element;
    }

    // Get container element (from selector or element)
    getContainer(container) {
        if (!container) return document.body;
        if (typeof container === 'string') return document.querySelector(container);
        return container;
    }

    // Filter links based on context and settings
    getFilteredLinks(context = 'all') {
        return this.config.links.filter(link => {
            const [name, url, icon, settings = ''] = link;
            
            // Context-specific filtering
            if (context === 'footer' && settings.includes('footer:no')) return false;
            if (context === 'linktree' && settings.includes('linktree:no')) return false;
            
            return true;
        });
    }

    // Apply custom styles and classes to an element
    applyCustomStyling(element, componentType, defaultClasses = '', defaultStyles = {}) {
        const customStyles = this.config.customStyles;
        
        if (!customStyles.enabled) {
            // Use default API styling
            if (defaultClasses) element.className += ` ${defaultClasses}`;
            if (Object.keys(defaultStyles).length > 0) {
                Object.assign(element.style, defaultStyles);
            }
            return element;
        }

        const customConfig = customStyles[componentType] || {};
        
        // Handle classes
        let finalClasses = '';
        if (customStyles.useApiStyles && defaultClasses) {
            finalClasses += defaultClasses;
        }
        if (customConfig.classes) {
            finalClasses += (finalClasses ? ' ' : '') + customConfig.classes;
        }
        if (finalClasses) {
            element.className += (element.className ? ' ' : '') + finalClasses;
        }

        // Handle styles
        let finalStyles = {};
        if (customStyles.useApiStyles && defaultStyles) {
            finalStyles = { ...defaultStyles };
        }
        if (customConfig.styles && Object.keys(customConfig.styles).length > 0) {
            finalStyles = { ...finalStyles, ...customConfig.styles };
        }
        if (Object.keys(finalStyles).length > 0) {
            Object.assign(element.style, finalStyles);
        }

        return element;
    }

    // ============================================
    // CORE COMPONENT CREATORS
    // ============================================

    /**
     * Create Footer Component
     * @param {Object} options - Override default footer config
     * @returns {HTMLElement} - The created footer element
     */
    createFooter(options = {}) {
        // Merge options with footer config
        const config = { ...this.config.footer, ...options };
        const links = this.getFilteredLinks('footer');
        
        // Create main container
        const container = this.createElement('div', {
            class: `${config.className} social-footer-${config.layout} social-theme-${this.config.theme.type}`,
            style: {
                display: 'flex',
                flexDirection: config.layout === 'vertical' ? 'column' : 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem'
            }
        });

        // Create link elements
        links.forEach((linkData, index) => {
            const linkElement = this.createLink(linkData, 'footer', config);
            container.appendChild(linkElement);
        });

        // Add branding if enabled
        if (this.config.branding.enabled) {
            container.appendChild(this.createBranding());
        }

        // Append to container
        const targetContainer = this.getContainer(config.container);
        targetContainer.appendChild(container);

        return container;
    }

    /**
     * Create LinkTree Component
     * @param {Object} options - Override default linktree config
     * @returns {HTMLElement} - The created linktree element
     */
    createLinkTree(options = {}) {
        // Merge options with linktree config
        const config = { ...this.config.linktree, ...options };
        const links = this.getFilteredLinks('linktree');
        
        // Create main container with custom styling support
        const container = this.createElement('div');
        
        // Apply default classes and styles, then custom overrides
        const defaultClasses = `${config.className} social-linktree social-theme-${this.config.theme.type}`;
        const defaultStyles = {
            maxWidth: config.maxWidth,
            margin: '0 auto',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        };
        
        this.applyCustomStyling(container, 'container', defaultClasses, defaultStyles);

        // Create header if enabled
        if (config.showHeader && this.config.profile.handle) {
            container.appendChild(this.createLinktreeHeader());
        }

        // Create links container with custom styling support
        const linksContainer = this.createElement('div');
        
        // Apply default classes and styles for links container
        const linksDefaultClasses = 'linktree-links';
        const linksDefaultStyles = {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        };
        
        this.applyCustomStyling(linksContainer, 'linksContainer', linksDefaultClasses, linksDefaultStyles);

        // Create link elements
        links.forEach((linkData, index) => {
            const linkElement = this.createLink(linkData, 'linktree', config);
            linksContainer.appendChild(linkElement);
        });

        container.appendChild(linksContainer);

        // Add share modal if enabled
        if (config.showShareButtons) {
            this.createShareModal();
        }

        // Add branding
        if (this.config.branding.enabled) {
            container.appendChild(this.createBranding());
        }

        // Append to container
        const targetContainer = this.getContainer(config.container) || 
                              document.querySelector('#AML_linkcontainer') || 
                              document.body;
        targetContainer.appendChild(container);

        return container;
    }

    // ============================================
    // COMPONENT BUILDERS
    // ============================================

    /**
     * Create Linktree Header
     */
    createLinktreeHeader() {
        const profile = this.config.profile;
        
        // Create header with custom styling support
        const header = this.createElement('header');
        
        // Apply default header styling with custom override support
        const defaultHeaderClasses = 'linktree-header';
        const defaultHeaderStyles = {
            textAlign: 'center',
            marginBottom: '2rem'
        };
        
        this.applyCustomStyling(header, 'header', defaultHeaderClasses, defaultHeaderStyles);

        // Avatar
        if (profile.avatar) {
            const avatar = this.createElement('img', {
                src: profile.avatar,
                alt: `${profile.name || profile.handle} avatar`
            });
            
            // Apply custom styling for avatar (using icon component type)
            const defaultAvatarClasses = 'linktree-avatar';
            const defaultAvatarStyles = {
                width: '100px',
                height: '100px',
                borderRadius: this.config.theme.radius,
                objectFit: 'cover',
                marginBottom: '1rem'
            };
            
            this.applyCustomStyling(avatar, 'icon', defaultAvatarClasses, defaultAvatarStyles);
            header.appendChild(avatar);
        }

        // Handle/Title
        if (profile.handle) {
            const title = this.createElement('h1', {
                text: profile.handle
            });
            
            // Apply custom styling for title (using text component type)
            const defaultTitleClasses = 'linktree-title';
            const defaultTitleStyles = {
                margin: '0 0 0.5rem 0',
                fontFamily: this.config.typography.fontFamily,
                fontSize: '1.5rem',
                fontWeight: 'bold'
            };
            
            this.applyCustomStyling(title, 'text', defaultTitleClasses, defaultTitleStyles);
            header.appendChild(title);
        }

        // Name/Subtitle
        if (profile.name && profile.name !== profile.handle) {
            const subtitle = this.createElement('p', {
                text: profile.name
            });
            
            // Apply custom styling for subtitle (using text component type)
            const defaultSubtitleClasses = 'linktree-subtitle';
            const defaultSubtitleStyles = {
                margin: '0',
                opacity: '0.8',
                fontSize: '1rem'
            };
            
            this.applyCustomStyling(subtitle, 'text', defaultSubtitleClasses, defaultSubtitleStyles);
            header.appendChild(subtitle);
        }

        return header;
    }

    /**
     * Create Individual Link Element
     */
    createLink(linkData, context, componentConfig = {}) {
        const [name, url, icon, settings = ''] = linkData;
        const theme = this.config.theme;
        const isExternal = url.startsWith('http');
        
        // Determine display settings based on context
        const showIcon = context === 'footer' ? componentConfig.showIcons : true;
        const showText = context === 'footer' ? componentConfig.showText : true;
        const showShare = context === 'linktree' && 
                         componentConfig.showShareButtons && 
                         !settings.includes('shareable:no');

        // Link container with custom styling support
        const container = this.createElement('div');
        
        // Apply default container styles with custom override support
        const defaultContainerClasses = `social-link-container ${context}-link ${theme.type}-style`;
        const defaultContainerStyles = this.getLinkContainerStyles(context, theme);
        
        this.applyCustomStyling(container, 'linkItem', defaultContainerClasses, defaultContainerStyles);

        // Main link element
        const link = this.createElement('a', {
            href: url,
            target: isExternal ? '_blank' : '_self',
            rel: isExternal ? 'noopener noreferrer' : ''
        });
        
        // Apply default link styles (these are internal and typically wouldn't be overridden)
        Object.assign(link.style, {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            width: '100%',
            gap: '0.75rem'
        });

        // Icon
        if (icon && showIcon) {
            const iconElement = this.createElement('img', {
                src: icon,
                alt: `${name} icon`
            });
            
            // Apply custom styling for icon
            const defaultIconClasses = 'social-icon';
            const defaultIconStyles = {
                width: context === 'footer' ? '24px' : '32px',
                height: context === 'footer' ? '24px' : '32px',
                borderRadius: '4px',
                objectFit: 'cover'
            };
            
            this.applyCustomStyling(iconElement, 'icon', defaultIconClasses, defaultIconStyles);
            link.appendChild(iconElement);
        }

        // Text
        if (showText) {
            const textElement = this.createElement('span', {
                text: name
            });
            
            // Apply custom styling for text
            const defaultTextClasses = 'social-text';
            const defaultTextStyles = {
                fontFamily: this.config.typography.fontFamily,
                fontSize: this.config.typography.fontSize,
                fontWeight: this.config.typography.fontWeight
            };
            
            this.applyCustomStyling(textElement, 'text', defaultTextClasses, defaultTextStyles);
            link.appendChild(textElement);
        }

        container.appendChild(link);

        // Share button for linktree
        if (showShare) {
            const shareBtn = this.createElement('button', {
                html: '⋮',
                class: 'share-btn',
                data: { url: url },
                style: {
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    fontSize: '1.2rem',
                    opacity: '0.6'
                }
            });
            container.appendChild(shareBtn);
        }

        return container;
    }

    /**
     * Get Link Container Styles
     */
    getLinkContainerStyles(context, theme) {
        const baseStyles = {
            borderRadius: theme.radius,
            transition: 'all 0.2s ease',
            cursor: 'pointer'
        };

        if (theme.type === 'balls') {
            return {
                ...baseStyles,
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            };
        }

        if (context === 'linktree') {
            return {
                ...baseStyles,
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            };
        }

        // Footer default
        return {
            ...baseStyles,
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: theme.radius
        };
    }

    /**
     * Create Branding Element
     */
    createBranding() {
        if (!this.config.branding.enabled || !this.config.branding.text) {
            return null;
        }

        const branding = this.createElement('div', {
            class: 'social-branding',
            style: {
                fontSize: '0.85rem',
                opacity: '0.7',
                textAlign: 'center',
                marginTop: '2rem',
                padding: '1rem'
            }
        });

        if (this.config.branding.url) {
            const link = this.createElement('a', {
                href: this.config.branding.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                text: this.config.branding.text,
                style: {
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }
            });

            if (this.config.branding.logo) {
                const logo = this.createElement('img', {
                    src: this.config.branding.logo,
                    alt: 'Logo',
                    style: {
                        width: '16px',
                        height: '16px'
                    }
                });
                link.appendChild(logo);
            }

            branding.appendChild(link);
        } else {
            branding.textContent = this.config.branding.text;
        }

        return branding;
    }

    /**
     * Create Share Modal
     */
    createShareModal() {
        // Prevent duplicate modals
        if (document.getElementById('socialShareModal')) return;

        const modal = this.createElement('div', {
            id: 'socialShareModal',
            class: 'social-share-modal',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10000'
            }
        });

        const modalContent = this.createElement('div', {
            class: 'social-share-content',
            style: {
                background: 'var(--bg-surface, white)',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                color: 'var(--font-main, black)'
            }
        });

        // Title
        const title = this.createElement('h3', {
            text: 'Share this link',
            style: { marginBottom: '1rem' }
        });

        // URL input
        const urlInput = this.createElement('input', {
            type: 'text',
            id: 'socialShareUrl',
            readonly: true,
            style: {
                width: '100%',
                padding: '0.75rem',
                margin: '1rem 0',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '6px',
                background: 'var(--bg-elevated, #f5f5f5)'
            }
        });

        // Buttons container
        const buttonsContainer = this.createElement('div', {
            style: {
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }
        });

        // Copy button
        const copyBtn = this.createElement('button', {
            text: 'Copy Link',
            style: {
                padding: '0.75rem 1.5rem',
                background: 'var(--accent-primary, #007bff)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
            }
        });

        // Close button
        const closeBtn = this.createElement('button', {
            text: 'Close',
            style: {
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '6px',
                cursor: 'pointer'
            }
        });

        buttonsContainer.appendChild(copyBtn);
        buttonsContainer.appendChild(closeBtn);

        modalContent.appendChild(title);
        modalContent.appendChild(urlInput);
        modalContent.appendChild(buttonsContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners
        copyBtn.addEventListener('click', () => {
            urlInput.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy Link', 2000);
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Global share button handler
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                const url = e.target.dataset.url || window.location.href;
                urlInput.value = url;
                modal.style.display = 'flex';
            }
        });
    }

    // ============================================
    // PUBLIC API METHODS
    // ============================================

    /**
     * Add a new link
     */
    addLink(name, url, icon, settings = '') {
        this.config.links.push([name, url, icon, settings]);
        return this;
    }

    /**
     * Remove a link by name
     */
    removeLink(name) {
        this.config.links = this.config.links.filter(link => link[0] !== name);
        return this;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        return this;
    }

    /**
     * Get current links
     */
    getLinks() {
        return [...this.config.links];
    }

    /**
     * Set links (replaces all existing)
     */
    setLinks(links) {
        this.config.links = links;
        return this;
    }

    /**
     * Destroy all created elements
     */
    destroy() {
        document.querySelectorAll('.social-footer, .social-linktree, .social-share-modal').forEach(el => {
            el.remove();
        });
        return this;
    }
}

// ============================================
// AUTO-INITIALIZATION & EXPORTS
// ============================================

// Auto-initialize if SocialConfig is defined globally
if (typeof SocialConfig !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.socialLinksAPI = new SocialLinksAPI(SocialConfig);
        });
    } else {
        window.socialLinksAPI = new SocialLinksAPI(SocialConfig);
    }
}
else {
    console.warn('SocialLinksAPI: No global SocialConfig found. Please initialize manually.');
}
// Make class available globally
window.SocialLinksAPI = SocialLinksAPI;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialLinksAPI;
}
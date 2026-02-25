// Merged logic from projects.js and projects/script.js


let linkdisplay = {};
const LinkContainer = document.querySelector('#link-display');
if (LinkContainer) {
    linkdisplay = {
        containerId: LinkContainer.id || 'link_display',
        items: null // use default
    };
}


class LinkDisplay {
    constructor(settings) {
        this.renderFullProjects = settings?.renderFullProjects || false; // If true, render the projects in full detail

        this.defaultSettings = {
            see_more: 4,
            projects: null,
            sizes: null,
            renderFullProjects: false
        };
        this.document_container = document.getElementById(linkdisplay.containerId) || document.body;
        
        // Updated project array structure:
        // [Title, href, Short desc, Long desc, tags, square image Src, banner image src (optional)]
        this.projects = linkdisplay.projects || placeHolderProjects;

        this.sizeList = settings?.sizes ? Object.keys(settings?.sizes) : (linkdisplay?.sizes ? Object.keys(linkdisplay?.sizes) : ['mobile', 'tablet', 'laptop', 'desktop']);
        
        // Handle both old and new settings formats
        let baseSizes = settings?.sizes || linkdisplay.sizes || {
            mobile: { width: 480, columns: 1, items: 3, special:'banner'},
            tablet: { width: 580, columns: 2, items: 4, special:null},
            laptop: { width: 768, columns: 3, items: 6, special:null},
            desktop: { width: Infinity, columns: 3, items: 6, special:null}
        };
        
        // Convert items to initialItems if needed
        this.sizes = {};
        Object.keys(baseSizes).forEach(key => {
            this.sizes[key] = {
                ...baseSizes[key],
                initialItems: baseSizes[key].initialItems || baseSizes[key].items || 3
            };
        });
        this.linksCreated = 0;
       
        // upper limit of items to make 
        this.maxItems = settings?.maxItems || linkdisplay?.items || 20; 
        
        // See more functionality
        this.seeMoreActive = false;
        this.seeMoreCount = settings?.seeMoreCount || linkdisplay?.see_more || 4;
        this.currentlyShowing = 0; // Track how many we're showing
        this.settings = { ...this.defaultSettings, ...settings };
        
        // Filter and search properties
        this.currentFilter = 'all';
        this.searchTerm = '';
    }

    createLink(item) {
        // New array structure: [Title, href, Short desc, Long desc, tags, square image Src, banner image src (optional)]
        if (this.renderFullProjects) {
            return this.createFullProjectCard(item);
        } else {
            return this.createSimpleProjectCard(item);
        }
    }

    createSimpleProjectCard(item) {
        // Simple card for grid view: [Title, href, Short desc, Long desc, tags, square image Src, banner image src]
        const container = createElement('div', { 
            className: 'link_container',
            'data-category': item[4] ? item[4].join(' ').toLowerCase() : '' // tags as category
        });
        const a = document.createElement('a');
        a.href = item[1]; // href
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        const img = createElement('img', { 
            src: item[5], // square image src
            alt: item[0].split(' ')[0] // title
        });
        a.appendChild(img);
        
        const title = createElement('p', {innerHTML: `<strong>${item[0]}</strong>`}); // title
        a.appendChild(title);
        container.appendChild(a);
        
        const desc = createElement('p', {innerText: item[2] || ''}); // short desc
        container.appendChild(desc);
        
        return container;
    }

    createFullProjectCard(item) {
        // Full project card: [Title, href, Short desc, Long desc, tags, square image Src, banner image src]
        const article = createElement('article', { 
            className: 'project-card animate-in',
            'data-category': item[4] ? item[4].join(' ').toLowerCase() : '' // tags as category
        });

        // Project image section
        const imageDiv = createElement('div', { className: 'project-image' });
        const img = createElement('img', {
            src: item[6] || item[5], // banner image or fallback to square image
            alt: item[0], // title
            loading: 'lazy'
        });
        imageDiv.appendChild(img);

        // Project overlay with badges
        const overlay = createElement('div', { className: 'project-overlay' });
        const badges = createElement('div', { className: 'project-badges' });
        
        // Add tech badges from tags
        if (item[4] && Array.isArray(item[4])) {
            item[4].slice(0, 2).forEach(tag => { // Show first 2 tags as badges
                const badge = createElement('span', { 
                    className: 'project-badge',
                    innerText: tag
                });
                badges.appendChild(badge);
            });
        }
        
        overlay.appendChild(badges);
        imageDiv.appendChild(overlay);
        article.appendChild(imageDiv);

        // Project content section
        const contentDiv = createElement('div', { className: 'project-content' });
        
        // Title
        const titleH3 = createElement('h3', { className: 'project-title' });
        const titleLink = createElement('a', {
            href: item[1], // href
            innerText: item[0] // title
        });
        titleH3.appendChild(titleLink);
        contentDiv.appendChild(titleH3);

        // Description
        const description = createElement('p', {
            className: 'project-description',
            innerText: item[3] || item[2] // long desc or fallback to short desc
        });
        contentDiv.appendChild(description);

        // Tech tags
        if (item[4] && Array.isArray(item[4])) {
            const techDiv = createElement('div', { className: 'project-tech' });
            item[4].forEach(tag => {
                const techTag = createElement('span', {
                    className: 'tech-tag',
                    innerText: tag
                });
                techDiv.appendChild(techTag);
            });
            contentDiv.appendChild(techDiv);
        }

        // Project actions
        const actionsDiv = createElement('div', { className: 'project-actions' });
        const primaryLink = createElement('a', {
            href: item[1], // href
            className: 'project-link primary',
            innerText: 'View Live'
        });
        actionsDiv.appendChild(primaryLink);
        
        contentDiv.appendChild(actionsDiv);
        article.appendChild(contentDiv);

        return article;
    }

    getRelevantSize() {
        const width = window.innerWidth;
        const sizes = ['mobile', 'tablet', 'laptop', 'desktop'];
        return sizes.find((size, index) => width < Object.values(this.sizes)[index].width) || 'desktop';
    }

    adjustGrid(gridContainer=null,render=true) {
        const size = this.getRelevantSize();
        if (gridContainer && render) {
            gridContainer.style.gridTemplateColumns = `repeat(${this.sizes[size].columns}, 1fr)`;
            
            // Adjust item visibility based on device limits
            this.adjustItemVisibility(gridContainer, size);
        }
        return this.sizes[size].columns;
    }

    adjustItemVisibility(container, size) {
        const initialLimit = this.sizes[size].initialItems;
        const allItems = container.querySelectorAll('.link_container, .project-card');
        
        if (!this.seeMoreActive) {
            // Show only initial items
            this.currentlyShowing = Math.min(initialLimit, allItems.length);
        } else {
            // Show all available items
            this.currentlyShowing = allItems.length;
        }
        
        allItems.forEach((item, index) => {
            if (index < this.currentlyShowing) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update see more button visibility
        this.updateSeeMoreButton(container, allItems.length);
        
        console.log(`[LinkDisplay] Showing ${this.currentlyShowing} of ${allItems.length} items for ${size} view`);
    }

    updateSeeMoreButton(container, totalItems) {
        const seeMoreButton = container.parentElement?.querySelector('.see-more-btn');

        if (seeMoreButton) {
            if (totalItems > this.currentlyShowing && !this.seeMoreActive) {
                seeMoreButton.style.display = 'block';
                const hiddenCount = totalItems - this.currentlyShowing;
                seeMoreButton.textContent = `Show ${hiddenCount} More Projects`;
            } else {
                seeMoreButton.style.display = 'none';
            }
        }
    }

    createSeeMoreButton(container) {
        // Create see more button if it doesn't exist
        const existingBtn = container.parentElement?.querySelector('.see-more-btn');
        if (existingBtn) return;

        const seeMoreBtn = createElement('button', {
            className: 'see-more-btn',
            textContent: 'Show More Projects'
        });
        
        seeMoreBtn.addEventListener('click', () => {
            this.toggleSeeMore();
        });

        container.parentElement?.appendChild(seeMoreBtn);
    }

    toggleSeeMore() {
        this.seeMoreActive = !this.seeMoreActive;
        
        // Re-adjust visibility for all visible containers
        const containerFull = document.getElementById('projects-container-full');
        const containerSimple = document.getElementById('projects-container-simple');
        const currentSize = this.getRelevantSize();

        if (containerFull && getComputedStyle(containerFull).display !== 'none') {
            this.adjustItemVisibility(containerFull, currentSize);
        }
        
        if (containerSimple && getComputedStyle(containerSimple).display !== 'none') {
            this.adjustItemVisibility(containerSimple, currentSize);
        }

        console.log(`[LinkDisplay] See more toggled: ${this.seeMoreActive}`);
    }

    init() {
        console.log('[LinkDisplay] Initializing with settings:', this.settings);
        console.log('[LinkDisplay] Sizes config:', this.sizes);
        console.log('[LinkDisplay] renderFullProjects:', this.renderFullProjects);
        
        // Initialize both containers - full and simple views
        if (this.renderFullProjects) {
            this.initFullProjects();
        }
        this.initSimpleProjects();
        // update project count
        this.updateProjectCount();
        
        // Set up filtering for both containers
        this.setupFiltering();
    }
    
    initFullProjects() {
        console.log('[LinkDisplay] initFullProjects called');
        const containerFull = document.getElementById('projects-container-full');
        if (!containerFull) {
            console.warn('No container found for full projects');
            return;
        }
        
        console.log('[LinkDisplay] Container found, creating projects...');
        
        // Clear existing content
        containerFull.innerHTML = '';
        
        // Create ALL project cards first
        this.projects.forEach((project, index) => {
            const projectCard = this.createFullProjectCard(project);
            containerFull.appendChild(projectCard);
        });
        
        // Create see more button
        this.createSeeMoreButton(containerFull);
        
        // Apply initial visibility rules
        const currentSize = this.getRelevantSize();
        this.adjustItemVisibility(containerFull, currentSize);
        
        console.log(`[LinkDisplay] Full project cards created: ${this.projects.length} total, container has ${containerFull.children.length} children`);
    }
    
    initSimpleProjects() {
        console.log('[LinkDisplay] initSimpleProjects called');
        const containerSimple = document.getElementById('projects-container-simple');
        if (!containerSimple) {
            console.warn('No container found for simple projects');
            return;
        }
        
        console.log('[LinkDisplay] Simple container found, creating projects...');
        
        // Clear existing content
        containerSimple.innerHTML = '';
        
        // Create ALL project cards first
        this.projects.forEach((project, index) => {
            const projectCard = this.createSimpleProjectCard(project);
            containerSimple.appendChild(projectCard);
        });
        
        // Create see more button
        this.createSeeMoreButton(containerSimple);
        
        // Apply grid layout and initial visibility rules
        this.adjustGrid(containerSimple, true);
        
        console.log(`[LinkDisplay] Simple project cards created: ${this.projects.length} total, container has ${containerSimple.children.length} children`);
    }

    // Setup filtering and search functionality
    setupFiltering() {
        const searchInput = document.getElementById('project-search');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const noResults = document.querySelector('.no-results');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.searchTerm = searchInput.value.toLowerCase();
                this.filterProjects();
            });
        }
        
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.currentFilter = btn.dataset.filter;
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterProjects();
                });
            });
        }
    }

    // Filter projects based on search and category - works on both containers
    filterProjects() {
        const containerFull = document.getElementById('projects-container-full');
        const containerSimple = document.getElementById('projects-container-simple');
        const noResults = document.getElementById('no-results');
        let matchingCount = 0;
        let visibleCount = 0;

        // Filter both containers
        [containerFull, containerSimple].forEach(container => {
            if (!container) return;
            
            const projects = container.querySelectorAll('.project-card, .link_container');
            let containerMatching = 0;
            
            projects.forEach((project, index) => {
                let title = '';
                let description = '';
                let categories = '';
                let techTags = '';
                
                // Handle different project card structures
                if (project.classList.contains('project-card')) {
                    // Full project card
                    title = project.querySelector('.project-title')?.textContent.toLowerCase() || '';
                    description = project.querySelector('.project-description')?.textContent.toLowerCase() || '';
                    categories = project.dataset.category?.toLowerCase() || '';
                    techTags = Array.from(project.querySelectorAll('.tech-tag'))
                        .map(tag => tag.textContent.toLowerCase()).join(' ');
                } else if (project.classList.contains('link_container')) {
                    // Simple project card
                    const titleEl = project.querySelector('p strong');
                    title = titleEl ? titleEl.textContent.toLowerCase() : '';
                    const descEl = project.querySelector('p:not(:has(strong))');
                    description = descEl ? descEl.textContent.toLowerCase() : '';
                    categories = project.dataset.category?.toLowerCase() || '';
                }

                const matchesSearch = !this.searchTerm || 
                    title.includes(this.searchTerm) || 
                    description.includes(this.searchTerm) || 
                    techTags.includes(this.searchTerm);

                const matchesFilter = this.currentFilter === 'all' || 
                    categories.includes(this.currentFilter);

                if (matchesSearch && matchesFilter) {
                    project.classList.add('matches-filter');
                    containerMatching++;
                    
                    // Show/hide based on see more state and position
                    if (index < this.currentlyShowing) {
                        project.style.display = '';
                        project.classList.add('fade-in');
                        if (container.style.display !== 'none') {
                            visibleCount++;
                        }
                    } else {
                        project.style.display = 'none';
                        project.classList.remove('fade-in');
                    }
                } else {
                    project.classList.remove('matches-filter');
                    project.style.display = 'none';
                    project.classList.remove('fade-in');
                }
            });
            
            // Only count from the currently visible container
            if (container.style.display !== 'none') {
                matchingCount = containerMatching;
            }
        });

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = matchingCount === 0 ? 'block' : 'none';
        }
        
        // Update project count with matching total (visible + hidden)
        this.updateProjectCount(matchingCount);
        
        // Update see more button for filtered results
        const activeContainer = containerFull?.style.display !== 'none' ? containerFull : containerSimple;
        if (activeContainer) {
            this.updateSeeMoreButton(activeContainer, matchingCount);
        }
    }

    // Update project count in stats
    updateProjectCount(matchingCount = null) {
        const totalProjectsEl = document.getElementById('total-projects');
        if (totalProjectsEl) {
            // Show matching projects count (including hidden ones behind see more)
            const count = matchingCount !== null ? matchingCount : this.projects.length;
            totalProjectsEl.textContent = `${count}+`;
        }
    }

    // Reset all filters
    resetFilters() {
        const searchInput = document.getElementById('project-search');
        const searchClear = document.querySelector('.search-clear');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
        }
        if (searchClear) {
            searchClear.style.display = 'none';
        }
        
        this.currentFilter = 'all';
        filterButtons.forEach((btn, index) => {
            btn.classList.remove('active');
            if (index === 0) btn.classList.add('active'); // Make first button (All) active
        });
        
        this.filterProjects();
    }
}

console.log('[LinkDisplay] Settings available:', typeof Settings !== 'undefined' ? Settings : 'undefined');

const userSettings = (typeof Settings !== 'undefined' && Settings?.linkDisplay) ? Settings.linkDisplay : {};

console.log('[LinkDisplay] Using settings:', userSettings);

const projectDisplay = new LinkDisplay(userSettings);

// Expose the instance globally for view toggle functionality
window.linkDisplayInstance = projectDisplay;

// Expose global reset function for HTML buttons
window.resetFilters = function() {
    if (projectDisplay && typeof projectDisplay.resetFilters === 'function') {
        projectDisplay.resetFilters();
    }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    projectDisplay.init();
    
    // Add debounced resize event listener to adjust grid when window is resized
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Clear previous timeout to debounce rapid resize events
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const containerFull = document.getElementById('projects-container-full');
            const containerSimple = document.getElementById('projects-container-simple');
            
            const newSize = projectDisplay.getRelevantSize();
            
            // Reset see more state on resize
            projectDisplay.seeMoreActive = false;
            
            // Adjust visibility for new device size
            if (containerFull && getComputedStyle(containerFull).display !== 'none') {
                projectDisplay.adjustGrid(containerFull, true);
                console.log(`[LinkDisplay] Full container adjusted for ${newSize}`);
            }
            
            if (containerSimple && getComputedStyle(containerSimple).display !== 'none') {
                projectDisplay.adjustGrid(containerSimple, true);
                console.log(`[LinkDisplay] Simple container adjusted for ${newSize}`);
            }
        }, 150); // 150ms debounce delay
    });
});
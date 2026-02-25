// Load portfolio albums from JSON
async function loadPortfolioAlbums() {
    try {
        const response = await fetch('/portfolio-albums.json');
        const data = await response.json();
        window.portfolioAlbums = data.albums; // Store globally for modal access
        renderPortfolioAlbums(data.albums);
    } catch (error) {
        console.error('Error loading portfolio albums:', error);
    }
}

function renderPortfolioAlbums(albums) {
    const grid = document.getElementById('portfolio-albums-grid');
    if (!grid) return;
    
    // Sort by weight
    const sortedAlbums = [...albums].sort((a, b) => (a.weight || 0) - (b.weight || 0));
    
    grid.innerHTML = sortedAlbums.map(album => {
        const hasPhotos = album.photos && album.photos.length > 0;
        const containerClass = hasPhotos ? 'has-photos' : 'placeholder';
        const minWidth = album.minWidth ? `data-min-width="${album.minWidth}"` : '';
        
        if (hasPhotos) {
            // Clickable album that opens modal
            return `
                <div class="album-container ${containerClass}" ${minWidth} onclick="openPortfolioAlbum('${album.id}')" style="cursor: pointer;">
                    <i class="${album.icon}" style="font-size: 3rem; color: ${album.color}; margin-bottom: var(--space-md);"></i>
                    <div class="album-title">${album.name}</div>
                    <p class="album-description">${album.description}</p>
                    <p style="color: var(--color-text-tertiary); font-size: var(--font-size-xs); margin-top: var(--space-xs);">${album.photos.length} photos</p>
                </div>
            `;
        } else {
            // Placeholder - link to external page
            return `
                <a href="${album.link}" class="album-container ${containerClass}" ${minWidth}>
                    <i class="${album.icon}" style="font-size: 3rem; color: ${album.color}; margin-bottom: var(--space-md);"></i>
                    <div class="album-title">${album.name}</div>
                    <p class="album-description">Coming Soon</p>
                </a>
            `;
        }
    }).join('');
}

function openPortfolioAlbum(albumId) {
    const album = window.portfolioAlbums.find(a => a.id === albumId);
    if (!album || !album.photos || album.photos.length === 0) return;
    
    const modal = document.getElementById('albumModal');
    const modalTitle = document.getElementById('modalAlbumTitle');
    const modalGrid = document.getElementById('modalImageGrid');
    
    modalTitle.textContent = album.name;
    
    // Render photo grid
    modalGrid.innerHTML = album.photos.map((photo, index) => `
        <img src="${photo}" 
             alt="${album.name} - Photo ${index + 1}" 
             class="modal-grid-image"
             onclick="openImageLightbox('${albumId}', ${index})"
             loading="lazy">
    `).join('');
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function openImageLightbox(albumId, photoIndex) {
    const album = window.portfolioAlbums.find(a => a.id === albumId);
    if (!album) return;
    
    window.currentLightboxAlbum = album;
    window.currentLightboxIndex = photoIndex;
    
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    lightboxImage.src = album.photos[photoIndex];
    lightboxCounter.textContent = `${photoIndex + 1} / ${album.photos.length}`;
    
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('imageLightbox').style.display = 'none';
}

function navigateLightbox(direction) {
    if (!window.currentLightboxAlbum) return;
    
    const album = window.currentLightboxAlbum;
    window.currentLightboxIndex += direction;
    
    // Wrap around
    if (window.currentLightboxIndex < 0) {
        window.currentLightboxIndex = album.photos.length - 1;
    } else if (window.currentLightboxIndex >= album.photos.length) {
        window.currentLightboxIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    lightboxImage.src = album.photos[window.currentLightboxIndex];
    lightboxCounter.textContent = `${window.currentLightboxIndex + 1} / ${album.photos.length}`;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    }
});

// Load albums when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPortfolioAlbums);
} else {
    loadPortfolioAlbums();
}

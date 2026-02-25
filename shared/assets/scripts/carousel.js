class ModernCarousel {
    constructor(settings) {
        this.settings = {
            images: [],
            imageGroups: null, // New: support for multiple photo groups
            containerId: null,
            currentIndex: 0,
            currentGroupIndex: 0,
            autoplay: false,
            autoplayInterval: 5000,
            ...settings
        };

        // Support both single image array and multiple groups
        if (this.settings.imageGroups) {
            this.photoGroups = this.settings.imageGroups;
            this.settings.images = this.photoGroups[0].images;
        } else if (this.settings.images) {
            this.photoGroups = [{
                name: 'Personal moments',
                images: this.settings.images
            }];
        } else {
            throw new Error("ModernCarousel requires 'images' array or 'imageGroups'");
        }

        if (!this.settings.containerId) {
            throw new Error("ModernCarousel requires 'containerId'");
        }

        this.init();
    }

    init() {
        this.container = document.querySelector(this.settings.containerId);
        if (!this.container) {
            throw new Error(`Container ${this.settings.containerId} not found`);
        }

        this.mainImage = document.getElementById('carousel_main_image');
        this.thumbnailsContainer = document.getElementById('carousel_thumbnails');
        this.imageCounter = document.getElementById('image_counter');
        this.groupName = document.getElementById('current_group_name');
        this.prevGroupBtn = document.getElementById('prev_group_btn');
        this.nextGroupBtn = document.getElementById('next_group_btn');

        if (!this.mainImage || !this.thumbnailsContainer) {
            console.error('Required carousel elements not found');
            return;
        }

        this.createThumbnails();
        this.updateDisplay();
        this.updateGroupControls();
        this.attachEventListeners();

        if (this.settings.autoplay) {
            this.startAutoplay();
        }
    }

    createThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        const currentGroup = this.getCurrentGroup();
        
        currentGroup.images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail-item ${index === this.settings.currentIndex ? 'active' : ''}`;
            thumbnail.setAttribute('role', 'tab');
            thumbnail.setAttribute('aria-selected', index === this.settings.currentIndex);
            thumbnail.setAttribute('tabindex', index === this.settings.currentIndex ? '0' : '-1');
            thumbnail.setAttribute('aria-label', `Photo ${index + 1}`);

            const img = document.createElement('img');
            img.className = 'thumbnail-image';
            img.src = imageSrc;
            img.alt = `Thumbnail ${index + 1}`;
            img.loading = 'lazy';

            thumbnail.appendChild(img);
            
            thumbnail.addEventListener('click', () => this.goToSlide(index));
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });

            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }

    getCurrentGroup() {
        return this.photoGroups[this.settings.currentGroupIndex];
    }

    switchToGroup(groupIndex) {
        if (groupIndex >= 0 && groupIndex < this.photoGroups.length) {
            this.settings.currentGroupIndex = groupIndex;
            this.settings.currentIndex = 0; // Reset to first image in new group
            this.settings.images = this.photoGroups[groupIndex].images;
            this.createThumbnails();
            this.updateDisplay();
            this.updateGroupControls();
        }
    }

    nextGroup() {
        const nextIndex = (this.settings.currentGroupIndex + 1) % this.photoGroups.length;
        this.switchToGroup(nextIndex);
    }

    prevGroup() {
        const prevIndex = this.settings.currentGroupIndex === 0 
            ? this.photoGroups.length - 1 
            : this.settings.currentGroupIndex - 1;
        this.switchToGroup(prevIndex);
    }

    updateGroupControls() {
        const currentGroup = this.getCurrentGroup();
        
        if (this.groupName) {
            this.groupName.textContent = currentGroup.name;
        }

        // Enable/disable navigation buttons if only one group
        if (this.prevGroupBtn && this.nextGroupBtn) {
            const hasMultipleGroups = this.photoGroups.length > 1;
            this.prevGroupBtn.disabled = !hasMultipleGroups;
            this.nextGroupBtn.disabled = !hasMultipleGroups;
            
            if (hasMultipleGroups) {
                this.prevGroupBtn.style.opacity = '1';
                this.nextGroupBtn.style.opacity = '1';
            } else {
                this.prevGroupBtn.style.opacity = '0.3';
                this.nextGroupBtn.style.opacity = '0.3';
            }
        }
    }

    updateDisplay() {
        const currentGroup = this.getCurrentGroup();
        if (!currentGroup.images[this.settings.currentIndex]) return;

        // Update main image
        this.mainImage.classList.add('loading');
        
        const newImage = new Image();
        newImage.onload = () => {
            this.mainImage.src = currentGroup.images[this.settings.currentIndex];
            this.mainImage.classList.remove('loading');
            this.mainImage.classList.add('loaded');
        };
        newImage.src = currentGroup.images[this.settings.currentIndex];

        // Update thumbnails
        const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.settings.currentIndex);
            thumb.setAttribute('aria-selected', index === this.settings.currentIndex);
            thumb.setAttribute('tabindex', index === this.settings.currentIndex ? '0' : '-1');
        });

        // Update counter
        if (this.imageCounter) {
            this.imageCounter.textContent = `${this.settings.currentIndex + 1} / ${currentGroup.images.length}`;
        }

        // Store current index and group in cookies
        if (typeof setCookie === 'function') {
            setCookie('lastSlideIndex', this.settings.currentIndex, 30);
            setCookie('lastGroupIndex', this.settings.currentGroupIndex, 30);
        }
    }

    goToSlide(index) {
        const currentGroup = this.getCurrentGroup();
        if (index >= 0 && index < currentGroup.images.length) {
            this.settings.currentIndex = index;
            this.updateDisplay();
        }
    }

    nextSlide() {
        const currentGroup = this.getCurrentGroup();
        const nextIndex = (this.settings.currentIndex + 1) % currentGroup.images.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const currentGroup = this.getCurrentGroup();
        const prevIndex = this.settings.currentIndex === 0 
            ? currentGroup.images.length - 1 
            : this.settings.currentIndex - 1;
        this.goToSlide(prevIndex);
    }

    attachEventListeners() {
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        this.mainImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.mainImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowUp' && this.photoGroups.length > 1) {
                e.preventDefault();
                this.prevGroup();
            } else if (e.key === 'ArrowDown' && this.photoGroups.length > 1) {
                e.preventDefault();
                this.nextGroup();
            }
        });

        // Group navigation buttons
        if (this.prevGroupBtn && this.nextGroupBtn) {
            this.prevGroupBtn.addEventListener('click', () => this.prevGroup());
            this.nextGroupBtn.addEventListener('click', () => this.nextGroup());
        }

        // Mouse wheel navigation (only on main image)
        this.mainImage.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            e.preventDefault();
        }, { passive: false });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        if (startX - endX > threshold) {
            this.nextSlide();
        }
        if (endX - startX > threshold) {
            this.prevSlide();
        }
    }

    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.settings.autoplayInterval);

        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.autoplayTimer);
        });

        this.container.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
    }

    // Method to get current image for camera functionality
    getCurrentImageSrc() {
        return this.settings.images[this.settings.currentIndex];
    }

    // Method to replace current image (for camera feature)
    replaceCurrentImage(newImageSrc) {
        this.settings.images[this.settings.currentIndex] = newImageSrc;
        this.updateDisplay();
        this.createThumbnails(); // Recreate thumbnails to update the current one
    }
}

// Initialize the modern carousel
if (typeof Settings !== 'undefined' && Settings.imageSlider) {
    const modernCarousel = new ModernCarousel({
        ...Settings.imageSlider,
        containerId: '.carousel-main'
    });

    // Make it globally available for camera functionality
    window.carousel = modernCarousel;
}
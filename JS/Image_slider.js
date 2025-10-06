class ImageSlider {
    constructor(settings) {
        // Default settings
        this.defaultSettings = {
            images: [],
            
            // the array of image URLs (expandable to include captions, etc.)
            

            // The below variables handle appending
            containerId:null, // the id of the container where the slider will be appended
            insertLocation: null,
            insertAfter: null,

            expandable: false, // Clicking an image goes to fullscreen
            premadeMainContainer:false, // Premake the main container to save on bandwith

            slide_Index: (typeof getCookie !== 'undefined' ? getCookie('lastSlideIndex') : null) || 0, // position of the current slide
            last_Slide_Index: (typeof getCookie !== 'undefined' ? getCookie('lastSlideIndex') : null) || 0, // position of the last slide
            TotalIndexMoves: 0, // total number of times the slide has been moved (left or right)
            expandViewkeycount: 0, // number of times the slider has been expanded (fullscreen)
            viewTime:[],
            lastKey: 'none',

            // User settings
            imagesBeforeOverflow:{
                mobile: 8,
                desktop: 5,
            },
            imageCount:true,        // show the image count (top right)
            SliderArrows: false,    // prev / next arrows
            sliderDots: false,      // dots for each slide
            slidePreviews:false,    // previews for each slide
            Captions: [false, ".captiontext"],
           
        };

        // Merge default settings with user settings
        this.settings = { ...this.defaultSettings, ...settings };

        // Catch errors before initializing the slider
        if (!this.settings.images || !this.settings.containerId) {
            throw new Error("settings.imageSlider must contain 'images' array and 'containerId'");
        }

        this.initSlider();
    }

    initSlider() {
        const container = dQ(`#${this.settings.containerId}`);
        if (!container) { throw new Error(`Container with id ${this.settings.containerId} not found`);}

        this.buildSlider(container);

        this.settings.expandable && this.createFullscreenModal(container);
        //this.settings.slidePreviews && this.createMainImageContainer();
        this.settings.sliderDots && this.addDots(container);
        // Attach event listeners
        this.attachEventListeners(container);
        // Load the first slide after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.updateSelectedSlide(this.settings.slide_Index);
        }, 100);
        
    }

    buildSlider(container) {
        // Wrapper for the images
        const imageSliderContainer = createElement('div', { className: 'image-flex-slider' });
        
        // Create slider elements and append to container
        this.settings.images.forEach((imageSrc, index) => {
            const imgContainer = createElement('div', { className: 'flex-slider-item' });
            const imgElement = createElement('img',{loading:'lazy', className: 'slider_image_slide', alt: 'slide', src: imageSrc });
            imgContainer.appendChild(imgElement);
            imageSliderContainer.appendChild(imgContainer);
        });
        container.append(imageSliderContainer);
    }

    createfolderSwapper(){
        const folderContainer = createElement('div', { className: 'folder-container' });
        this.settings.imageSets.forEach((folderName, index) => {
            const folderButton = createElement('button', {
                className: 'folder-button',
                innerText: folderName,
                onclick: () => this.switchToFolder(index)
            });
            folderContainer.appendChild(folderButton);
        });
        return folderContainer;
    }

    createFullscreenModal(container) {
        container.innerHTML+=`
        <div id="fullscreen-modal" class="fullscreen-modal">
            <div id="fullscreen-modal-content" class="fullscreen-modal-content">
            <!-- This image element will be used to display the fullscreen image -->
            <img src="" alt="Fullscreen Image">
            </div>
        </div>
    `;    
    }

    addDots(container) {

        const dotsContainer = createElement('div',{id:'slider_dot_div'});
        this.settings.images.forEach((image, index) => {

            const dot = createElement('button',{className:'slider_dots',type:'radio',name:'slider_dots',onclick:`currentSlide(${index})`});
            if (index === this.settings.slide_Index) { dot.classList.add('active'); }
            dot.addEventListener('click', () => this.updateSelectedSlide(index));
            dotsContainer.appendChild(dot);
        });
        container.appendChild(dotsContainer);
    }

    addCaptions(container) {
        if (this.settings.Captions[0]) {
            const captionsContainer = document.createElement('div');
            captionsContainer.classList.add(this.settings.Captions[1].substring(1)); // Remove the '.' from the class
            container.appendChild(captionsContainer);
        }
    }

    attachEventListeners(container) {
        const prevButton = container.querySelector('.slider_prev');
        const nextButton = container.querySelector('.slider_next');
        const sliderItems = container.querySelectorAll('.flex-slider-item');
        const mainImage = container.querySelector('#slider_img_main');

        if (this.settings.SliderArrows){
            prevButton.addEventListener("click", () => this.renderPrevSlide());
            nextButton.addEventListener("click", () => this.renderNextSlide());
        }
        sliderItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                // this.settings.slide_Index = index;
                this.updateSelectedSlide(index);
            });
        });

        let touchstartX = 0;
        let touchendX = 0;

        mainImage.addEventListener('touchstart', (event) => {
            touchstartX = event.changedTouches[0].screenX;
        });

        mainImage.addEventListener('touchend', (event) => {
            touchendX = event.changedTouches[0].screenX;
    
            this.handleSwipeGesture(touchstartX, touchendX);
        });

        if (this.settings.expandable){
        }
        
        if (this.settings.expandable) {
            // clicking main image opens modal
            mainImage.addEventListener("click", () => this.toggleFullscreenSlider());
            //clicking modal closes modal
            const modal = document.getElementById("fullscreen-modal");
            modal.addEventListener("click", () => {
                modal.classList.remove("fullscreen-modal-open");
            });
        }
    }

    handleSwipeGesture(startX, endX) {
        if (startX - endX > 50) {
            this.renderNextSlide();
        }
        if (endX - startX > 50) {
            this.renderPrevSlide();
        }
    }

    renderPrevSlide() {
        this.settings.TotalIndexMoves++;
        this.updateSlideIndex(this.settings.slide_Index-1)
        this.updateSelectedSlide(this.settings.slide_Index);
    }

    renderNextSlide() {
        this.settings.TotalIndexMoves++;
        this.updateSlideIndex(this.settings.slide_Index+1)
        this.updateSelectedSlide();
    }

    
    toggleFullscreenSlider() {
        const modal = document.getElementById("fullscreen-modal");
        modal.classList.toggle("fullscreen-modal-open");
    }

    updateSlideIndex(n = this.settings.slide_Index){
        // Validate inputs
        if (!this.settings.images || this.settings.images.length === 0) {
            console.warn('No images available for slider');
            return;
        }
        
        // Update last slide index
        this.settings.last_Slide_Index = this.settings.slide_Index;
        // Update slider & catch out of index
        if (n >= this.settings.images.length) { 
            this.settings.slide_Index = 0; 
        } 
        else if (n < 0) { 
            this.settings.slide_Index = this.settings.images.length - 1; 
        } 
        else if (n != this.settings.slide_Index){ 
            this.settings.slide_Index = n;  
        }
    }
     
    updateSelectedSlide(n=this.settings.slide_Index){
        const slides = document.getElementsByClassName("slider_image_slide");
        
        // Check if slides exist and the current slide index is valid
        if (!slides || slides.length === 0) {
            console.warn('No slides found in DOM yet');
            return;
        }
        
        if (this.settings.slide_Index < 0 || this.settings.slide_Index >= slides.length) {
            console.warn(`Invalid slide index: ${this.settings.slide_Index}`);
            return;
        }
        
        // Check if the current slide element exists and has a parent
        const currentSlide = slides[this.settings.slide_Index];
        if (!currentSlide || !currentSlide.parentElement) {
            console.warn(`Slide at index ${this.settings.slide_Index} not found or has no parent`);
            return;
        }
        
        currentSlide.parentElement.className='flex-slider-item'; 
        
        console.log(`Current Index: ${this.settings.slide_Index} | Last Index: ${this.settings.last_Slide_Index} | 
            Total Moves: ${this.settings.TotalIndexMoves}
        removing class from ${this.settings.slide_Index} and adding class to ${n}    
        currentclass name: ${currentSlide.parentElement.className}
        `);

        this.updateSlideIndex(n);
    
        // Validate new slide index
        if (n < 0 || n >= slides.length) {
            console.warn(`Invalid new slide index: ${n}`);
            return;
        }
        
        // Check if the new slide exists
        const newSlide = slides[n];
        if (!newSlide || !newSlide.parentElement) {
            console.warn(`New slide at index ${n} not found or has no parent`);
            return;
        }
    
        // Clear previous selection 
        // Set selected slide
        newSlide.parentElement.className += " slider_selected";
 
        // Update the fullscreen image src to match the selected slide
        if (this.settings.expandable) {
            const modal = document.getElementById("fullscreen-modal-content");
            modal.querySelector('img').setAttribute('src', this.settings.images[n]);
        }
        // Update dots
        if (this.settings.sliderDots) {
            const slider_Dots = document.getElementsByClassName('slider_dots');
            for (let i = 0; i < slider_Dots.length; i++) { slider_Dots[i].className = slider_Dots[i].className.replace(" active", ""); }
            slider_Dots[this.settings.slide_Index].className += " active";
        }

          
        // Update main image
        const main_image = document.getElementById('slider_img_main');
        if (main_image && this.settings.images[this.settings.slide_Index]) {
            main_image.src = this.settings.images[this.settings.slide_Index];
            main_image.alt = `Slide ${this.settings.slide_Index + 1} of ${this.settings.images.length}`;
        }
    }



}

// Initialize the slider
if (Settings.imageSlider) { const imageSlider = new ImageSlider(Settings.imageSlider); }    // try {
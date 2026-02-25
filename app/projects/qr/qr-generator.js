// QR Code Generator JavaScript

class QRCodeGenerator {
    constructor() {
        this.currentQRData = null;
        this.currentCanvas = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePreviewInfo();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Input events
        const textInput = document.getElementById('qrText');
        const sizeSelect = document.getElementById('qrSize');
        const errorLevelSelect = document.getElementById('qrErrorLevel');
        const foregroundColor = document.getElementById('qrForeground');
        const backgroundColorInput = document.getElementById('qrBackground');
        const generateBtn = document.getElementById('generateBtn');
        
        console.log('Generate button found:', !!generateBtn);

        // Export events
        const exportPNG = document.getElementById('exportPNG');
        const exportJPG = document.getElementById('exportJPG');
        const exportSVG = document.getElementById('exportSVG');

        // Real-time generation on input change
        textInput.addEventListener('input', () => this.debounce(() => this.generateQRCode(), 300));
        sizeSelect.addEventListener('change', () => this.generateQRCode());
        errorLevelSelect.addEventListener('change', () => this.generateQRCode());
        foregroundColor.addEventListener('change', () => this.generateQRCode());
        backgroundColorInput.addEventListener('change', () => this.generateQRCode());
        
        // Manual generation button
        generateBtn.addEventListener('click', () => {
            console.log('Generate button clicked!');
            this.generateQRCode();
        });

        // Export events
        exportPNG.addEventListener('click', () => this.exportQRCode('png'));
        exportJPG.addEventListener('click', () => this.exportQRCode('jpg'));
        exportSVG.addEventListener('click', () => this.exportQRCode('svg'));
    }

    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    generateQRCode() {
        console.log('generateQRCode called');
        
        // Check if QRCode library is available
        if (typeof QRCode === 'undefined') {
            console.log('QRCode library not available');
            this.showError('QR Code library is still loading. Please wait a moment and try again.');
            return;
        }

        const text = document.getElementById('qrText').value.trim();
        const size = parseInt(document.getElementById('qrSize').value);
        const errorCorrectionLevel = document.getElementById('qrErrorLevel').value;
        const foregroundColor = document.getElementById('qrForeground').value;
        const backgroundColor = document.getElementById('qrBackground').value;

        if (!text) {
            this.showPlaceholder();
            this.hideExportSection();
            return;
        }

        // Update preview info
        this.updatePreviewInfo(text, size);

        // Show loading state
        this.showLoading();

        // Generate QR code
        const canvas = document.createElement('canvas');
        const options = {
            width: size,
            height: size,
            errorCorrectionLevel: errorCorrectionLevel,
            type: 'image/png',
            quality: 1,
            margin: 2,
            color: {
                dark: foregroundColor,
                light: backgroundColor
            }
        };

        QRCode.toCanvas(canvas, text, options, (error) => {
            if (error) {
                console.error('QR Code generation error:', error);
                this.showError('Failed to generate QR code. Please check your input.');
                return;
            }

            this.currentCanvas = canvas;
            this.currentQRData = {
                text: text,
                size: size,
                errorCorrectionLevel: errorCorrectionLevel,
                foregroundColor: foregroundColor,
                backgroundColor: backgroundColor
            };

            this.displayQRCode(canvas);
            this.showExportSection();
        });
    }

    displayQRCode(canvas) {
        const previewContainer = document.getElementById('qrPreview');
        
        // Clear previous content
        previewContainer.innerHTML = '';
        
        // Add canvas to preview
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.borderRadius = '8px';
        previewContainer.appendChild(canvas);
    }

    showPlaceholder() {
        const previewContainer = document.getElementById('qrPreview');
        previewContainer.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">📱</div>
                <p>Your QR code will appear here</p>
            </div>
        `;
    }

    showLoading() {
        const previewContainer = document.getElementById('qrPreview');
        previewContainer.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">⏳</div>
                <p>Generating QR code...</p>
            </div>
        `;
    }

    showError(message) {
        const previewContainer = document.getElementById('qrPreview');
        previewContainer.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">❌</div>
                <p style="color: #e53e3e;">${message}</p>
            </div>
        `;
    }

    updatePreviewInfo(text = null, size = null) {
        const infoElement = document.getElementById('previewInfo');
        
        if (!text) {
            infoElement.textContent = 'Enter text to generate QR code';
            return;
        }

        const charCount = text.length;
        infoElement.textContent = `${charCount} characters • ${size}×${size}px`;
    }

    showExportSection() {
        const exportSection = document.getElementById('exportSection');
        exportSection.style.display = 'block';
    }

    hideExportSection() {
        const exportSection = document.getElementById('exportSection');
        exportSection.style.display = 'none';
    }

    exportQRCode(format) {
        if (!this.currentCanvas || !this.currentQRData) {
            alert('Please generate a QR code first!');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `qr-code-${timestamp}`;

        switch (format) {
            case 'png':
                this.downloadCanvasAsPNG(filename);
                break;
            case 'jpg':
                this.downloadCanvasAsJPG(filename);
                break;
            case 'svg':
                this.generateAndDownloadSVG(filename);
                break;
            default:
                console.error('Unsupported format:', format);
        }
    }

    downloadCanvasAsPNG(filename) {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = this.currentCanvas.toDataURL('image/png', 1.0);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showDownloadFeedback('PNG');
    }

    downloadCanvasAsJPG(filename) {
        // Create a new canvas with white background for JPG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = this.currentCanvas.width;
        canvas.height = this.currentCanvas.height;
        
        // Fill with white background
        ctx.fillStyle = this.currentQRData.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code on top
        ctx.drawImage(this.currentCanvas, 0, 0);
        
        const link = document.createElement('a');
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showDownloadFeedback('JPG');
    }

    generateAndDownloadSVG(filename) {
        // Check if we have the proper QRCode.toString method
        if (typeof QRCode.toString === 'function') {
            const options = {
                type: 'svg',
                width: this.currentQRData.size,
                height: this.currentQRData.size,
                errorCorrectionLevel: this.currentQRData.errorCorrectionLevel,
                margin: 2,
                color: {
                    dark: this.currentQRData.foregroundColor,
                    light: this.currentQRData.backgroundColor
                }
            };

            QRCode.toString(this.currentQRData.text, options, (error, svgString) => {
                if (error) {
                    console.error('SVG generation error:', error);
                    alert('Failed to generate SVG. Please try again.');
                    return;
                }

                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.download = `${filename}.svg`;
                link.href = url;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                this.showDownloadFeedback('SVG');
            });
        } else {
            // Fallback: convert canvas to SVG
            this.convertCanvasToSVG(filename);
        }
    }

    convertCanvasToSVG(filename) {
        const canvas = this.currentCanvas;
        const dataURL = canvas.toDataURL('image/png');
        
        const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
    <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataURL}"/>
</svg>`;
        
        const blob = new Blob([svgTemplate], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = url;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        this.showDownloadFeedback('SVG');
    }

    showDownloadFeedback(format) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #10b981, #059669);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        feedback.innerHTML = `✅ ${format} downloaded successfully!`;
        
        // Add animation keyframes
        if (!document.querySelector('#feedback-styles')) {
            const style = document.createElement('style');
            style.id = 'feedback-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(feedback)) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to validate URL
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Method to get QR code type info
    getQRCodeInfo(text) {
        if (this.isValidURL(text)) {
            return { type: 'URL', icon: '🔗' };
        } else if (text.includes('@') && text.includes('.')) {
            return { type: 'Email', icon: '📧' };
        } else if (/^\+?[\d\s\-\(\)]+$/.test(text)) {
            return { type: 'Phone', icon: '📱' };
        } else {
            return { type: 'Text', icon: '📝' };
        }
    }
}

// Initialize QR Code Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for QRCode library...');
    
    // Wait a bit more for QRCode library to be fully loaded
    setTimeout(() => {
        console.log('QRCode type check:', typeof QRCode);
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode library found, initializing generator...');
            window.qrGenerator = new QRCodeGenerator();
            console.log('QR Generator initialized successfully');
        } else {
            console.error('QRCode library failed to load');
            // Show error in preview
            const previewContainer = document.getElementById('qrPreview');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="placeholder-content">
                        <div class="placeholder-icon">⚠️</div>
                        <p style="color: #e53e3e;">QR Code library failed to load. Please refresh the page.</p>
                    </div>
                `;
            }
        }
    }, 500);
    
    // Add some sample data for demo purposes
    const sampleTexts = [
        'https://jackewers.com',
        'Welcome to my QR Code Generator!',
        'mailto:contact@jackewers.com',
        '+1-555-123-4567'
    ];
    
    // Add click handler for quick demo
    let demoIndex = 0;
    const textArea = document.getElementById('qrText');
    
    textArea.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Try: ' + sampleTexts[demoIndex % sampleTexts.length];
            demoIndex++;
        }
    });
    
    // Add backup button handler in case class initialization fails
    setTimeout(() => {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn && !window.qrGenerator) {
            console.log('Adding backup button handler...');
            generateBtn.addEventListener('click', function() {
                console.log('Backup button clicked');
                const text = document.getElementById('qrText').value.trim();
                if (!text) {
                    alert('Please enter some text or URL to generate QR code');
                    return;
                }
                
                if (typeof QRCode !== 'undefined') {
                    const canvas = document.createElement('canvas');
                    const options = {
                        width: 512,
                        height: 512,
                        errorCorrectionLevel: 'M',
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        }
                    };
                    
                    QRCode.toCanvas(canvas, text, options, (error) => {
                        if (error) {
                            console.error('QR generation error:', error);
                            alert('Failed to generate QR code: ' + error.message);
                            return;
                        }
                        
                        const previewContainer = document.getElementById('qrPreview');
                        previewContainer.innerHTML = '';
                        canvas.style.maxWidth = '100%';
                        canvas.style.height = 'auto';
                        canvas.style.borderRadius = '8px';
                        previewContainer.appendChild(canvas);
                        
                        // Show export section
                        document.getElementById('exportSection').style.display = 'block';
                    });
                } else {
                    alert('QR Code library is not loaded. Please refresh the page.');
                }
            });
        }
    }, 1000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to generate
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('generateBtn').click();
    }
    
    // Ctrl/Cmd + S to download PNG (prevent default save)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (document.getElementById('exportPNG').style.display !== 'none') {
            document.getElementById('exportPNG').click();
        }
    }
});
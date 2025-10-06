<div align="center">

# JackEwers.com - Personal Portfolio & Digital Business Card

[![Live Website](https://img.shields.io/badge/Live_Website-jackewers.com-blue?style=for-the-badge)](https://jackewers.com)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

**Modern, responsive personal portfolio showcasing software development projects, professional experience, and creative works.**

---

*A full-stack developer's digital presence featuring interactive elements, dynamic content, and modern web technologies.*

</div>

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [External Resources](#external-resources)
- [Key Features](#key-features)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [Performance & SEO](#performance--seo)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [Analytics & Monitoring](#analytics--monitoring)
- [Contributing](#contributing)
- [License](#license)

## Overview

**JackEwers.com** is a comprehensive personal portfolio and digital business card built as a modern, responsive web application. The site serves as a professional showcase for software development work, personal projects, and creative endeavors while maintaining an engaging user experience across all devices.

**Live Site**: [www.jackewers.com](https://jackewers.com)  
**Domain**: Custom domain hosted on GitHub Pages  
**Responsive**: Optimized for mobile, tablet, and desktop  

### Interactive Features
- **Live Camera Integration** - Interactive photo capture with countdown timer
- **Mini Games** - Collection of browser-based games and interactive experiences  
- **Slang Generator** - "Am I Old Yet?" generational slang analysis tool
- **Dynamic Content** - Real-time updates from external APIs
- **Theme System** - Automatic dark/light mode with CSS custom properties

## Project Structure

```
jackewers/
├──  index.html                    # Main landing page
├──  about.html                    # About page redirect
├──  linktree.html                 # Social media hub
├──  README.md                     # This documentation
├──  robots.txt                    # SEO crawler instructions
├──  cert.pem                      # SSL certificate
├──  CNAME                         # Custom domain configuration
│
├── 📁 About/                        # About section pages
│   ├── index.html                   # Main about page  
│   ├── Contact.html                 # Contact information
│   └── Recommendations.html         # Professional recommendations
│
├── 📁 CSS/                          # Stylesheets & Design System
│   ├── styles.css                   # Core site styles
│   ├── vars.css                     # CSS custom properties
│   ├── nav.css        # Navigation components
│   ├── projects.css        # Project grid system
│   ├── carousel-redesign.css        # Image carousel
│   ├── home.css                     # Landing page styles
│   ├── desktop-enhancements.css     # Desktop optimizations
│   └── overflow-fixes.css           # Layout fixes
│
├── 📁 JS/                           # JavaScript Modules
│   ├── KeyFunctions.js              # Core utilities
│   ├── projects.js                  # Project grid management
│   ├── modern-carousel.js           # Carousel functionality
│   ├── nav.js         # Navigation system
│   ├── Image_slider.js              # Image gallery
│   └── social_links.js              # External link management
│
├── 📁 shared/                       # Shared Assets & Components
│   └── assets/
│       ├── 📁 components/              # Reusable HTML components
│       ├── 📁 scripts/                 # Shared JavaScript modules
│       ├── 📁 styles/                  # Shared CSS files
│       ├── 📁 images/                  # Optimized images
│       └── 📁 API/                     # API integration files
│
├── 📁 projects/                     # Project Portfolio
│   ├── index.html                   # Projects overview
│   ├── am-i-old-yet/               # Slang analysis app
│   ├── doorbell/                   # IoT doorbell project
│   ├── be-my-valentine/            # Interactive Valentine's app
│   ├── S.P.I.N/                    # SPIN methodology tool
│   └── [other projects]/
│
├── 📁 poo_games/                    # Interactive Games Collection
│   ├── index.html                   # Games hub
│   ├── poo_frogger/                # Frogger-style game
│   ├── poo_snake/                  # Snake game variant
│   └── poo_tic-tac-toe/            # Tic-tac-toe implementation
│
├── 📁 Certificates/                 # Professional Certifications
│   ├── Certificates.html           # Certifications gallery
│   ├── styles.css                  # Certificate grid styles
│   ├── script.js                   # Dynamic certificate loading
│   └── [certification folders]/
│
├── 📁 blog-posts/                   # Technical Blog Articles
│   ├── Optimal_IP_Addressing_for_Programmers.html
│   ├── Securing_Your_Small_Business_with_TOR_and_Kali.html
│   └── The_Benefits_of_having_ice_baths.html
│
├── 📁 i/                           # Image Assets
│   ├── branding/                   # Brand assets & logos
│   ├── web-ready/                  # Optimized web images
│   ├── Icons/                      # UI icons & favicons
│   ├── Personal/                   # Personal photos
│   └── [organized image folders]/
│
└── 📁 Business/                     # Business & Professional Content
    └── email_footer.html           # Email signature template
```

## Technologies Used

### Frontend Technologies
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Web APIs & Features
- **WebRTC & MediaDevices API** - Camera functionality with getUserMedia
- **Canvas API** - Image generation and manipulation
- **Web Share API** - Native mobile sharing capabilities  
- **Intersection Observer API** - Lazy loading and scroll animations
- **Service Workers** - Offline functionality and caching
- **CSS Custom Properties** - Dynamic theming system
- **CSS Grid & Flexbox** - Modern responsive layouts
- **CSS Animations** - Smooth transitions and micro-interactions

### Architecture Patterns
- **Component-Based Architecture** - Reusable HTML/shared/assets/styles/JS components
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Mobile-First Responsive Design** - Optimized for all screen sizes
- **Performance-Focused** - Lazy loading, image optimization, code splitting
- **Accessibility Standards** - WCAG 2.1 compliant with ARIA labels

## External Resources

### Third-Party Services

| Service | Purpose | Implementation | Notes |
|---------|---------|----------------|--------|
| Google Fonts | Typography & Font Loading | `fonts.googleapis.com` & `fonts.gstatic.com` | Preconnected for performance |
| BloodWeb API | Dynamic content & navigation | `https://bloodweb.net/KeyFunctions.js` | Live content updates |
| Schema.org | Structured data for SEO | JSON-LD implementation | Enhanced search results |
| GitHub Pages | Static site hosting | Custom domain with CNAME | Free, reliable hosting |

### API Integrations

```javascript
// BloodWeb Integration - Dynamic Content Loading
<script src="https://bloodweb.net/KeyFunctions.js"></script>

// Google Fonts - Performance Optimized Loading  
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Security & Performance
- **HTTPS Enforcement** - All external resources loaded over HTTPS
- **Resource Preloading** - Critical resources preloaded for performance
- **Content Security Policy** - Implemented via meta tags
- **DNS Prefetching** - External domains prefetched for speed

## Key Features

### Core Functionality

<details>
<summary><b>Interactive Camera System</b></summary>

- **Live camera feed** with getUserMedia API
- **Countdown timer** with visual feedback  
- **Photo capture** with canvas processing
- **Error handling** for permissions and device compatibility
- **Responsive design** for all device types

```javascript
// Camera implementation with fallback constraints
async function switchToCameraView() {
    const constraints = [
        { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } },
        { video: true }
    ];
    // Implementation details...
}
```
</details>

<details>
<summary><b>Modern Design System</b></summary>

- **CSS Custom Properties** for consistent theming
- **Glassmorphism effects** with backdrop-filter
- **Gradient systems** for visual hierarchy  
- **Responsive typography** with clamp() functions
- **Dark/Light mode** automatic detection

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
}
```
</details>

<details>
<summary><b>Responsive Grid System</b></summary>

- **CSS Grid with auto-fit** for dynamic layouts
- **Device-specific breakpoints** for optimal viewing
- **Intersection Observer** for lazy loading
- **Performance optimized** image loading

```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(1rem, 3vw, 2rem);
}
```
</details>

### Interactive Applications

| Application | Technology Stack | Features |
|-------------|------------------|----------|
| Slang Generator | Canvas API, JavaScript ES6+ | Age analysis, social sharing, 100+ slang database |
| Poo Games | HTML5 Canvas, Game Logic | Frogger, Snake, Tic-tac-toe |
| Valentine's App | CSS Animations, Interactive UI | Dynamic responses, cute animations |
| IoT Doorbell | Python Flask, IoT Integration | Raspberry Pi integration, API endpoints |

## Pages & Sections

### Main Landing Page (`index.html`)
- **Hero section** with interactive carousel
- **About preview** with professional summary
- **Project showcase** with filterable grid
- **Contact information** and social links
- **Certificate highlights** and achievements

### Projects Portfolio (`projects/`)
- **Comprehensive project grid** with filtering
- **Live project demos** and source code links  
- **Technology tags** and descriptions
- **Interactive previews** and screenshots
- **Detailed case studies** for major projects

### Certifications (`Certificates/`)
- **Professional certifications** in organized categories
- **Achievement badges** and skill verification
- **Timeline view** of professional development
- **Searchable interface** for quick reference

### Technical Blog (`blog-posts/`)
- **In-depth technical articles** on programming topics
- **Best practices** and tutorials
- **Personal insights** on software development
- **SEO optimized** content structure

## Design System

### Color Palette
```css
/* Primary Brand Colors */
--primary-blue: #667eea;
--primary-purple: #764ba2;
--accent-pink: #f093fb;
--accent-red: #f5576c;

/* Semantic Colors */
--success: #4ade80;
--warning: #fbbf24;  
--danger: #ef4444;
--info: #3b82f6;
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
--mobile: 320px;      /* Small mobile */
--tablet: 768px;      /* Tablet */
--desktop: 1024px;    /* Desktop */
--wide: 1440px;       /* Wide screen */
```

### Typography System
```css
/* Responsive Typography */
--font-xs: clamp(0.75rem, 2vw, 0.875rem);
--font-sm: clamp(0.875rem, 2.5vw, 1rem);
--font-base: clamp(1rem, 3vw, 1.125rem);
--font-lg: clamp(1.125rem, 4vw, 1.5rem);
--font-xl: clamp(1.5rem, 5vw, 2rem);
```

## Performance & SEO

### Performance Optimizations
- **Lazy loading** for images and components
- **Resource preloading** for critical assets
- **Code splitting** for JavaScript modules  
- **Image optimization** with WebP format
- **CSS minification** and critical CSS inlining
- **Service worker** for offline functionality

### SEO Implementation
- **Structured data** with Schema.org markup
- **Open Graph** tags for social media
- **Meta descriptions** and keyword optimization
- **XML sitemap** and robots.txt
- **Semantic HTML** with proper heading hierarchy
- **Internal linking** strategy

### Accessibility Features
- **WCAG 2.1 AA compliance** 
- **Keyboard navigation** support
- **Screen reader** optimized ARIA labels
- **Color contrast** meets accessibility standards
- **Focus management** for interactive elements
- **Alternative text** for all images

## Deployment

### GitHub Pages Configuration

```yaml
# Deployment Details
Platform: GitHub Pages
Domain: jackewers.com  
SSL: Enabled (Let's Encrypt)
CDN: GitHub's global CDN
Build: Static site generation
```

### Deployment Files
```
├── CNAME              # Custom domain configuration
├── robots.txt         # SEO crawler instructions  
├── .nojekyll         # Bypass Jekyll processing
└── cert.pem          # SSL certificate backup
```

### Continuous Deployment
1. **Push to main branch** triggers automatic deployment
2. **GitHub Actions** can be configured for build processes
3. **Custom domain** automatically configured via CNAME
4. **SSL certificate** auto-renewed by GitHub Pages

## Development Workflow

### Git Commit Convention

Our project uses a structured commit message system for better tracking:

```bash
# Commit Message Format
--P(page) Page alteration
--N Additional Notes  
--X Critical Error found/addressing
--MF Minor Fixes
--MJ Major Fixes
--B Bug hunting

# Example Usage
git commit -m "--P(index.html)/MJ/--N Camera functionality fixes & responsive improvements"
```

### Development Setup

```bash
# Local Development
1. Clone repository
2. Open in VS Code or preferred editor
3. Use Live Server extension for local testing
4. Test responsive design with browser dev tools

# File Structure
- Edit HTML files directly
- CSS files organized by component/page
- JavaScript modules for specific functionality
- Images optimized and organized in /i/ directory
```

## Analytics & Monitoring

### Performance Metrics
- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: Optimized for Google's standards
- **Mobile Performance**: 95+ score on mobile devices
- **Accessibility Score**: 100% WCAG compliance

### SEO Rankings
- **Google Search Console** integration
- **Structured data** validation
- **Mobile-friendly** test passing
- **Page speed** optimization

## Contributing

### Development Guidelines

1. **Code Style**
   - Use semantic HTML5 elements
   - Follow BEM methodology for CSS classes
   - Write accessible, performant JavaScript
   - Optimize images before committing

2. **Testing Checklist**
   - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
   - Verify mobile responsiveness  
   - Check accessibility with screen readers
   - Validate HTML and CSS
   - Test performance with Lighthouse

3. **Pull Request Process**
   - Follow git commit conventions
   - Include screenshots for UI changes
   - Update documentation if needed
   - Test thoroughly before submitting

## License

This project is licensed under the **MIT License** - see the [LICENSE](license.txt) file for details.

---

<div align="center">

### Connect With Me

[![Website](https://img.shields.io/badge/Portfolio-jackewers.com-blue?style=for-the-badge)](https://jackewers.com)
[![GitHub](https://img.shields.io/badge/GitHub-The--Guy--With--the--Holes-black?style=for-the-badge&logo=github)](https://github.com/The-Guy-With-the-Holes)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/jackewers)

**Built by Jack Ewers**  
*Software Developer | Creative Problem Solver | Mental Health Advocate*

---

**Star this repository if you found it helpful or interesting!**

</div>

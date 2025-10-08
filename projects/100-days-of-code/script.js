// 100 Days of Code Timeline Generator

// Sample project data - can be expanded with real projects
const projectsData = [
    { 
        name: "Linktree Clone", 
        description: "A linktree clone built with HTML, CSS, and JavaScript to showcase multiple links in a single page.",
        image: "/linktree/linktree-square.png",
        link: "/projects/linktree/",
        tags: ["JavaScript", "DOM", "Tutorial"],
        completed: true
    },
    { 
        name: "Calculator", 
        description: "A clean, responsive calculator app built with HTML, CSS, and JavaScript featuring basic arithmetic operations.",
        image: "/projects/calculator/calculator.png",
        link: "/projects/calculator/",
        tags: ["HTML", "CSS", "JavaScript"],
        completed: true
    },  
    {
        name: "Text-to-Speech",
        description: "A simple web app that converts text input into speech using the Web Speech API.",
        image: "data:image/jpeg;base64,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",
        link: "/projects/text-to-speech/",
        tags: ["HTML", "CSS", "JavaScript", "Web API"],
        completed: false
    },
     { 
        name: "Embedable Calculator", 
        description: "A rework of calculator app to be embeddable on any website with a simple script tag.",
        image: "/projects/calculator/calculator.png",
        link: "/projects/calculator/",
        tags: ["HTML", "CSS", "JavaScript"],
        completed: false
    },

];

// Generate placeholder projects to reach 100 days
function generateProjects() {
    const projects = [...projectsData];
    
    const placeholderProjects = [
        "Todo App", "Weather Widget", "Random Quote Generator", "Color Palette Generator", 
        "Password Generator", "BMI Calculator", "Unit Converter", "Digital Clock",
        "Stopwatch", "Countdown Timer", "Memory Game", "Rock Paper Scissors",
        "Tic Tac Toe", "Snake Game", "Pong Game", "Flappy Bird Clone",
        "Chat App", "Blog Platform", "Portfolio Site", "E-commerce Store",
        "Recipe Finder", "Movie Database", "Music Player", "Photo Gallery",
        "Calendar App", "Expense Tracker", "Note Taking App", "Drawing Canvas",
        "QR Code Generator", "URL Shortener", "File Uploader", "Image Editor",
        "Code Editor", "Markdown Parser", "API Wrapper", "Data Visualizer",
        "Chart Generator", "Map Integration", "Real-time Chat", "Video Player"
    ];
    
    const technologies = [
        ["HTML", "CSS", "JavaScript"], ["React", "Node.js", "MongoDB"], 
        ["Vue.js", "Express"], ["Python", "Flask"], ["PHP", "MySQL"],
        ["Java", "Spring"], ["C#", ".NET"], ["Ruby", "Rails"],
        ["Angular", "TypeScript"], ["Svelte", "Firebase"], ["Next.js", "Prisma"],
        ["Django", "PostgreSQL"], ["Laravel", "Vue"], ["Gatsby", "GraphQL"]
    ];
    
    // Add placeholder projects to reach 100
    while (projects.length < 100) {
        const randomProject = placeholderProjects[Math.floor(Math.random() * placeholderProjects.length)];
        const randomTechs = technologies[Math.floor(Math.random() * technologies.length)];
        
        projects.push({
            name: `${randomProject} ${projects.length + 1}`,
            description: `Building ${randomProject.toLowerCase()} to practice development skills and explore new technologies.`,
            image: null,
            tags: randomTechs,
            completed: projects.length < 3 // Mark first 3 as completed
        });
    }
    
    return projects.slice(0, 100);
}

// Create timeline entry HTML
function createTimelineEntry(project, dayNumber) {
    const isCompleted = project.completed;
    const imageContent = project.image 
        ? `<img src="${project.image}" alt="${project.name}">`
        : '<div class="placeholder-icon">💻</div>';
    
    const tagsHtml = project.tags.map(tag => `<span class="day-tag">${tag}</span>`).join('');
    
    return `
        <div class="timeline-entry" style="animation-delay: ${dayNumber * 0.1}s">
            <a href="${project.link}" class="day-card ${isCompleted ? 'completed' : 'upcoming'}">
                <div class="day-image">
                    ${imageContent}
                </div>
                <h3 class="day-title">${project.name}</h3>
                <p class="day-description">${project.description}</p>
                <div class="day-tags">
                    ${tagsHtml}
                </div>
                ${isCompleted ? '<div class="completion-badge">✓ Completed</div>' : '<div class="upcoming-badge">📅 Planned</div>'}
            </a>
            <div class="day-number">${dayNumber}</div>
        </div>
    `;
}

// Initialize the timeline
function initTimeline() {
    const projects = generateProjects();
    const timelineEntries = document.getElementById('timelineEntries');
    
    // Generate all 100 day entries
    let timelineHTML = '';
    projects.forEach((project, index) => {
        timelineHTML += createTimelineEntry(project, index + 1);
    });
    
    timelineEntries.innerHTML = timelineHTML;
    
    // Update progress bar
    updateProgress();
    
    // Add scroll animation observer
    observeTimelineEntries();
}

// Update progress bar based on completed projects
function updateProgress() {
    const completedDays = projectsData.filter(p => p.completed).length;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (completedDays / 100) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Day ${completedDays} of 100`;
}

// Animate timeline entries on scroll
function observeTimelineEntries() {
    const entries = document.querySelectorAll('.timeline-entry');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    entries.forEach(entry => {
        observer.observe(entry);
    });
}

// Smooth scroll to specific day
function scrollToDay(dayNumber) {
    const entries = document.querySelectorAll('.timeline-entry');
    if (entries[dayNumber - 1]) {
        entries[dayNumber - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Add some additional CSS for completion badges
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .day-card.completed {
            border-left: 4px solid #48bb78;
        }
        
        .day-card.upcoming {
            border-left: 4px solid #ed8936;
            opacity: 0.8;
        }
        
        .completion-badge {
            background: #48bb78;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            text-align: center;
            margin-top: 1rem;
        }
        
        .upcoming-badge {
            background: #ed8936;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            text-align: center;
            margin-top: 1rem;
        }
        
        .placeholder-icon {
            font-size: 4rem;
            opacity: 0.5;
        }
        
        .timeline-entry {
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    initTimeline();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            window.scrollBy(0, 300);
        } else if (e.key === 'ArrowUp') {
            window.scrollBy(0, -300);
        }
    });
});

// Utility function for future enhancements
window.Timeline100Days = {
    scrollToDay,
    updateProgress,
    projects: projectsData
};
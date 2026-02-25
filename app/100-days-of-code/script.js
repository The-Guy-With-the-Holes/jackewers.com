// 100 Days of Code Timeline Generator

// Challenge Configuration
const CHALLENGE_CONFIG = {
    startDate: '2025-10-8', // Change this to your actual start date (YYYY-MM-DD)
    timezone: 'Australia/Perth', // AWST timezone
    totalDays: 100,
    stockpileMax: 100, // Max projects that can be stockpiled
    hoursPerProject: 24 // Hours allowed per project
};

// Function to send alert notification
function sendBehindAlert() {
    const userIdentifier = 'Browser User'; // Could be enhanced with actual user identification
    const message = `User:${userIdentifier} has alerted you are running behind in your 100 days code! get to it!`;
    
    // Check daily alert limit (max 2 per day)
    const today = new Date().toDateString();
    const alertData = JSON.parse(localStorage.getItem('alertData') || '{"date":"","count":0}');
    
    // Reset count if it's a new day
    if (alertData.date !== today) {
        alertData.date = today;
        alertData.count = 0;
    }
    
    // Check if limit reached
    if (alertData.count >= 2) {
        alert('Alert limit reached for today (2 alerts max)');
        return;
    }
    
    fetch('https://ntfy.sh/jackewers_notif', {
        method: 'POST',
        body: message,
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    .then(() => {
        // Increment count and save
        alertData.count++;
        localStorage.setItem('alertData', JSON.stringify(alertData));
        
        alert('Alert sent! Jack has been notified.');
        document.getElementById('alertButton').textContent = `✓ Sent! (${alertData.count}/2 today)`;
        document.getElementById('alertButton').disabled = true;
        setTimeout(() => {
            document.getElementById('alertButton').textContent = '🔔 Alert Jack!';
            document.getElementById('alertButton').disabled = false;
        }, 30000); // Re-enable after 30 seconds
    })
    .catch(err => {
        console.error('Failed to send alert:', err);
        alert('Failed to send alert. Please try again.');
    });
}

// Load projects from JSON file
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects.json');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        return []; // Return empty array if loading fails
    }
}

// Project data loaded from JSON
let projectsData = [];

// Generate placeholder projects to reach 100 days
function generateProjects() {
    const projects = [];
    
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
    
    // Generate all 100 days
    for (let day = 1; day <= 100; day++) {
        // Check if this day exists in projectsData
        const existingProject = projectsData.find(p => p.day === day);
        
        if (existingProject) {
            // Use actual project from JSON
            projects.push(existingProject);
        } else {
            // Create placeholder
            const randomProject = placeholderProjects[Math.floor(Math.random() * placeholderProjects.length)];
            const randomTechs = technologies[Math.floor(Math.random() * technologies.length)];
            
            projects.push({
                day: day,
                name: `Project ${day}`,
                description: "TBC",
                image: null,
                link: "#",
                tags: randomTechs,
                dateCompleted: null
            });
        }
    }
    
    return projects;
}

// Create timeline entry HTML
function createTimelineEntry(project, dayNumber) {
    const isCompleted = project.dateCompleted !== null;
    const fallbackIcon = project.fallbackIcon || '💻';
    const imageContent = project.image 
        ? `<img src="${project.image}" alt="${project.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="placeholder-icon" style="display:none;">${fallbackIcon}</div>`
        : `<div class="placeholder-icon">${fallbackIcon}</div>`;
    
    const tagsHtml = project.tags.map(tag => `<span class="pill-tag">${tag}</span>`).join('');
    
    let statusBadge;
    if (project.isWIP) {
        statusBadge = '<div class="wip-badge">🚧 Work in Progress</div>';
    } else if (isCompleted) {
        statusBadge = '<div class="completion-badge">✓ Completed</div>';
    } else {
        statusBadge = '<div class="upcoming-badge">📅 Planned</div>';
    }
    
    return `
        <div class="timeline-entry" style="animation-delay: ${dayNumber * 0.1}s">
            <a href="${project.link}" class="day-card ${isCompleted ? 'completed' : 'upcoming'} ${project.isWIP ? 'wip' : ''}">
                <div class="day-image">
                    ${imageContent}
                </div>
                <h3 class="day-title">${project.name}</h3>
                <p class="day-description">${project.description}</p>
                <div class="pill-tags">
                    ${tagsHtml}
                </div>
                ${statusBadge}
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
    const completedDays = projectsData.filter(p => p.dateCompleted !== null).length;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (completedDays / 100) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Day ${completedDays} of 100`;
}

// Calculate next project due time and update countdown
function updateCountdown() {
    const now = new Date();
    const completedProjects = projectsData.filter(p => p.dateCompleted !== null);
    const startDate = new Date(CHALLENGE_CONFIG.startDate);
    
    // Get current time in AWST
    const awstNow = new Date().toLocaleString('en-CA', {
        timeZone: CHALLENGE_CONFIG.timezone,
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const [datePart, timePart] = awstNow.split(', ');
    const awstTime = new Date(`${datePart}T${timePart}`);
    
    // Calculate last completion time from most recent project
    let lastCompletionTime = new Date(startDate);
    if (completedProjects.length > 0) {
        // Sort by dateCompleted and get the most recent
        const sortedProjects = completedProjects.sort((a, b) => 
            new Date(b.dateCompleted) - new Date(a.dateCompleted)
        );
        lastCompletionTime = new Date(sortedProjects[0].dateCompleted);
    }
    
    // Time since last code
    const timeSinceLastCode = awstTime - lastCompletionTime;
    const hoursSinceLastCode = timeSinceLastCode / (1000 * 60 * 60);
    
    // Calculate stockpile based on recent activity
    // Count how many projects were completed in the last 24 hours from the most recent completion
    const oneDayAgo = new Date(lastCompletionTime);
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const recentProjects = completedProjects.filter(p => {
        const completionDate = new Date(p.dateCompleted);
        return completionDate >= oneDayAgo && completionDate <= lastCompletionTime;
    });
    
    // Stockpile = projects completed in last 24h - 1 (the one you're supposed to do)
    const stockpile = Math.max(0, Math.min(CHALLENGE_CONFIG.stockpileMax, recentProjects.length - 1));
    
    // Calculate time remaining until overdue
    // Next project due = last completion + 24 hours + (stockpile * 24 hours)
    const nextDueTime = new Date(lastCompletionTime);
    nextDueTime.setDate(nextDueTime.getDate() + (stockpile + 1));
    nextDueTime.setHours(23, 59, 59, 999); // End of day
    
    const timeRemaining = nextDueTime - awstTime;
    
    let countdownDisplay, status, statusText;
    const alertButton = document.getElementById('alertButton');
    
    if (timeRemaining <= 0) {
        // Overdue - but posting a project resets to 24 hours
        countdownDisplay = 'OVERDUE';
        status = 'behind';
        statusText = 'Behind Schedule';
        if (alertButton) alertButton.classList.remove('hidden');
    } else {
        if (alertButton) alertButton.classList.add('hidden');
        
        const totalHours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        if (totalHours >= 24) {
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            countdownDisplay = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            status = 'ahead';
            statusText = stockpile > 0 ? `Stockpiled: ${stockpile} project${stockpile > 1 ? 's' : ''}` : 'On Track';
        } else {
            countdownDisplay = `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            status = totalHours < 3 ? 'on-track' : 'ahead';
            statusText = totalHours < 3 ? 'Due Soon!' : 'On Track';
        }
    }
    
    // Update DOM elements
    const countdownTime = document.getElementById('countdownTime');
    const scheduleStatus = document.getElementById('scheduleStatus');
    
    if (countdownTime) {
        countdownTime.textContent = countdownDisplay;
        countdownTime.className = status === 'behind' && countdownDisplay === 'OVERDUE' ? 'countdown-time overdue' : 'countdown-time';
    }
    
    if (scheduleStatus) {
        scheduleStatus.textContent = statusText;
        scheduleStatus.className = `schedule-status ${status}`;
    }
}

// Start countdown timer
function initCountdown() {
    updateCountdown(); // Initial update
    setInterval(updateCountdown, 1000); // Update every second
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
document.addEventListener('DOMContentLoaded', async () => {
    addDynamicStyles();
    
    // Load projects from JSON first
    projectsData = await loadProjects();
    
    // Then initialize timeline and countdown
    initTimeline();
    initCountdown(); // Start the countdown timer
    
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
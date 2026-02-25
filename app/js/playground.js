const editor = document.getElementById('editor');
const output = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const lastRun = document.getElementById('lastRun');
const examplesBtn = document.getElementById('examplesBtn');
const examplesMenu = document.getElementById('examplesMenu');

// Example code snippets
const examples = {
    alert: `// Alert Dialog Example
// Show a popup message to the user

alert('Hello! This is an alert dialog.');
console.log('Alert shown to user');

// You can also use confirm for yes/no questions
const response = confirm('Do you like JavaScript?');
console.log('User response:', response ? 'Yes' : 'No');`,

    console: `// Console Logging Examples
// Different types of console output

console.log('📝 Regular log message');
console.info('ℹ️ Information message');
console.warn('⚠️ Warning message');
console.error('❌ Error message');

// Log objects and arrays
const user = { name: 'Jack', role: 'Developer' };
console.log('User object:', user);

const colors = ['red', 'green', 'blue'];
console.log('Colors array:', colors);`,

    canvas: `// Canvas Skull Drawing
// Create a simple skull using canvas

const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// Skull
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.ellipse(100, 90, 60, 70, 0, 0, Math.PI * 2);
ctx.fill();

// Eyes
ctx.fillStyle = '#000';
ctx.fillRect(70, 70, 20, 30);
ctx.fillRect(110, 70, 20, 30);

// Nose
ctx.beginPath();
ctx.moveTo(100, 110);
ctx.lineTo(90, 130);
ctx.lineTo(110, 130);
ctx.fill();

// Teeth
ctx.fillStyle = '#fff';
for(let i = 0; i < 5; i++) {
    ctx.fillRect(65 + i*15, 140, 12, 15);
}

console.log('💀 Skull drawn on canvas!');`,

    form: `// Form Validation Example
// Create and validate a simple form

const form = document.createElement('form');
form.style.cssText = \`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
\`;

form.innerHTML = \`
    <h3 style="margin: 0 0 1rem 0; color: #333;">User Registration</h3>
    <input type="text" id="username" placeholder="Username" required 
           style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 1rem; 
                  border: 2px solid #ddd; border-radius: 4px; font-size: 1rem;">
    <input type="email" id="email" placeholder="Email" required
           style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 1rem; 
                  border: 2px solid #ddd; border-radius: 4px; font-size: 1rem;">
    <button type="submit" 
            style="background: #4ec9b0; color: white; border: none; padding: 0.75rem 2rem; 
                   border-radius: 4px; cursor: pointer; font-size: 1rem; width: 100%;">
        Submit
    </button>
\`;
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    if (username.length < 3) {
        console.error('❌ Username must be at least 3 characters');
        return;
    }
    
    if (!email.includes('@')) {
        console.error('❌ Invalid email address');
        return;
    }
    
    console.log('✅ Form valid!');
    console.log('Username:', username);
    console.log('Email:', email);
    
    // Remove form after successful submission
    form.remove();
});

console.log('📋 Form created - try submitting it!');`,

    animation: `// Animation Example
// Animate a bouncing ball

const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 200;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

let x = 50;
let y = 50;
let dx = 2;
let dy = 2;
const radius = 15;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ball
    ctx.fillStyle = '#4ec9b0';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bounce off walls
    if (x + dx > canvas.width - radius || x + dx < radius) {
        dx = -dx;
    }
    if (y + dy > canvas.height - radius || y + dy < radius) {
        dy = -dy;
    }
    
    x += dx;
    y += dy;
    
    requestAnimationFrame(animate);
}

animate();
console.log('✨ Animation started!');`,

    fetch: `// Fetch API Example
// Get data from an API

console.log('🌐 Fetching user data...');

fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => response.json())
    .then(user => {
        console.log('✅ Data received!');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('City:', user.address.city);
        console.log('Company:', user.company.name);
        console.log('Website:', user.website);
    })
    .catch(error => {
        console.error('❌ Error fetching data:', error);
    });`
};

// Toggle examples menu
examplesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    examplesMenu.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', () => {
    examplesMenu.classList.remove('show');
});

// Load example on click
document.querySelectorAll('.example-item').forEach(item => {
    item.addEventListener('click', () => {
        const exampleKey = item.dataset.example;
        editor.value = examples[exampleKey];
        examplesMenu.classList.remove('show');
        addOutput(`📚 Loaded example: ${item.textContent}`, 'info');
    });
});

// Override console methods to capture output
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
};

function addOutput(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `<span class="log-time">${time}</span>${escapeHtml(String(message))}`;
    output.appendChild(entry);
    output.scrollTop = output.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Intercept console methods
console.log = function(...args) {
    originalConsole.log.apply(console, args);
    addOutput(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' '), 'info');
};

console.warn = function(...args) {
    originalConsole.warn.apply(console, args);
    addOutput(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' '), 'warn');
};

console.error = function(...args) {
    originalConsole.error.apply(console, args);
    addOutput(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' '), 'error');
};

console.info = function(...args) {
    originalConsole.info.apply(console, args);
    addOutput(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' '), 'info');
};

function runCode() {
    const code = editor.value;
    
    if (!code.trim()) {
        addOutput('No code to run', 'warn');
        return;
    }

    addOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    addOutput('▶ Running code...', 'info');
    
    try {
        // Execute the code
        const result = eval(code);
        
        // Show result if it's not undefined
        if (result !== undefined) {
            addOutput(`Result: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`, 'result');
        }
        
        statusBar.className = 'status-bar status-success';
        statusText.textContent = '✓ Code executed successfully';
        lastRun.textContent = `Last run: ${new Date().toLocaleTimeString()}`;
        
        setTimeout(() => {
            statusBar.className = 'status-bar';
            statusText.textContent = 'Ready to run JavaScript';
        }, 3000);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        statusBar.className = 'status-bar status-error';
        statusText.textContent = '✗ Execution failed';
        lastRun.textContent = `Error at: ${new Date().toLocaleTimeString()}`;
    }
}

function clearOutput() {
    output.innerHTML = '';
    
    // Remove any dynamically created elements (canvas, forms, etc.)
    const dynamicElements = document.querySelectorAll('body > canvas, body > form');
    dynamicElements.forEach(el => el.remove());
    
    statusBar.className = 'status-bar';
    statusText.textContent = 'Output cleared';
    lastRun.textContent = '';
    
    setTimeout(() => {
        statusText.textContent = 'Ready to run JavaScript';
    }, 2000);
}

// Event listeners
runBtn.addEventListener('click', runCode);
clearBtn.addEventListener('click', clearOutput);

// Keyboard shortcuts
editor.addEventListener('keydown', (e) => {
    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
    }

    // Tab key for indentation
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
    }
});

// Welcome message
addOutput('🚀 JavaScript Playground Ready!', 'info');
addOutput('Write your code in the editor and press "Run Code" or Ctrl+Enter', 'info');

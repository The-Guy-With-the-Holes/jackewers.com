// Am I Old Yet? - Slang Analysis Engine
class SlangAnalyzer {
    constructor() {
        this.slangDatabase = {
            // Current Gen Z/Alpha slang (2020-2025)
            current: {
                'no cap': { era: '2020s', meaning: 'no lie, for real' },
                'periodt': { era: '2020s', meaning: 'period, end of discussion' },
                'slay': { era: '2020s', meaning: 'doing something excellently' },
                'bet': { era: '2020s', meaning: 'okay, sure, agreed' },
                'fam': { era: '2020s', meaning: 'family, close friends' },
                'bussin': { era: '2020s', meaning: 'really good, excellent' },
                'sheesh': { era: '2020s', meaning: 'wow, expression of amazement' },
                'slaps': { era: '2020s', meaning: 'something that hits different' },
                'vibes': { era: '2020s', meaning: 'mood, feeling, atmosphere' },
                'sus': { era: '2020s', meaning: 'suspicious' },
                'based': { era: '2020s', meaning: 'being yourself, not caring about others opinions' },
                'lowkey': { era: '2020s', meaning: 'somewhat, kind of' },
                'highkey': { era: '2020s', meaning: 'definitely, obviously' },
                'fire': { era: '2020s', meaning: 'awesome, cool' },
                'drip': { era: '2020s', meaning: 'style, fashion sense' },
                'cap': { era: '2020s', meaning: 'lie, false statement' },
                'stan': { era: '2020s', meaning: 'to be a big fan of' },
                'simp': { era: '2020s', meaning: 'someone who tries too hard to impress' },
                'rizz': { era: '2020s', meaning: 'charisma, charm' },
                'mid': { era: '2020s', meaning: 'mediocre, average' },
                'ohio': { era: '2020s', meaning: 'weird, cringe' },
                'sigma': { era: '2020s', meaning: 'alpha male, independent' },
                'skibidi': { era: '2020s', meaning: 'nonsense word, gen alpha slang' },
                'gyatt': { era: '2020s', meaning: 'expression of surprise' },
                'mewing': { era: '2020s', meaning: 'jaw exercise trend' },
                'aura': { era: '2020s', meaning: 'personal energy, vibe' }
            },
            
            // Millennial slang (2000s-2010s)
            millennial: {
                'lit': { era: '2010s', meaning: 'exciting, awesome' },
                'savage': { era: '2010s', meaning: 'brutal, ruthless' },
                'woke': { era: '2010s', meaning: 'socially aware' },
                'basic': { era: '2010s', meaning: 'mainstream, unoriginal' },
                'salty': { era: '2010s', meaning: 'bitter, upset' },
                'thirsty': { era: '2010s', meaning: 'desperate for attention' },
                'flex': { era: '2010s', meaning: 'show off' },
                'ghost': { era: '2010s', meaning: 'suddenly stop communicating' },
                'sliding into dms': { era: '2010s', meaning: 'sending private messages' },
                'netflix and chill': { era: '2010s', meaning: 'casual hangout' },
                'on fleek': { era: '2010s', meaning: 'on point, perfect' },
                'yasss': { era: '2010s', meaning: 'enthusiastic yes' },
                'squad': { era: '2010s', meaning: 'friend group' },
                'bae': { era: '2010s', meaning: 'before anyone else, significant other' },
                'throwing shade': { era: '2010s', meaning: 'insulting subtly' },
                'spilling tea': { era: '2010s', meaning: 'sharing gossip' },
                'extra': { era: '2010s', meaning: 'over the top' },
                'blessed': { era: '2010s', meaning: 'grateful, fortunate' }
            },
            
            // Gen X slang (1990s-2000s)
            genx: {
                'phat': { era: '1990s', meaning: 'cool, awesome' },
                'da bomb': { era: '1990s', meaning: 'the best' },
                'all that and a bag of chips': { era: '1990s', meaning: 'amazing, awesome' },
                'as if': { era: '1990s', meaning: 'no way, unlikely' },
                'booyah': { era: '1990s', meaning: 'expression of triumph' },
                'talk to the hand': { era: '1990s', meaning: 'I dont want to hear it' },
                'psych': { era: '1990s', meaning: 'just kidding' },
                'my bad': { era: '1990s', meaning: 'my mistake' },
                'wicked': { era: '1990s', meaning: 'very, extremely' },
                'tight': { era: '1990s', meaning: 'cool, awesome' },
                'dope': { era: '1990s', meaning: 'cool, awesome' },
                'fresh': { era: '1990s', meaning: 'cool, new' },
                'bananas': { era: '1990s', meaning: 'crazy, wild' },
                'off the hook': { era: '1990s', meaning: 'awesome, exciting' },
                'whack': { era: '1990s', meaning: 'bad, uncool' }
            },
            
            // Boomer/older slang (1980s and earlier)
            boomer: {
                'groovy': { era: '1960s', meaning: 'cool, fashionable' },
                'far out': { era: '1960s', meaning: 'excellent, amazing' },
                'tubular': { era: '1980s', meaning: 'awesome, cool' },
                'radical': { era: '1980s', meaning: 'extreme, cool' },
                'gnarly': { era: '1980s', meaning: 'awesome or terrible' },
                'bodacious': { era: '1980s', meaning: 'excellent, attractive' },
                'righteous': { era: '1980s', meaning: 'excellent, cool' },
                'mondo': { era: '1980s', meaning: 'very, extremely' },
                'cowabunga': { era: '1980s', meaning: 'expression of excitement' },
                'gag me with a spoon': { era: '1980s', meaning: 'thats disgusting' },
                'psyched': { era: '1980s', meaning: 'excited, thrilled' },
                'stoked': { era: '1980s', meaning: 'excited, pleased' },
                'bogus': { era: '1980s', meaning: 'fake, bad' },
                'choice': { era: '1980s', meaning: 'excellent, cool' },
                'grody': { era: '1980s', meaning: 'gross, disgusting' },
                'ace': { era: '1970s', meaning: 'excellent, first-rate' },
                'dig it': { era: '1960s', meaning: 'understand, like it' },
                'can you dig it': { era: '1970s', meaning: 'do you understand' },
                'jive': { era: '1940s', meaning: 'talk, music style' },
                'square': { era: '1950s', meaning: 'uncool person' },
                'cats pajamas': { era: '1920s', meaning: 'something excellent' },
                'bees knees': { era: '1920s', meaning: 'excellent thing' },
                'twenty-three skidoo': { era: '1900s', meaning: 'leave quickly' }
            }
        };
        
        this.diagnoses = {
            0: {
                title: "Digital Native 👶",
                description: "You're so current, you probably invented half these words yourself. Either you're Gen Alpha or you're trying really hard to keep up!",
                advice: "Slow down there, trend-setter. Save some slang for the rest of us!"
            },
            20: {
                title: "Terminally Online 😎", 
                description: "You're riding the wave of current slang like a pro. You probably have TikTok notifications turned on and know what's trending before it's trending.",
                advice: "You're killing it! Just don't forget to touch some grass occasionally."
            },
            40: {
                title: "Millennial Survivor 🏆",
                description: "You've got a nice mix of current and classic slang. You probably still say 'adulting is hard' but also know what 'no cap' means.",
                advice: "Perfect balance! You can talk to both your teenage cousins AND your coworkers."
            },
            60: {
                title: "Generational Confused 🤔",
                description: "Your slang game is all over the place. You might be a cool parent trying to connect with your kids, or someone who learned slang from outdated websites.",
                advice: "Pick a lane! Either go full boomer or embrace the chaos of modern slang."
            },
            80: {
                title: "Time Traveler 👴",
                description: "Your slang is so retro it's almost vintage. You probably still say things are 'da bomb' and think 'fleek' is current.",
                advice: "The 90s called - they want their slang back! Time to level up your vocabulary."
            },
            100: {
                title: "Prehistoric Specimen 🦴",
                description: "Congratulations! Your slang is so old, archaeologists want to study it. You make boomers look hip.",
                advice: "Have you considered a career in historical linguistics? Your slang knowledge is museum-worthy!"
            }
        };
    }

    analyzeInput(input) {
        const words = this.extractSlangWords(input.toLowerCase());
        const analysis = {
            current: [],
            millennial: [],
            genx: [],
            boomer: [],
            unknown: []
        };
        
        let totalWords = 0;
        let ageScore = 0;
        
        words.forEach(word => {
            let found = false;
            
            // Check current slang
            if (this.slangDatabase.current[word]) {
                analysis.current.push({ word, ...this.slangDatabase.current[word] });
                ageScore += 0; // Current slang = youngest score
                found = true;
            }
            // Check millennial slang
            else if (this.slangDatabase.millennial[word]) {
                analysis.millennial.push({ word, ...this.slangDatabase.millennial[word] });
                ageScore += 25;
                found = true;
            }
            // Check Gen X slang
            else if (this.slangDatabase.genx[word]) {
                analysis.genx.push({ word, ...this.slangDatabase.genx[word] });
                ageScore += 50;
                found = true;
            }
            // Check boomer slang
            else if (this.slangDatabase.boomer[word]) {
                analysis.boomer.push({ word, ...this.slangDatabase.boomer[word] });
                ageScore += 100;
                found = true;
            }
            
            if (found) {
                totalWords++;
            } else if (word.length > 2) { // Only count meaningful unknown words
                analysis.unknown.push(word);
            }
        });
        
        // Calculate final age score
        const finalScore = totalWords > 0 ? Math.round(ageScore / totalWords) : 50;
        
        return {
            score: Math.min(100, Math.max(0, finalScore)),
            breakdown: analysis,
            totalSlangWords: totalWords,
            diagnosis: this.getDiagnosis(finalScore)
        };
    }
    
    extractSlangWords(input) {
        // Split by common delimiters and clean up
        const words = input.split(/[,\s\n\r]+/)
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);
            
        // Also check for multi-word phrases
        const phrases = [];
        Object.keys({...this.slangDatabase.current, ...this.slangDatabase.millennial, 
                     ...this.slangDatabase.genx, ...this.slangDatabase.boomer}).forEach(phrase => {
            if (input.includes(phrase.toLowerCase())) {
                phrases.push(phrase.toLowerCase());
            }
        });
        
        return [...new Set([...words, ...phrases])];
    }
    
    getDiagnosis(score) {
        // Find the closest diagnosis
        const scores = Object.keys(this.diagnoses).map(Number).sort((a, b) => a - b);
        let closestScore = scores[0];
        
        for (let i = 1; i < scores.length; i++) {
            if (Math.abs(score - scores[i]) < Math.abs(score - closestScore)) {
                closestScore = scores[i];
            }
        }
        
        return this.diagnoses[closestScore];
    }
}

// Initialize the analyzer
const slangAnalyzer = new SlangAnalyzer();

// UI Functions
function analyzeSlang() {
    const input = document.getElementById('slang-input').value.trim();
    
    if (!input) {
        alert('Please enter some slang words first! 😅');
        return;
    }
    
    const analysis = slangAnalyzer.analyzeInput(input);
    displayResults(analysis);
}

function displayResults(analysis) {
    // Show results container
    const results = document.getElementById('results');
    results.classList.add('show');
    
    // Update age meter
    updateAgeMeter(analysis.score);
    
    // Display diagnosis
    displayDiagnosis(analysis.diagnosis, analysis.score);
    
    // Display breakdown
    displayBreakdown(analysis.breakdown, analysis.totalSlangWords);
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth' });
}

function updateAgeMeter(score) {
    const pointer = document.getElementById('meter-pointer');
    const emojis = document.querySelectorAll('.emoji');
    const scale = document.querySelector('.emoji-scale');
    
    // Reset all emojis
    emojis.forEach(emoji => emoji.classList.remove('active'));
    
    // Calculate pointer position (5% to 95% to avoid edges)
    const position = 5 + (score / 100) * 90;
    pointer.style.left = `${position}%`;
    
    // Activate closest emoji
    let closestEmoji = emojis[0];
    let closestDistance = Math.abs(score - parseInt(emojis[0].dataset.age));
    
    emojis.forEach(emoji => {
        const distance = Math.abs(score - parseInt(emoji.dataset.age));
        if (distance < closestDistance) {
            closestDistance = distance;
            closestEmoji = emoji;
        }
    });
    
    closestEmoji.classList.add('active');
}

function displayDiagnosis(diagnosis, score) {
    const diagnosisEl = document.getElementById('diagnosis');
    diagnosisEl.innerHTML = `
        <h4>🏥 Official Diagnosis: ${diagnosis.title}</h4>
        <p><strong>Age Score:</strong> ${score}/100</p>
        <p>${diagnosis.description}</p>
        <p><em>💡 Prescription: ${diagnosis.advice}</em></p>
    `;
}

function displayBreakdown(breakdown, totalWords) {
    const breakdownEl = document.getElementById('slang-breakdown');
    
    let html = '';
    
    if (breakdown.current.length > 0) {
        html += createCategoryCard('Current Slang', breakdown.current, 'current', '🔥');
    }
    
    if (breakdown.millennial.length > 0) {
        html += createCategoryCard('Millennial Classics', breakdown.millennial, 'millennial', '📱');
    }
    
    if (breakdown.genx.length > 0) {
        html += createCategoryCard('Gen X Throwbacks', breakdown.genx, 'genx', '💿');
    }
    
    if (breakdown.boomer.length > 0) {
        html += createCategoryCard('Vintage Collection', breakdown.boomer, 'boomer', '📻');
    }
    
    if (breakdown.unknown.length > 0) {
        html += createCategoryCard('Unrecognized Terms', breakdown.unknown, 'unknown', '❓');
    }
    
    if (totalWords === 0) {
        html = '<p style="text-align: center; color: var(--text-secondary);">No recognizable slang detected! Try adding some popular terms.</p>';
    }
    
    breakdownEl.innerHTML = html;
}

function createCategoryCard(title, items, category, emoji) {
    const isUnknown = category === 'unknown';
    
    let itemsHtml = '';
    if (isUnknown) {
        itemsHtml = items.map(item => `<li>${item}</li>`).join('');
    } else {
        itemsHtml = items.map(item => 
            `<li><strong>${item.word}</strong> (${item.era}) - ${item.meaning}</li>`
        ).join('');
    }
    
    return `
        <div class="slang-category category-${category}">
            <div class="category-title">
                <span>${emoji}</span>
                <strong>${title}</strong>
                <span>(${items.length})</span>
            </div>
            <ul class="slang-list">
                ${itemsHtml}
            </ul>
        </div>
    `;
}

function addExample(element) {
    const input = document.getElementById('slang-input');
    const currentValue = input.value.trim();
    const newWord = element.textContent;
    
    if (currentValue) {
        input.value = currentValue + ', ' + newWord;
    } else {
        input.value = newWord;
    }
    
    // Add visual feedback
    element.style.background = '#4ade80';
    setTimeout(() => {
        element.style.background = '#667eea';
    }, 300);
}

function shareResult() {
    const diagnosis = document.querySelector('#diagnosis h4').textContent;
    const scoreElement = document.querySelector('#diagnosis p');
    const score = scoreElement ? scoreElement.textContent.match(/\d+/)[0] : '50';
    
    // Create a shareable image card
    createShareableCard(diagnosis, score);
}

function createShareableCard(diagnosis, score) {
    // Create a canvas for the shareable image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions for social media (1200x630 for optimal sharing)
    canvas.width = 1200;
    canvas.height = 630;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add glassmorphism effect overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Add border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Set text properties
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Add title
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('Am I Old Yet?', canvas.width / 2, 150);
    
    // Add diagnosis
    ctx.font = 'bold 36px Arial, sans-serif';
    const diagnosisText = diagnosis.replace(/🏥|Official Diagnosis:|[👶😎🏆🤔👴🦴]/g, '').trim();
    ctx.fillText(diagnosisText, canvas.width / 2, 250);
    
    // Add score
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText(`${score}/100`, canvas.width / 2, 350);
    
    // Add age label
    ctx.font = '32px Arial, sans-serif';
    ctx.fillText('Slang Age Score', canvas.width / 2, 400);
    
    // Add website URL
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Test your slang age at jackewers.com', canvas.width / 2, 520);
    
    // Add emoji based on score
    ctx.font = '80px Arial, sans-serif';
    let emoji = '🤔';
    if (score <= 20) emoji = '👶';
    else if (score <= 40) emoji = '😎';
    else if (score <= 60) emoji = '🏆';
    else if (score <= 80) emoji = '👴';
    else emoji = '🦴';
    
    ctx.fillText(emoji, canvas.width / 2, 480);
    
    // Convert canvas to blob and create download/share
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        
        // Try native sharing first (mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'slang-result.png', { type: 'image/png' })] })) {
            const file = new File([blob], 'slang-result.png', { type: 'image/png' });
            navigator.share({
                title: 'Am I Old Yet? - Slang Test Results',
                text: `I scored ${score}/100 on the slang age test! ${diagnosisText}`,
                files: [file]
            });
        } else {
            // Fallback: Create download link and show share options
            showShareModal(url, score, diagnosisText);
        }
    }, 'image/png');
}

function showShareModal(imageUrl, score, diagnosis) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-header">
                <h3>🎯 Share Your Results!</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
            </div>
            
            <div class="share-preview">
                <img src="${imageUrl}" alt="Share card" class="share-image">
            </div>
            
            <div class="share-options">
                <button class="share-btn twitter-btn" onclick="shareToTwitter('${score}', '${diagnosis}', '${imageUrl}')">
                    🐦 Share on Twitter
                </button>
                <button class="share-btn facebook-btn" onclick="shareToFacebook('${imageUrl}')">
                    📘 Share on Facebook  
                </button>
                <button class="share-btn download-btn" onclick="downloadImage('${imageUrl}', 'slang-age-result.png')">
                    💾 Download Image
                </button>
                <button class="share-btn copy-btn" onclick="copyImageToClipboard('${imageUrl}')">
                    📋 Copy Image
                </button>
            </div>
            
            <div class="share-text">
                <p>Or copy this text to share:</p>
                <textarea readonly class="share-textarea">🎯 I scored ${score}/100 on the slang age test! ${diagnosis}

Find out how old your slang is: ${window.location.href}</textarea>
                <button class="copy-text-btn" onclick="copyShareText(this.previousElementSibling)">Copy Text</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function shareToTwitter(score, diagnosis, imageUrl) {
    const text = encodeURIComponent(`🎯 I scored ${score}/100 on the slang age test! ${diagnosis}\n\nTest your slang age:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook(imageUrl) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function downloadImage(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyImageToClipboard(imageUrl) {
    fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            return navigator.clipboard.write([item]);
        })
        .then(() => {
            alert('Image copied to clipboard! 📋');
        })
        .catch(() => {
            alert('Could not copy image. Try downloading instead.');
        });
}

function copyShareText(textarea) {
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Text copied to clipboard! 📋');
    });
}

function resetTest() {
    document.getElementById('slang-input').value = '';
    document.getElementById('results').classList.remove('show');
    document.getElementById('slang-input').focus();
}

// Add Enter key support
document.getElementById('slang-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        analyzeSlang();
    }
});

// Add some fun easter eggs
const easterEggs = [
    'skibidi toilet',
    'ohio rizz',
    'sigma grindset',
    'mewing mogger',
    'gyatt damn'
];

let easterEggCount = 0;
document.getElementById('slang-input').addEventListener('input', function(e) {
    const value = e.target.value.toLowerCase();
    if (easterEggs.some(egg => value.includes(egg))) {
        easterEggCount++;
        if (easterEggCount === 1) {
            console.log('🎉 You found a Gen Alpha easter egg!');
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('slang-input').focus();
});
// Certificate data
const certAlbums = [
    {
        name: 'APM College - Diploma',
        folder: '5Diploma',
        certs: ['Diploma of marketing']
    },
    {
        name: 'W3',
        folder: '6W3',
        certs: ['HTML']
    },
    {
        name: 'Program Hub Certificates',
        folder: '0Program Hub',
        certs: ['HTML', 'CSS', 'JavaScript', 'HTML Advanced', 'JavaScript Advanced', 'jQuery', 'BootStrap', 'Building a Website', 'GitHub', 'Docker', 'DevOps', 'Fundamentals', 'Ethical Hacking', 'BlockChain', 'CryptoCurrency', 'Google Display Ads', 'Growth Hacking']
    },
    {
        name: 'Solo Learn Courses',
        folder: '1Solo Learn',
        certs: ['HTML', 'CSS', 'JavaScript', 'JQUERY', 'Python for Beginners', 'Python Core', 'C', 'SQL', 'React+Redux', 'Responsive Web-Design', 'Web-Dev Fundamentals', 'JS Game Development', 'Coding for Marketers']
    },
    {
        name: 'Grasshopper Courses',
        folder: '2Grasshopper',
        certs: ['Coding Fundamentals-I', 'Coding Fundamentals-II', 'Animations', 'Animations II', 'Array Methods', 'Debugging', 'Intro to Interviewing']
    },
    {
        name: 'Ethical Hacking',
        folder: '3Ethical Hacker',
        certs: ['Certified Ethical Hacker', 'Intro', 'Concepts, Types & Phases', 'Threats & Attack-Vectors', 'FootPrinting & Recon', 'Scanning-Networks & Enumerations', 'System Hacking', 'Malware, Trojans, Worms', 'Network Sniffing', 'Social Engineering', 'Denial of Service', 'Session Hijacking', 'WebServer Hacking']
    },
    {
        name: 'HackerX Certifications',
        folder: '4HackerX',
        certs: ['HackerX Master', 'Gathering Information', 'Know the OS', 'Anonymous Surfing', 'Hacking Passwords', 'WEP Cracking', 'WPA,WPA2-Cracking', 'Hack the MAC', 'Network Spying', 'Keyboard Spying', 'Database Hacking', 'Bringing Down a Website', 'Social-Media Hacking', 'Android Hacking', 'WordPress Scanning', 'XSS,Cross-Site-Scripting', 'Vunerability Scanning & Reporting', 'Hiding Messages', 'Making Data Safe', 'Credit,Debit-Card Fraud']
    }
];
        
const BASE = 'https://media.bloodweb.net/jackewers/certificates/';

let currentAlbum = 0;
let currentCert = 0;

// ── Modal open/close ────────────────────────────────────────────
function openCertAlbum(albumName) {
    const idx = certAlbums.findIndex(a => a.name === albumName);
    if (idx < 0) return;
    currentAlbum = idx;
    currentCert = 0;
    updateModal();
    document.getElementById('certModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    document.getElementById('certModal').style.display = 'none';
    document.body.style.overflow = '';
}

// ── Navigation ──────────────────────────────────────────────────
function changeCert(direction) {
    currentCert += direction;
    const album = certAlbums[currentAlbum];
    if (currentCert < 0) {
        currentAlbum = (currentAlbum - 1 + certAlbums.length) % certAlbums.length;
        currentCert = certAlbums[currentAlbum].certs.length - 1;
    } else if (currentCert >= album.certs.length) {
        currentAlbum = (currentAlbum + 1) % certAlbums.length;
        currentCert = 0;
    }
    updateModal();
}

function changeAlbum(direction) {
    currentAlbum = (currentAlbum + direction + certAlbums.length) % certAlbums.length;
    currentCert = 0;
    updateModal();
}

// ── Render ──────────────────────────────────────────────────────
function updateModal() {
    const album = certAlbums[currentAlbum];
    const certName = album.certs[currentCert];
    const src = `${BASE}${album.folder}/${certName}.jpg`;

    document.getElementById('certModalImage').src = src;
    document.getElementById('certModalTitle').textContent = certName;
    document.getElementById('certModalAlbumTitle').textContent = album.name;
    document.getElementById('certModalCounter').textContent = `${currentCert + 1} / ${album.certs.length}`;

    document.getElementById('prevCertBtn').disabled = currentCert === 0 && currentAlbum === 0;
    document.getElementById('nextCertBtn').disabled = currentCert === album.certs.length - 1 && currentAlbum === certAlbums.length - 1;
    document.getElementById('prevAlbumBtn').disabled = currentAlbum === 0;
    document.getElementById('nextAlbumBtn').disabled = currentAlbum === certAlbums.length - 1;
}

// ── Expand/collapse sub-cert list ───────────────────────────────
function toggleCerts(button) {
    const card = button.closest('.certificate-card');
    const subCerts = card.querySelector('.sub-certificates');
    const expanded = subCerts.style.display === 'block';
    subCerts.style.display = expanded ? 'none' : 'block';
    button.innerHTML = expanded
        ? 'View All <i class="fas fa-chevron-down"></i>'
        : 'Show Less <i class="fas fa-chevron-up"></i>';
}

// ── DOMContentLoaded init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Collapse all sub-cert lists on load
    document.querySelectorAll('.sub-certificates').forEach(el => el.style.display = 'none');

    // Click a sub-cert item to open modal at that cert
    document.querySelectorAll('.sub-cert-item').forEach(item => {
        item.addEventListener('click', function () {
            const card = this.closest('.certificate-card');
            const albumName = card.dataset.album;
            const certName = this.textContent.trim();
            const albumIdx = certAlbums.findIndex(a => a.name === albumName);
            if (albumIdx < 0) return;
            const certIdx = certAlbums[albumIdx].certs.findIndex(c => c === certName);
            if (certIdx < 0) return;
            currentAlbum = albumIdx;
            currentCert = certIdx;
            updateModal();
            document.getElementById('certModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close on backdrop click
    document.getElementById('certModal').addEventListener('click', e => {
        if (e.target === document.getElementById('certModal')) closeCertModal();
    });

    // Keyboard nav
    document.addEventListener('keydown', e => {
        if (document.getElementById('certModal').style.display !== 'flex') return;
        if (e.key === 'Escape')     closeCertModal();
        if (e.key === 'ArrowLeft')  changeCert(-1);
        if (e.key === 'ArrowRight') changeCert(1);
    });
});
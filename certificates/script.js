   // Certificate data structure
        const certAlbums = [
             {
                name: 'Diploma',
                folder: '5Diploma',
                certs: ['Diploma of marketing']
            },
            {
                name: 'Program Hub Certificate Collection',
                folder: '0Program Hub',
                certs: ['HTML', 'CSS', 'JavaScript', 'HTML Advanced', 'JavaScript Advanced', 'jQuery', 'Bootstrap', 'Building a Website', 'GitHub', 'Docker', 'DevOps', 'Fundamentals', 'Ethical Hacking', 'Blockchain', 'Cryptocurrency', 'Google Display Ads', 'Growth Hacking']
            },
            {
                name: 'Solo Learn Courses',
                folder: '1Solo Learn',
                certs: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Python for Beginners', 'Python Core', 'C', 'SQL', 'React+Redux', 'Responsive Web-Design', 'Web-Dev Fundamentals', 'JS Game Development', 'Coding for Marketers']
            },
            {
                name: 'Grasshopper by Google',
                folder: '2Grasshopper',
                certs: ['Coding Fundamentals-I', 'Coding Fundamentals-II', 'Animations', 'Animations II', 'Array Methods', 'Debugging', 'Intro to Interviewing']
            },
            {
                name: 'Certified Ethical Hacker Program',
                folder: '3Ethical Hacker',
                certs: ['Certified Ethical Hacker', 'Intro', 'Concepts, Types & Phases', 'Threats & Attack-Vectors', 'FootPrinting & Recon', 'Scanning-Networks & Enumerations', 'System Hacking', 'Malware, Trojans, Worms', 'Network Sniffing', 'Social Engineering', 'Denial of Service', 'Session Hijacking', 'WebServer Hacking']
            },
            {
                name: 'HackerX Master Program',
                folder: '4HackerX',
                certs: ['HackerX Master', 'Gathering Information', 'Know the OS', 'Anonymous Surfing', 'Hacking Passwords', 'WEP-Cracking', 'WPA,WPA2-Cracking', 'Hack the MAC', 'Network Spying', 'Keyboard Spying', 'Database Hacking', 'Bringing Down a Website', 'Social-Media Hacking', 'Android Hacking', 'WordPress Scanning', 'XSS,Cross-Site-Scripting', 'Vunerability Scanning & Reporting', 'Hiding Messages', 'Making Data Safe', 'Credit,Debit-Card Fraud']
            }
        ];
        
        let currentAlbum = 0;
        let currentCert = 0;
        
        // Certificate modal functions
        const certModal = document.getElementById('certModal');
        const certModalImage = document.getElementById('certModalImage');
        const certModalTitle = document.getElementById('certModalTitle');
        const certModalAlbumTitle = document.getElementById('certModalAlbumTitle');
        const certModalCounter = document.getElementById('certModalCounter');
        
        function openCertModal(albumIndex, certIndex) {
            currentAlbum = albumIndex;
            currentCert = certIndex;
            updateModal();
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function updateModal() {
            const album = certAlbums[currentAlbum];
            const certName = album.certs[currentCert];
            const certPath = `https://media.bloodweb.net/jackewers/certificates/${album.folder}/${certName}.jpg`;
            
            certModalImage.src = certPath;
            certModalTitle.textContent = certName;
            certModalAlbumTitle.textContent = album.name;
            certModalCounter.textContent = `${currentCert + 1} / ${album.certs.length}`;
            
            // Update button states
            document.getElementById('prevCertBtn').disabled = currentCert === 0;
            document.getElementById('nextCertBtn').disabled = currentCert === album.certs.length - 1;
            document.getElementById('prevAlbumBtn').disabled = currentAlbum === 0;
            document.getElementById('nextAlbumBtn').disabled = currentAlbum === certAlbums.length - 1;
        }
        
        function changeCert(direction) {
            const album = certAlbums[currentAlbum];
            currentCert += direction;
            
            if (currentCert < 0) currentCert = 0;
            if (currentCert >= album.certs.length) currentCert = album.certs.length - 1;
            
            updateModal();
        }
        
        function changeAlbum(direction) {
            currentAlbum += direction;
            
            if (currentAlbum < 0) currentAlbum = 0;
            if (currentAlbum >= certAlbums.length) currentAlbum = certAlbums.length - 1;
            
            currentCert = 0; // Reset to first cert in new album
            updateModal();
        }
        
        function closeCertModal() {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close modal on background click
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeCertModal();
            }
            // Arrow key navigation
            if (certModal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') changeCert(-1);
                if (e.key === 'ArrowRight') changeCert(1);
            }
        });
        
        // Add click handlers to all certificate items
        document.querySelectorAll('.sub-cert-item').forEach(item => {
            item.addEventListener('click', function() {
                const certName = this.textContent.trim();
                const card = this.closest('.certificate-card');
                let albumIndex = 0;
                
                // Determine album based on parent card
                if (card.querySelector('.certificate-title').textContent.includes('Program Hub')) {
                    albumIndex = 0;
                } else if (card.querySelector('.certificate-title').textContent.includes('Solo Learn')) {
                    albumIndex = 1;
                } else if (card.querySelector('.certificate-title').textContent.includes('Grasshopper')) {
                    albumIndex = 2;
                } else if (card.querySelector('.certificate-title').textContent.includes('Ethical Hacker Program')) {
                    albumIndex = 3;
                } else if (card.querySelector('.certificate-title').textContent.includes('HackerX')) {
                    albumIndex = 4;
                }
                
                // Find certificate index within album
                const album = certAlbums[albumIndex];
                const certIndex = album.certs.findIndex(cert => cert === certName);
                
                if (certIndex !== -1) {
                    openCertModal(albumIndex, certIndex);
                }
            });
        });
        
        // Toggle sub-certificates
        function toggleCerts(button) {
            const card = button.closest('.certificate-card');
            const subCerts = card.querySelector('.sub-certificates');
            const icon = button.querySelector('i');
            
            card.classList.toggle('expanded');
            
            if (card.classList.contains('expanded')) {
                button.innerHTML = 'Hide <i class="fas fa-chevron-up"></i>';
            } else {
                button.innerHTML = 'View All <i class="fas fa-chevron-down"></i>';
            }
        }
        
        // Mobile nav toggle
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.textContent = navLinks.classList.contains('open') ? 'CLOSE ✕' : 'MENU ☰';
        });
        
        // Close nav when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.textContent = 'MENU ☰';
            });
        });
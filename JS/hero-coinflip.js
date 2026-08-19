/**
 * hero-coinflip.js — homepage portrait easter egg
 *
 * Flips the hero portrait like a coin on load, click and hover. Milestone
 * flips fire confetti: 10 is a small pop, 100 is a big one, and landing on
 * Jack's current age triggers the spooky birthday party (which also fires on
 * its own every 29 October).
 *
 * Lifted out of index.html verbatim when the homepage became a hub page;
 * behaviour is unchanged. Depends on .hero-profile and the coin-flip
 * keyframes in home.css.
 */

(function () {
    const img = document.querySelector('.hero-profile');
    if (!img) return;

    let flipping = false;
    let flipCount = 0;


    // ── Confetti ────────────────────────────────────────────────
    const COLORS_NORMAL = ['#f94144','#f3722c','#f8961e','#f9c74f','#90be6d','#43aa8b','#577590','#c77dff'];
    const COLORS_MEGA   = ['#ffd700','#ff69b4','#00ffff','#ff4500','#adff2f','#ff1493','#00fa9a','#ff6347'];
    const COLORS_SPOOKY = ['#ff6600','#9b30ff','#00ff00','#ffffff','#ff0000','#ffcc00','#7b2fff','#ff4500'];

    function spawnConfetti(count, colors, spread) {
        const container = img.closest('.hero-profile-container') || img.parentElement;
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2 + window.scrollX;
        const cy = rect.top  + rect.height / 2 + window.scrollY;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const angle  = (Math.random() * spread) - spread / 2 - 90; // mostly upward
            const speed  = 120 + Math.random() * 220;
            const size   = 7 + Math.random() * 10;
            const color  = colors[Math.floor(Math.random() * colors.length)];
            const shape  = Math.random() > 0.4 ? 'rect' : 'circle';
            const rotate = Math.random() * 720 - 360;
            const rad    = angle * Math.PI / 180;
            const vx     = Math.cos(rad) * speed;
            const vy     = Math.sin(rad) * speed;

            Object.assign(el.style, {
                position:        'fixed',
                left:            cx + 'px',
                top:             cy + 'px',
                width:           size + 'px',
                height:          shape === 'rect' ? (size * 0.4) + 'px' : size + 'px',
                background:      color,
                borderRadius:    shape === 'circle' ? '50%' : '2px',
                pointerEvents:   'none',
                zIndex:          99999,
                transform:       'translate(-50%,-50%)',
                opacity:         '1',
                transition:      'none',
            });
            document.body.appendChild(el);

            const duration = 900 + Math.random() * 700;
            const start    = performance.now();

            (function animate(ts) {
                const t  = (ts - start) / duration;
                if (t >= 1) { el.remove(); return; }
                const x  = cx + vx * t;
                const y  = cy + vy * t + 300 * t * t; // gravity
                el.style.left      = x + 'px';
                el.style.top       = y + 'px';
                el.style.opacity   = String(1 - t);
                el.style.transform = `translate(-50%,-50%) rotate(${rotate * t}deg)`;
                requestAnimationFrame(animate);
            })(start);
        }
    }

    // ── Spooky birthday party ────────────────────────────────────
    function spookyBirthdayParty(isActualBirthday) {
        const now = new Date();
        const hadBirthday = (now.getMonth() > 9) || (now.getMonth() === 9 && now.getDate() >= 29);
        const age = (now.getFullYear() - 1995) - (hadBirthday ? 0 : 1);

        // Rain emojis down the screen
        const SPOOKS = ['🎃','👻','🕷️','🦇','💀','🕸️','🔮','🎂','🕯️','🍬'];
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.textContent = SPOOKS[Math.floor(Math.random() * SPOOKS.length)];
                const startX = Math.random() * window.innerWidth;
                Object.assign(el.style, {
                    position:      'fixed',
                    left:          startX + 'px',
                    top:           '-3rem',
                    fontSize:      (1.5 + Math.random() * 2) + 'rem',
                    pointerEvents: 'none',
                    zIndex:        99999,
                    opacity:       '1',
                    transition:    'none',
                    userSelect:    'none',
                });
                document.body.appendChild(el);
                const duration = 2200 + Math.random() * 2000;
                const drift    = (Math.random() - 0.5) * 120;
                const start    = performance.now();
                const rot      = (Math.random() - 0.5) * 360;
                (function animate(ts) {
                    const t = (ts - start) / duration;
                    if (t >= 1) { el.remove(); return; }
                    el.style.top       = (-48 + t * (window.innerHeight + 100)) + 'px';
                    el.style.left      = (startX + drift * t) + 'px';
                    el.style.transform = `rotate(${rot * t}deg)`;
                    el.style.opacity   = t > 0.8 ? String(1 - (t - 0.8) / 0.2) : '1';
                    requestAnimationFrame(animate);
                })(start);
            }, i * 80);
        }

        // Confetti bursts
        spawnConfetti(120, COLORS_SPOOKY, 360);
        setTimeout(() => spawnConfetti(100, COLORS_SPOOKY, 360), 400);

        // Big birthday message — different text depending on context
        const badge = document.createElement('div');
        badge.innerHTML = isActualBirthday
            ? `👻 Happy Birthday Jack! 🎃<br><span style="font-size:1.1rem;font-weight:600;">Turning ${age} looks good on you</span>`
            : `you flipped my age! 🎃<br><span style="font-size:1.1rem;font-weight:600;">F*ck, I'm ${age}...</span>`;
        Object.assign(badge.style, {
            position:   'fixed', top: '50%', left: '50%',
            transform:  'translate(-50%,-50%) scale(0)',
            background: 'linear-gradient(135deg,#1a0030,#3d0066)',
            border:     '3px solid #ff6600',
            color:      '#ff6600', fontWeight: '800', fontSize: '1.8rem',
            textAlign:  'center', lineHeight: '1.5',
            padding:    '1.5rem 3rem', borderRadius: '1rem',
            boxShadow:  '0 0 60px #9b30ff, 0 0 120px #ff6600aa',
            zIndex:     100000, pointerEvents: 'none',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        });
        document.body.appendChild(badge);
        requestAnimationFrame(() => requestAnimationFrame(() =>
            badge.style.transform = 'translate(-50%,-50%) scale(1)'
        ));
        setTimeout(() => {
            badge.style.transition = 'opacity 0.6s';
            badge.style.opacity    = '0';
            setTimeout(() => badge.remove(), 600);
        }, 3500);
    }

    const _now = new Date();
    const _hadBirthday = (_now.getMonth() > 9) || (_now.getMonth() === 9 && _now.getDate() >= 29);
    const AGE = (_now.getFullYear() - 1995) - (_hadBirthday ? 0 : 1);

    function milestone(n) {
        if (n === 100) {
            spawnConfetti(200, COLORS_MEGA, 360);
            setTimeout(() => spawnConfetti(150, COLORS_MEGA, 360), 200);
            setTimeout(() => spawnConfetti(100, COLORS_MEGA, 360), 450);
            const badge = document.createElement('div');
            badge.textContent = '100 flips 🤙';
            Object.assign(badge.style, {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%) scale(0)',
                background: 'linear-gradient(135deg,#ffd700,#ff69b4)',
                color: '#000', fontWeight: '800', fontSize: '2.5rem',
                padding: '1rem 2.5rem', borderRadius: '1rem',
                boxShadow: '0 0 60px #ffd700', zIndex: 100000,
                pointerEvents: 'none', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            });
            document.body.appendChild(badge);
            requestAnimationFrame(() => requestAnimationFrame(() => badge.style.transform = 'translate(-50%,-50%) scale(1)'));
            setTimeout(() => {
                badge.style.transition = 'opacity 0.5s';
                badge.style.opacity = '0';
                setTimeout(() => badge.remove(), 500);
            }, 2200);
        } else if (n === AGE) {
            // 🎂 age-th flip — spooky birthday party every year
            spookyBirthdayParty(false);
        } else if (n === 10) {
            // 🎊 10th flip — moderate pop
            spawnConfetti(80, COLORS_NORMAL, 220);
        }
    }

    // ── Coin flip ───────────────────────────────────────────────
    function coinFlip() {
        if (flipping) return;
        flipping = true;

        img.classList.remove('flip-in');
        img.classList.add('flip-out');

        img.addEventListener('animationend', function onOut(e) {
            if (e.animationName !== 'coin-flip-out') return;
            img.removeEventListener('animationend', onOut);

            img.classList.remove('flip-out');
            img.classList.add('flip-in');

            img.addEventListener('animationend', function onIn(e) {
                if (e.animationName !== 'coin-flip-in') return;
                img.removeEventListener('animationend', onIn);
                img.classList.remove('flip-in');
                flipping = false;
                flipCount++;
                milestone(flipCount);
            });
        });
    }

    // Play on load
    window.addEventListener('load', () => {
        setTimeout(coinFlip, 600);

        // Birthday time!
        const now = new Date();
        if ( now.getDate() === 29 && now.getMonth() === 9) { // 29/10
            setTimeout(() => spookyBirthdayParty(true), 1400);
        }
    });

    // Replay on click or hover
    img.addEventListener('click', coinFlip);
    img.addEventListener('mouseenter', coinFlip);
    img.style.cursor = 'pointer';
})();

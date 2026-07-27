/**
 * projects.js — Shared project card renderer
 *
 * Reads /app/100-days-of-code/projects.json and renders cards into a target element.
 *
 * Usage:
 *   renderProjects('projects-grid', 'homepage');   // top 3 by weight, date-ordered
 *   renderProjects('projects-grid', 'projects');   // all projects, date-ordered
 *
 * JSON fields:
 *   "weight"        : <int>    — priority; higher = kept when over limit
 *   "dateCompleted" : <string> — ISO date; determines display order
 */

function getProjectBaseUrl() {
    const currentScript = document.currentScript ||
        Array.from(document.scripts).find(script =>
            script.src && script.src.includes('/JS/projects.js')
        );

    if (currentScript && currentScript.src) {
        return new URL('../', currentScript.src);
    }

    const baseHref = document.querySelector('base')?.getAttribute('href');
    if (baseHref) {
        return new URL(baseHref, window.location.href);
    }

    return new URL('./', window.location.href);
}

const PROJECTS_JSON = new URL('app/100-days-of-code/projects.json', getProjectBaseUrl()).toString();

async function loadProjectsData() {
    if (window._projectsCache) return window._projectsCache;
    const res = await fetch(PROJECTS_JSON);
    if (!res.ok) throw new Error('Failed to load projects.json');
    window._projectsCache = await res.json();
    return window._projectsCache;
}

/**
 * Render project cards into a container element.
 * @param {string} containerId  - ID of the target element
 * @param {'homepage'|'projects'} mode - rendering style
 * @param {number} [limit]      - max cards (default: 3 for homepage, unlimited for projects)
 */
async function renderProjects(containerId, mode, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;padding:2rem;">Loading projects...</p>';

    let projects;
    try {
        projects = await loadProjectsData();
    } catch (e) {
        container.innerHTML = '<p style="color:var(--color-danger);text-align:center;">Could not load projects.</p>';
        return;
    }

    const maxCards = limit !== undefined ? limit : (mode === 'homepage' ? 3 : Infinity);

    // Sort by dateCompleted ascending; undated entries go to end
    let sorted = [...projects].sort((a, b) => {
        if (!a.dateCompleted && !b.dateCompleted) return 0;
        if (!a.dateCompleted) return 1;
        if (!b.dateCompleted) return -1;
        return new Date(a.dateCompleted) - new Date(b.dateCompleted);
    });

    // Drop lowest-weight entries until at or under limit.
    // Among ties on minimum weight, drop the first (earliest date) occurrence.
    while (isFinite(maxCards) && sorted.length > maxCards) {
        const minWeight = Math.min(...sorted.map(p => p.weight ?? 0));
        const dropIdx = sorted.findIndex(p => (p.weight ?? 0) === minWeight);
        if (dropIdx === -1) break;
        sorted.splice(dropIdx, 1);
    }

    const toRender = sorted;

    if (toRender.length === 0) {
        container.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;">No projects found.</p>';
        return;
    }

    container.innerHTML = toRender.map((p, i) =>
        mode === 'homepage'
            ? buildHomepageCard(p, i)
            : buildProjectsCard(p, i)
    ).join('');
}

// ─── Card templates ────────────────────────────────────────────────────────────

function buildHomepageCard(p, i) {
    const tags = (p.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');
    const wipBadge = p.isWIP
        ? `<span class="tag" style="background:rgba(245,158,11,0.15);color:#f59e0b;border-color:#f59e0b;">🚧 WIP</span>`
        : '';
    const imageInner = p.image
        ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;border-radius:inherit;"
               onerror="this.closest('.project-image').innerHTML='<span style=\\'font-size:3rem;\\'>${p.fallbackIcon || '💻'}</span>'">`
        : `<span style="font-size:3.5rem;">${p.fallbackIcon || '💻'}</span>`;
    const imageStyle = p.image
        ? ``
        : `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center;`;

    return `
        <div class="project-card" style="animation-delay:${i * 0.1}s">
            <div class="project-image" style="${imageStyle}">
                ${imageInner}
            </div>
            <div class="project-content">
                <h3 class="project-title">${p.name}</h3>
                <p class="project-description">${p.description}</p>
                <div class="project-tags">
                    ${tags}${wipBadge}
                </div>
                <a href="${p.link}" class="project-link" ${p.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    View Project <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>`;
}

function buildProjectsCard(p, i) {
    const tags = (p.tags || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
    const wipBadge = p.isWIP
        ? `<span class="tech-tag" style="border-color:#f59e0b;color:#f59e0b;">🚧 WIP</span>`
        : '';

    return `
        <div class="project-card" style="animation-delay:${i * 0.1}s">
            <div class="project-icon">
                ${p.image
                    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                           onerror="this.outerHTML='<span style=\\'font-size:1.75rem;\\'>${p.fallbackIcon || '💻'}</span>'">`
                    : `<span style="font-size:1.75rem;">${p.fallbackIcon || '💻'}</span>`
                }
            </div>
            <h3 class="project-title">${p.name}</h3>
            <p class="project-description">${p.description}</p>
            <div class="tech-stack">
                ${tags}${wipBadge}
            </div>
            <a href="${p.link}" class="project-link" ${p.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                View Project <i class="fas fa-arrow-right"></i>
            </a>
        </div>`;
}

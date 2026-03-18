const SUPABASE_URL = 'https://xmypzthknaapmyyvhsyu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteXB6dGhrbmFhcG15eXZoc3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODI1NDMsImV4cCI6MjA4NzY1ODU0M30.xNZQ_A5SniCIRhhMBD2a32D7SJ4JQK7lHiZ8qYSyVpw';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        // Calculate position minus the height of your sticky nav (approx 80px)
        const navHeight = document.querySelector('nav').offsetHeight || 80;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Update Nav Highlight immediately on click
    updateNavHighlight(sectionId);
}

// Separate function to handle the highlight logic
function updateNavHighlight(sectionId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active-nav'));

    const activeLink = document.getElementById('nav-' + sectionId);
    if (activeLink) {
        activeLink.classList.add('active-nav');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('contactSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
    }
}

async function getProjects() {
    const container = document.getElementById('project-list');
    if (!container) return; 
    
    const { data, error } = await _supabase.from('projects').select('*');
    
    if (error) {
        container.innerHTML = `<p>Error loading projects. Check console.</p>`;
        console.error(error);
        return;
    }

    container.innerHTML = ''; 
    data.forEach(p => {
        container.innerHTML += `
            <div class="project-card">
                <div class="project-img-container">
                    <img src="${p.image_url}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Project+Screenshot'">
                </div>
                <div class="project-content">
                    <h3 style="font-weight: 800; margin-bottom: 10px;">${p.title}</h3>
                    <p style="font-size: 0.9rem; line-height: 1.4;">${p.description}</p>
                    <a href="${p.link}" target="_blank" class="view-project-btn">View Code</a>
                </div>
            </div>`;
    });
}

// --- NEW: AUTO-HIGHLIGHT ON SCROLL ---
window.addEventListener('scroll', () => {
    let current = "";
    const sections = document.querySelectorAll('.page-section');
    const navHeight = document.querySelector('nav').offsetHeight || 80;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 10) {
            current = section.getAttribute("id");
        }
    });

    if (current) {
        updateNavHighlight(current);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // We don't call showSection('home') here because it will force a scroll to top on refresh
    updateNavHighlight('home'); 
    getProjects();
    initScrollAnimations();
});

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden-el');
    hiddenElements.forEach(el => observer.observe(el));
}
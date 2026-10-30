// ===========================
// Particle Background
// ===========================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
    }
}

const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 30 : 80;
const particles = Array.from({ length: particleCount }, () => new Particle());
const connectDistance = isMobile ? 80 : 120;

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectDistance) {
                const opacity = (1 - distance / connectDistance) * 0.08;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===========================
// Cursor Glow
// ===========================
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(updateCursorGlow);
}
updateCursorGlow();

// ===========================
// Rotating Title
// ===========================
const titles = ['Backend Developer', 'Software Engineer', 'Full Stack Developer', 'API Architect', 'Problem Solver'];
let titleIndex = 0;
const rotatingTitle = document.getElementById('rotatingTitle');

function rotateTitle() {
    rotatingTitle.style.opacity = 0;
    rotatingTitle.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        rotatingTitle.textContent = titles[titleIndex];
        rotatingTitle.style.opacity = 1;
        rotatingTitle.style.transform = 'translateY(0)';
    }, 300);
}

setInterval(rotateTitle, 3000);
rotatingTitle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

// ===========================
// Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===========================
// Navbar Scroll Effect
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================
// Mobile Nav Toggle
// ===========================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.inert = window.matchMedia('(max-width: 768px)').matches;
}

function openNav() {
    navToggle.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-expanded', 'true');
    navLinks.inert = false;
    navLinks.querySelector('.nav-link').focus();
}

navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        closeNav();
    } else {
        openNav();
    }
});

navOverlay.addEventListener('click', closeNav);

document.addEventListener('keydown', (event) => {
    if (!navLinks.classList.contains('active')) return;
    if (event.key === 'Escape') {
        closeNav();
        navToggle.focus();
    }
    if (event.key === 'Tab') {
        const firstLink = navLinks.querySelector('.nav-link');
        if (event.shiftKey && document.activeElement === firstLink) {
            event.preventDefault();
            navToggle.focus();
        } else if (!event.shiftKey && document.activeElement === navToggle) {
            event.preventDefault();
            firstLink.focus();
        }
    }
});

window.matchMedia('(max-width: 768px)').addEventListener('change', closeNav);
closeNav();

// Close mobile nav when clicking a link
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
});

// ===========================
// Active Nav Link on Scroll
// ===========================
const sections = document.querySelectorAll('.section, .hero');
const navLinksAll = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===========================
// Counter Animation
// ===========================
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);

                    entry.target.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

animateCounters();

// ===========================
// Smooth Scroll for Anchors
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Skill Tag Hover Effects
// ===========================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        const level = this.getAttribute('data-level');
        this.style.boxShadow = `0 0 15px rgba(99, 102, 241, ${level / 300})`;
    });

    tag.addEventListener('mouseleave', function () {
        this.style.boxShadow = 'none';
    });
});

// ===========================
// Page Load Animation
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});


// Keep the decorative request flow under the visitor's control.
const flowToggle = document.getElementById('flowToggle');
flowToggle.addEventListener('click', () => {
    const paused = document.getElementById('backendVisual').classList.toggle('paused');
    flowToggle.setAttribute('aria-pressed', String(paused));
    flowToggle.setAttribute('aria-label', paused ? 'Play backend animation' : 'Pause backend animation');
    flowToggle.querySelector('i').className = paused ? 'fas fa-play' : 'fas fa-pause';
});

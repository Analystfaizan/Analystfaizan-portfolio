
(function () {
    try {
        var saved = localStorage.getItem('portfolio-theme');
        var theme = (saved === 'light' || saved === 'dark') ? saved :
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();


const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Animate skill bars when they scroll into view
const skillRows = document.querySelectorAll('.skill-row');
const skillIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const pct = entry.target.getAttribute('data-pct');
            const fill = entry.target.querySelector('.skill-fill');
            fill.style.width = pct + '%';
            skillIo.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
skillRows.forEach(el => skillIo.observe(el));

const themeBtn = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl = document.documentElement;

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    const isLight = theme === 'light';
    iconSun.style.display = isLight ? 'none' : 'block';
    iconMoon.style.display = isLight ? 'block' : 'none';
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

function getPreferredTheme() {
    try {
        const saved = localStorage.getItem('portfolio-theme');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* storage unavailable, fall back below */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

let currentTheme = getPreferredTheme();
applyTheme(currentTheme);

themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    try { localStorage.setItem('portfolio-theme', currentTheme); } catch (e) { /* ignore */ }
});

const menuBtn = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});
document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }
});

const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        form.reset();
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }, 900);
});
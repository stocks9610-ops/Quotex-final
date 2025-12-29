// Smooth scrolling for navigation links
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.benefit-card, .plan-card, .faq-item, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// QR Code Upload Functionality
const qrUpload = document.getElementById('qr-upload');
const qrPreview = document.getElementById('qr-preview');

qrUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qrPreview.innerHTML = `<img src="${e.target.result}" alt="QR Code Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        qrPreview.innerHTML = '';
    }
});

// Screenshot Gallery Upload Functionality
const screenshotUpload = document.getElementById('screenshot-upload');
const gallery = document.getElementById('gallery');

screenshotUpload.addEventListener('change', function (e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Mining Screenshot';
                gallery.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing effect for hero headline (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Apply typing effect to hero headline on load
window.addEventListener('load', () => {
    const heroHeadline = document.querySelector('.hero h1');
    if (heroHeadline) {
        const originalText = heroHeadline.textContent;
        typeWriter(heroHeadline, originalText, 50);
    }
});

// Mobile menu toggle
const nav = document.querySelector('nav ul');
const navContainer = document.querySelector('nav');
let menuToggle = document.querySelector('.menu-btn');

// Create button if it doesn't exist (it should exist in HTML ideally, but we'll add it if missing)
if (!menuToggle) {
    menuToggle = document.createElement('div');
    menuToggle.className = 'menu-btn';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // FontAwesome icon
    // If FontAwesome isn't loaded, fallback to text
    if (!document.querySelector('link[href*="font-awesome"]')) {
        menuToggle.innerHTML = '☰';
    }
    navContainer.appendChild(menuToggle);
}

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    // Toggle icon
    if (nav.classList.contains('active')) {
        menuToggle.innerHTML = '✕';
    } else {
        menuToggle.innerHTML = '☰';
    }
});

// Close menu when clicking a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.innerHTML = '☰';
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('active');
        menuToggle.innerHTML = '☰';
    }
});

// Add some crypto-themed particle effect (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random();
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        hero.appendChild(particle);
    }
}

createParticles();

// CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
    }
`;
document.head.appendChild(style);

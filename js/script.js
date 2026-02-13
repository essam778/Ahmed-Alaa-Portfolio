/**
 * ========================================
 * AHMED ALAA PORTFOLIO - MAIN JAVASCRIPT
 * ========================================
 * Professional kickboxing coach and personal trainer portfolio website
 * with advanced animations, interactive components, and responsive design.
 */

// Global Variables and Configuration
const CONFIG = {
    animationDuration: 250,
    staggerDelay: 50,
    scrollOffset: 50,
    particleCount: 50,
    colors: {
        crimson: '#dc2626',
        charcoal: '#1a1a1a',
        white: '#ffffff'
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeScrollAnimations();
    initializeTypedText();
    initializeParticleSystem();
    initializeCertificationFilter();
    initializeSkillsChart();
    initializeContactForm();
    initializeSplittingText();
    initializeTimelineInteractions();
    initializeMobileMenu();

    // Initialize Language Manager
    window.languageManager = new LanguageManager();
});

/**
 * ========================================
 * NAVIGATION FUNCTIONALITY
 * ========================================
 */

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Initial call
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.classList.remove('text-white');
                link.classList.add('text-gray-300');
            });

            // Add active class to current link
            const currentLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
                currentLink.classList.add('text-white');
                currentLink.classList.remove('text-gray-300');
            }
        }
    });
}

/**
 * ========================================
 * SCROLL ANIMATIONS
 * ========================================
 */

function initializeScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                // Remove class when element goes out of view
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal elements
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Staggered animation for certification cards
    observeCertificationCards();
}

function observeCertificationCards() {
    const certificationCards = document.querySelectorAll('.certification-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * CONFIG.staggerDelay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    certificationCards.forEach(card => {
        cardObserver.observe(card);
    });
}

/**
 * ========================================
 * TYPED TEXT ANIMATION
 * ========================================
 */

let typedInstance = null;

function initializeTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;

    if (typedInstance) {
        typedInstance.destroy();
    }

    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const strings = translations[currentLang].typed_strings;

    typedInstance = new Typed('#typed-text', {
        strings: strings,
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
        bindInputFocusEvents: true,
        contentType: 'html'
    });
}

/**
 * ========================================
 * PARTICLE SYSTEM
 * ========================================
 */

function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    // Create canvas element for particles
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    canvas.appendChild(particleCanvas);

    const ctx = particleCanvas.getContext('2d');
    const particles = [];

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = CONFIG.colors.crimson;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particleCanvas.height;
            if (this.y > particleCanvas.height) this.y = 0;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections between nearby particles
        drawConnections();

        requestAnimationFrame(animateParticles);
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.strokeStyle = CONFIG.colors.crimson;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });

    // Start animation
    animateParticles();
}

/**
 * ========================================
 * CERTIFICATION FILTER SYSTEM
 * ========================================
 */

function initializeCertificationFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificationCards = document.querySelectorAll('.certification-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('border-gray-600', 'text-gray-300');
                btn.classList.remove('border-vibrant-crimson', 'text-vibrant-crimson');
            });

            this.classList.add('active');
            this.classList.remove('border-gray-600', 'text-gray-300');
            this.classList.add('border-vibrant-crimson', 'text-vibrant-crimson');

            // Filter cards with animation
            filterCertifications(filter, certificationCards);
        });
    });
}

function filterCertifications(filter, cards) {
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        // Animate out
        anime({
            targets: card,
            opacity: 0,
            scale: 0.8,
            duration: 200,
            delay: index * 20,
            easing: 'easeInQuad',
            complete: function () {
                // Hide/show card
                card.style.display = shouldShow ? 'block' : 'none';

                // Animate in if showing
                if (shouldShow) {
                    anime({
                        targets: card,
                        opacity: 1,
                        scale: 1,
                        duration: 300,
                        delay: index * 30,
                        easing: 'easeOutBack'
                    });
                }
            }
        });
    });
}

/**
 * ========================================
 * SKILLS RADAR CHART
 * ========================================
 */

function initializeSkillsChart() {
    const chartContainer = document.getElementById('skills-chart');
    if (!chartContainer) return;

    const chart = echarts.init(chartContainer);

    const option = {
        backgroundColor: 'transparent',
        radar: {
            indicator: [
                { name: 'Kickboxing', max: 100 },
                { name: 'Personal Training', max: 100 },
                { name: 'Sports Rehabilitation', max: 100 },
                { name: 'First Aid', max: 100 },
                { name: 'Diving Instruction', max: 100 },
                { name: 'Fitness Assessment', max: 100 }
            ],
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#6b7280',
                fontSize: 12,
                fontFamily: 'Inter'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(107, 114, 128, 0.3)'
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(107, 114, 128, 0.3)'
                }
            }
        },
        series: [{
            name: 'Skills',
            type: 'radar',
            data: [{
                value: [95, 90, 85, 88, 80, 92],
                name: 'Professional Skills',
                areaStyle: {
                    color: 'rgba(220, 38, 38, 0.2)'
                },
                lineStyle: {
                    color: '#dc2626',
                    width: 2
                },
                itemStyle: {
                    color: '#dc2626',
                    borderColor: '#ffffff',
                    borderWidth: 2
                }
            }],
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        }]
    };

    chart.setOption(option);

    // Animate chart on scroll
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chart.setOption(option, true);
            }
        });
    }, { threshold: 0.5 });

    chartObserver.observe(chartContainer);

    // Handle window resize
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

/**
 * ========================================
 * CONTACT FORM FUNCTIONALITY
 * ========================================
 */

function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Validate form
        if (validateContactForm(data)) {
            // Show loading state
            showFormLoading();

            // Simulate form submission
            setTimeout(() => {
                showFormSuccess();
                this.reset();
            }, 2000);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateContactForm(data) {
    const errors = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }

    // Phone validation (optional but if provided, should be valid)
    if (data.phone && data.phone.trim().length > 0) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            errors.push('Please enter a valid phone number');
        }
    }

    // Service selection validation
    if (!data.service) {
        errors.push('Please select a service type');
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    return errors.length === 0;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.type) {
        case 'text':
            if (field.name === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email';
            }
            break;

        case 'tel':
            if (value.length > 0) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            break;

        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;

        case 'select-one':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select an option';
            }
            break;
    }

    // Update field styling
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        field.style.borderColor = '#10b981'; // Success green
    } else {
        field.classList.add('error');
        field.classList.remove('valid');
        field.style.borderColor = '#ef4444'; // Error red
    }

    return isValid;
}

function showFormLoading() {
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
}

function showFormSuccess() {
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    submitBtn.innerHTML = 'Message Sent Successfully!';
    submitBtn.style.background = '#10b981';

    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.style.background = '';
    }, 3000);

    // Show success message
    showNotification('Message sent successfully! I will get back to you soon.', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
        }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
    });

    // Remove after 5 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: 300,
            opacity: 0,
            duration: 300,
            easing: 'easeInBack',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 5000);
}

/**
 * ========================================
 * TEXT SPLITTING ANIMATIONS
 * ========================================
 */

function initializeSplittingText() {
    // Initialize Splitting.js for text animations
    if (typeof Splitting !== 'undefined') {
        Splitting({
            target: '[data-splitting]',
            by: 'chars'
        });

        // Animate split text on scroll
        const splitTexts = document.querySelectorAll('[data-splitting]');
        const splitObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chars = entry.target.querySelectorAll('.char');
                    anime({
                        targets: chars,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        delay: anime.stagger(50),
                        easing: 'easeOutExpo'
                    });
                }
            });
        }, { threshold: 0.5 });

        splitTexts.forEach(text => {
            splitObserver.observe(text);
        });
    }
}

/**
 * ========================================
 * TIMELINE INTERACTIONS
 * ========================================
 */

function initializeTimelineInteractions() {
    const timelineNodes = document.querySelectorAll('.timeline-node');

    timelineNodes.forEach((node, index) => {
        node.addEventListener('click', function () {
            // Highlight corresponding timeline card
            const cards = document.querySelectorAll('.timeline-card');
            const targetCard = cards[index];

            if (targetCard) {
                // Scroll to card
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Add highlight effect
                targetCard.style.borderColor = CONFIG.colors.crimson;
                targetCard.style.boxShadow = '0 20px 40px rgba(220, 38, 38, 0.3)';

                // Remove highlight after 2 seconds
                setTimeout(() => {
                    targetCard.style.borderColor = '';
                    targetCard.style.boxShadow = '';
                }, 2000);
            }
        });
    });
}

/**
 * ========================================
 * MOBILE MENU FUNCTIONALITY
 * ========================================
 */

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');

            // Animate menu items
            if (!mobileMenu.classList.contains('hidden')) {
                const menuItems = mobileMenu.querySelectorAll('a');
                anime({
                    targets: menuItems,
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    duration: 300,
                    delay: anime.stagger(100),
                    easing: 'easeOutExpo'
                });
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * ========================================
 * THEME AND LANGUAGE MANAGERS
 * ========================================
 */


class LanguageManager {
    constructor() {
        this.langToggle = document.getElementById('lang-toggle');
        this.langToggleMobile = document.getElementById('lang-toggle-mobile');
        this.langToggleHeader = document.getElementById('lang-toggle-header');
        this.currentLang = localStorage.getItem('selectedLanguage') || 'en';

        this.init();
    }

    init() {
        this.applyLanguage(this.currentLang);

        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        if (this.langToggleMobile) {
            this.langToggleMobile.addEventListener('click', () => this.toggleLanguage());
        }
        if (this.langToggleHeader) {
            this.langToggleHeader.addEventListener('click', () => this.toggleLanguage());
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.applyLanguage(this.currentLang);
        localStorage.setItem('selectedLanguage', this.currentLang);
    }

    applyLanguage(lang) {
        const isRTL = lang === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Update language toggle text
        const toggleTexts = [this.langToggle, this.langToggleMobile, this.langToggleHeader];
        toggleTexts.forEach(btn => {
            if (btn) {
                const span = btn.querySelector('span');
                if (span) span.textContent = lang === 'en' ? 'AR' : 'EN';
            }
        });

        // Update all elements with data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Special handling for Typed.js
        if (typeof initializeTypedText === 'function') {
            initializeTypedText();
        }

        // Special handling for ECharts (if initialized)
        this.updateCharts(lang);
    }

    updateCharts(lang) {
        const chartContainer = document.getElementById('skills-chart');
        if (chartContainer && echarts) {
            const chart = echarts.getInstanceByDom(chartContainer);
            if (chart) {
                const indicator = lang === 'ar' ? [
                    { name: 'كيك بوكسينج', max: 100 },
                    { name: 'تدريب شخصي', max: 100 },
                    { name: 'تأهيل رياضي', max: 100 },
                    { name: 'إسعافات أولية', max: 100 },
                    { name: 'تعليم الغوص', max: 100 },
                    { name: 'تقييم اللياقة', max: 100 }
                ] : [
                    { name: 'Kickboxing', max: 100 },
                    { name: 'Personal Training', max: 100 },
                    { name: 'Sports Rehabilitation', max: 100 },
                    { name: 'First Aid', max: 100 },
                    { name: 'Diving Instruction', max: 100 },
                    { name: 'Fitness Assessment', max: 100 }
                ];

                chart.setOption({
                    radar: { indicator: indicator }
                });
            }
        }
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Get current scroll position
function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

// Check if element is in viewport
function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * (1 + threshold) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) * (1 + threshold)
    );
}

// Format date for display
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Animate counter numbers
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * ========================================
 * PERFORMANCE OPTIMIZATIONS
 * ========================================
 */

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'images/hero-portrait.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
preloadCriticalResources();

/**
 * ========================================
 * ERROR HANDLING
 * ======================================== */

// Global error handler
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service
});

// Handle missing elements gracefully
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
    return element;
}

// Handle missing libraries
function checkLibraryAvailability(libraryName, callback) {
    if (typeof window[libraryName] !== 'undefined') {
        callback();
    } else {
        console.warn(`${libraryName} library not loaded. Some features may not work.`);
    }
}
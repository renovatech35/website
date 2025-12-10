// SPA Routing Logic
function handleRouting() {
    const hash = window.location.hash;
    const homePage = document.getElementById('page-home');
    
    // List of policy page IDs
    const policyPages = ['page-privacy', 'page-terms', 'page-environmental', 'page-datadestruction'];
    
    // Check if current hash matches a policy page
    // hash format: #privacy -> page-privacy
    const targetId = 'page-' + hash.replace('#', '');
    const isPolicy = policyPages.includes(targetId);

    if (isPolicy) {
        // Hide Home, Show Target Policy
        homePage.classList.add('hidden');
        policyPages.forEach(id => {
            const el = document.getElementById(id);
            if (id === targetId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
        window.scrollTo(0, 0);
    } else {
        // Default: Show Home, Hide all Policies
        homePage.classList.remove('hidden');
        policyPages.forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        
        // If hash exists (e.g. #contact) but isn't a policy page, let browser handle scroll
        // We might need to re-trigger scroll if content was just un-hidden
        if(hash && hash !== '#home') {
            const targetEl = document.querySelector(hash);
            if(targetEl) {
                setTimeout(() => targetEl.scrollIntoView(), 0);
            }
        }
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleRouting);

// Handle initial load
window.addEventListener('load', handleRouting);

// Mobile Menu Toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

// submit form via Formspree
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    status.textContent = "Sending...";
    status.className = "text-sm text-slate-500";

    const formData = new FormData(form);

    try {
        const response = await fetch("https://formspree.io/f/mpweypvn", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            status.textContent = "Thank you! Your request has been sent.";
            status.className = "text-sm text-green-600 font-semibold";
            form.reset();
        } else {
            status.textContent = "Something went wrong. Please try again.";
            status.className = "text-sm text-red-600 font-semibold";
        }
    } catch (error) {
        status.textContent = "Network error. Please try again later.";
        status.className = "text-sm text-red-600 font-semibold";
    }
});

/* Hero slider: load images from images/slides/ and auto-rotate.
   Behavior:
   - If images/slides/index.json exists and contains an array of filenames, use that.
   - Otherwise, try sequential filenames: slide1.jpg, slide2.jpg, ... up to slide12 with common extensions.
   - If no images found, leave existing hero background intact.
*/
function imageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function initHeroSlider() {
    const sliderEl = document.getElementById('hero-slider');
    if (!sliderEl) return;

    const basePath = 'images/slides/';
    let filenames = [];

    // Strictly rely on index.json only
    try {
        const res = await fetch(basePath + 'index.json');
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length) filenames = data;
        }
    } catch (_) {
        // If fetch fails, do nothing — we will not probe files
        return;
    }

    if (!filenames.length) return; // nothing to do

    // Build slide elements
    const slides = [];
    filenames.forEach((filename, i) => {
        const img = document.createElement('img');
        img.src = basePath + filename;
        img.alt = `Slide ${i + 1}`;
        img.setAttribute('aria-hidden', 'true');
        img.style.pointerEvents = 'none';
        if (i === 0) img.classList.add('active');
        sliderEl.appendChild(img);
        slides.push(img);
    });

    // Create indicators
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'slider-indicators';
    const indicators = [];
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-slide', i);
        if (i === 0) btn.classList.add('active');
        indicatorContainer.appendChild(btn);
        indicators.push(btn);
    });
    sliderEl.appendChild(indicatorContainer);

    // Slider state
    let currentSlide = 0;
    let autoplayTimer = null;

    // Change slide function
    function goToSlide(slideIndex) {
        slides.forEach(img => img.classList.remove('active'));
        indicators.forEach(btn => btn.classList.remove('active'));
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');
        currentSlide = slideIndex;
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 5000);
    }
    function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

    // Indicator click handlers
    indicators.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(index);
            startAutoplay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            goToSlide((currentSlide + 1) % slides.length);
            startAutoplay();
        }
    });

    // Pause on hover
    sliderEl.addEventListener('mouseenter', () => stopAutoplay());
    sliderEl.addEventListener('mouseleave', () => startAutoplay());

    // Start autoplay
    startAutoplay();
}

window.addEventListener('load', initHeroSlider);
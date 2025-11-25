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
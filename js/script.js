// ===== GLOBAL VARIABLES =====
let map;
let marker;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeAnimations();
    initializeSmoothScrolling();
    initializeContactForm();
    
    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.warn('Google Maps not loaded, showing fallback');
        setTimeout(showMapFallback, 1000);
    } else {
        // If Google Maps is already loaded, initialize map
        setTimeout(initMap, 500);
    }
});

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-content, .about-image');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== GOOGLE MAPS =====
async function initMap() {
    console.log('Initializing Google Maps...');
    
    // Cabinet coordinates: 7 rue Coëtlogon, 75006 Paris
    const cabinetLocation = { lat: 48.8475, lng: 2.3322 }; // Approximate coordinates
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    try {
        console.log('Creating Google Maps instance...');
        // Create map
        map = new google.maps.Map(mapElement, {
            zoom: 17,
            center: cabinetLocation,
            styles: getMapStyles(), // Custom theme
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            scrollwheel: false,
            gestureHandling: 'cooperative'
        });
        console.log('Google Maps created successfully');
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showMapFallback();
        return;
    }

    // Create marker using new AdvancedMarkerElement (recommended)
    try {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        
        marker = new AdvancedMarkerElement({
            position: cabinetLocation,
            map: map,
            title: 'Cabinet Emmanuel Lainé - Ostéopathe',
            content: new google.maps.marker.PinElement({
                background: '#000000',
                borderColor: '#ffffff',
                glyph: 'OSTÉO',
                glyphColor: '#000000',
                scale: 1.2
            }).element
        });
    } catch (error) {
        console.log('Using fallback marker...');
        // Fallback to traditional marker
        marker = new google.maps.Marker({
            position: cabinetLocation,
            map: map,
            title: 'Cabinet Emmanuel Lainé - Ostéopathe',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="22" fill="#000000" stroke="#ffffff" stroke-width="3"/>
                        <path d="M25 10 L25 40 M15 25 L35 25" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
                        <text x="25" y="48" text-anchor="middle" fill="#000000" font-family="Arial" font-size="8" font-weight="bold">OSTÉO</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(50, 50),
                anchor: new google.maps.Point(25, 25)
            }
        });
    }

    // Info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 15px; max-width: 250px; font-family: 'Inter', sans-serif;">
                <h5 style="margin: 0 0 8px 0; color: #000; font-weight: 600; font-size: 16px;">Emmanuel Lainé</h5>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;"><i class="fas fa-user-md"></i> Ostéopathe D.O.</p>
                <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                    <i class="fas fa-map-marker-alt" style="color: #000;"></i> 7 rue Coëtlogon<br>75006 Paris
                </p>
                <a href="https://maps.google.com/?q=7+rue+Coëtlogon,+75006+Paris" 
                   target="_blank" 
                   style="display: inline-block; background: #000; color: #fff; padding: 8px 12px; text-decoration: none; border-radius: 4px; font-size: 12px;">
                    <i class="fas fa-directions"></i> Itinéraire
                </a>
            </div>
        `
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });

    // Auto-open info window
    setTimeout(() => {
        infoWindow.open(map, marker);
    }, 1000);
}

// Custom map styles (dark theme)
function getMapStyles() {
    return [
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#cacaca"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e0e0e0"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ];
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initializeContactForm() {
    // Add click-to-call functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking could be added here
            console.log('Phone number clicked:', this.href);
        });
    });

    // Add click-to-email functionality
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking could be added here
            console.log('Email clicked:', this.href);
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ERROR HANDLING =====

// Handle Google Maps API errors
window.gm_authFailure = function() {
    console.error('Google Maps API authentication failed');
    showMapFallback();
};

// Fallback function for when Google Maps fails to load
function showMapFallback() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #666; border-radius: 8px;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #000;"></i>
                    <h5 style="color: #000; margin-bottom: 1rem;">Cabinet Emmanuel Lainé</h5>
                    <p style="margin-bottom: 0.5rem;"><strong>Adresse :</strong></p>
                    <p style="margin-bottom: 1rem;">7 rue Coëtlogon<br>75006 Paris</p>
                    <a href="https://maps.google.com/?q=7+rue+Coëtlogon,+75006+Paris" 
                       target="_blank" 
                       class="btn btn-primary btn-sm">
                        <i class="fas fa-external-link-alt me-2"></i>Voir sur Google Maps
                    </a>
                </div>
            </div>
        `;
    }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    }
});

// Add focus management for better accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #000';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}); 
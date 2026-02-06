// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    if (mobileMenuBtn && mobileNavMenu) {
        // Toggle mobile menu when button is clicked
        mobileMenuBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event from bubbling up
            mobileNavMenu.classList.toggle('active');

            // Rotate menu icon when active
            const menuIconSpans = mobileMenuBtn.querySelectorAll('.menu-icon span');
            if (mobileNavMenu.classList.contains('active')) {
                // Menu is open - transform to X
                menuIconSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                menuIconSpans[1].style.opacity = '0';
                menuIconSpans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                // Menu is closed - reset to hamburger
                menuIconSpans[0].style.transform = 'none';
                menuIconSpans[1].style.opacity = '1';
                menuIconSpans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNavMenu.contains(event.target)) {
                mobileNavMenu.classList.remove('active');

                // Reset menu icon
                const menuIconSpans = mobileMenuBtn.querySelectorAll('.menu-icon span');
                menuIconSpans[0].style.transform = 'none';
                menuIconSpans[1].style.opacity = '1';
                menuIconSpans[2].style.transform = 'none';
            }
        });

        // Ensure menu closes when clicking on any menu item
        const menuItems = document.querySelectorAll('.nav-option');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileNavMenu.classList.remove('active');

                // Reset menu icon
                const menuIconSpans = mobileMenuBtn.querySelectorAll('.menu-icon span');
                menuIconSpans[0].style.transform = 'none';
                menuIconSpans[1].style.opacity = '1';
                menuIconSpans[2].style.transform = 'none';
            });
        });
    }
});

// Swipe Navigation for Mobile Devices
document.addEventListener('DOMContentLoaded', function() {
    // Only enable swipe if navigation is defined for this page
    if (!navConfig) {
        console.log('No swipe navigation defined for this page');
        return;
    }

    // Touch variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Touch start event
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    // Touch move event - add visual feedback
    document.addEventListener('touchmove', function(event) {
        if (touchStartX !== 0) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;

            // Calculate swipe distance
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Only consider horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                event.preventDefault(); // Prevent scrolling during swipe

                // Add visual feedback for swipe
                if (deltaX > 0) {
                    // Swiping right
                    document.body.style.transform = `translateX(${deltaX}px)`;
                } else {
                    // Swiping left
                    document.body.style.transform = `translateX(${deltaX}px)`;
                }
            }
        }
    }, { passive: false });

    // Touch end event - determine swipe direction
    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;

        // Reset visual feedback
        document.body.style.transform = '';

        handleSwipeGesture();
    }, { passive: true });

    // Function to handle swipe gesture
    function handleSwipeGesture() {
        const minSwipeDistance = 50; // Minimum distance for a swipe to be recognized

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        // Check if the swipe is primarily horizontal
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
            if (dx > 0) {
                // Swiped right - go to next page
                if (navConfig.right) {
                    animateAndNavigate(navConfig.right);
                }
            } else {
                // Swiped left - go to previous page
                if (navConfig.left) {
                    animateAndNavigate(navConfig.left);
                }
            }
        }
    }

    // Function to animate and navigate to a new page
    function animateAndNavigate(url) {
        // Add slide animation class
        document.body.classList.add('swipe-transition');

        // Determine direction class based on swipe direction
        const isLeftSwipe = touchEndX < touchStartX;
        const directionClass = isLeftSwipe ? 'swipe-left' : 'swipe-right';

        document.body.classList.add(directionClass);

        // Wait for animation to complete before navigating
        setTimeout(function() {
            window.location.href = url;
        }, 300); // Match the CSS animation duration
    }
});

// Navbar background on scroll with class toggle
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
}, { passive: true });

// Smooth scroll for anchor links
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

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to cards
document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
};

// Observe stats section for counter animation
const statsSection = document.querySelector('.hero-stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animation triggered when stats come into view
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add particle effect to hero (optional enhancement)
function createParticle() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 77, 77, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 4s ease-in-out infinite;
    `;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    heroParticles.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, 4000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-50px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
        }
    }
    
    .hero-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// ===== Active nav link based on current path =====
(function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const here = location.pathname.replace(/\\\\/g,'/');
  links.forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (!href) return;
      const abs = new URL(href, location.href).pathname;
      if (abs === location.pathname) a.classList.add('active-link');
      // Also mark Home when visiting index-style paths
      if ((/index\.html$/.test(abs) && (here.endsWith('/') || /index\.html$/.test(here)))) {
        if (/index\.html$/.test(href)) a.classList.add('active-link');
      }
    } catch (_) {}
  });
})();

// ===== Accordions =====
document.querySelectorAll('.accordion').forEach(ac => {
  ac.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const open = item.classList.toggle('open');
      content.style.maxHeight = open ? content.scrollHeight + 'px' : '0px';
    });
  });
});

// ===== Contact form (basic validation only) =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get('name')||'').toString().trim();
    const email = (data.get('email')||'').toString().trim();
    const message = (data.get('message')||'').toString().trim();
    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message.');
      return;
    }
    contactForm.reset();
    const ok = document.createElement('div');
    ok.className = 'form-success';
    ok.textContent = 'Thanks! Your message has been queued.';
    contactForm.appendChild(ok);
    setTimeout(()=> ok.remove(), 4000);
  });
}

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial, .card, .stat-item');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]:not(.discord-member-count)');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString() + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };
        updateCounter();
    });
}

// Trigger counter when stats section is visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                updateDiscordMemberCount(); // Also update Discord member count when stats come into view
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}


// ===== Preload critical resources =====
if ('connection' in navigator && navigator.connection.saveData === false) {
    const preloadLinks = ['pages/hosting.html', 'pages/panel.html'];
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
}

// ===== Discord Member Count =====
async function updateDiscordMemberCount() {
    try {
        // Using the Discord Invite API to get member count
        const inviteResponse = await fetch('https://discord.com/api/v9/invites/N7rAaNYkAK?with_counts=true&with_expiration=true');
        const inviteData = await inviteResponse.json();

        if (inviteData.guild && inviteData.approximate_member_count !== undefined) {
            const memberCountElements = document.querySelectorAll('.discord-member-count');
            memberCountElements.forEach(element => {
                element.textContent = inviteData.approximate_member_count.toLocaleString();
            });

            // Update live indicator
            const liveIndicators = document.querySelectorAll('.live-indicator');
            liveIndicators.forEach(indicator => {
                indicator.style.display = 'inline';
            });
        }
    } catch (error) {
        console.error('Error fetching Discord member count:', error);
        // Fallback to a static number if API fails
        const memberCountElements = document.querySelectorAll('.discord-member-count');
        memberCountElements.forEach(element => {
            element.textContent = '30'; // Default fallback
        });

        // Hide live indicator if there's an error
        const liveIndicators = document.querySelectorAll('.live-indicator');
        liveIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateDiscordMemberCount);

// Refresh every minute for more real-time feel
setInterval(updateDiscordMemberCount, 60 * 1000); // Every minute instead of 5 minutes

// Add live indicator to the DOM when it loads
document.addEventListener('DOMContentLoaded', () => {
    // Add live indicator to all member count elements
    const memberCountElements = document.querySelectorAll('.discord-member-count');
    memberCountElements.forEach(element => {
        // Check if live indicator already exists to avoid duplicates
        if (!element.parentElement.querySelector('.live-indicator')) {
            const liveIndicator = document.createElement('span');
            liveIndicator.className = 'live-indicator';
            liveIndicator.innerHTML = ' ● Live';
            liveIndicator.style.color = '#00ff88';
            liveIndicator.style.marginLeft = '4px';
            liveIndicator.style.fontSize = '0.8em';
            element.parentElement.appendChild(liveIndicator);
        }
    });
});

// Background Audio Player - Auto Play
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-audio');

    if (audio) {
        // Set volume to a very low level (15%)
        audio.volume = 0.15;

        // Try to play immediately when DOM is loaded
        // This will work in most modern browsers if the audio is short enough
        setTimeout(() => {
            audio.play().then(() => {
                console.log('Background audio started');
            }).catch(e => {
                console.log('Auto-play failed:', e);
                // If immediate play fails, set up to play on first user interaction
                const playOnInteraction = () => {
                    audio.play().then(() => {
                        console.log('Background audio started after user interaction');
                    }).catch(err => console.log('Retry failed:', err));

                    // Remove these event listeners after successful play
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                };

                // Set up to play on first user interaction
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
                document.addEventListener('keydown', playOnInteraction);
            });
        }, 100); // Small delay to ensure audio element is ready
    }
});

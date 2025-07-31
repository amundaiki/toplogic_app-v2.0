// Scroll-baserte animasjoner og advanced micro-interactions
// Bruker Intersection Observer for performance

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupSmoothScroll();
        this.setupInertiaScroll();
    }

    // Intersection Observer for scroll-based animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation delays for child elements
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll(
            '.form-group, .btn, .file-upload-area, .message, .toplogic-content > *'
        );
        
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // Smooth scroll with custom easing
    setupSmoothScroll() {
        // Enhanced smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Parallax fjernet - var for mye

    // Inertia-based scroll with momentum
    setupInertiaScroll() {
        let isScrolling = false;
        let scrollEndTimer = null;

        const addScrollMomentum = () => {
            document.body.classList.add('scrolling');
            isScrolling = true;

            // Clear existing timer
            clearTimeout(scrollEndTimer);

            // Set timer to detect scroll end
            scrollEndTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
                document.body.classList.add('scroll-ending');
                
                setTimeout(() => {
                    document.body.classList.remove('scroll-ending');
                    isScrolling = false;
                }, 150);
            }, 100);
        };

        window.addEventListener('scroll', addScrollMomentum, { passive: true });
    }

    // Advanced micro-interactions
    static setupAdvancedInteractions() {
        // Button ripple effect (subtle)
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Form focus micro-interactions
        document.querySelectorAll('.form-select, .form-input, .form-textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.form-group')?.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.closest('.form-group')?.classList.remove('focused');
            });
        });

        // Subtle file upload drag feedback
        document.querySelectorAll('.file-upload-area').forEach(area => {
            let dragCounter = 0;

            area.addEventListener('dragenter', function(e) {
                e.preventDefault();
                dragCounter++;
                this.classList.add('drag-hover');
            });

            area.addEventListener('dragleave', function(e) {
                e.preventDefault();
                dragCounter--;
                if (dragCounter === 0) {
                    this.classList.remove('drag-hover');
                }
            });

            area.addEventListener('drop', function(e) {
                e.preventDefault();
                dragCounter = 0;
                this.classList.remove('drag-hover');
                this.classList.add('file-dropped');
                
                setTimeout(() => {
                    this.classList.remove('file-dropped');
                }, 1000);
            });
        });
    }

    // Mouse parallax fjernet - var for mye
}

// CSS for scroll animations (inject into page)
const scrollAnimationCSS = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0px);
    }

    .focused {
        transform: scale(1.02);
        box-shadow: 0 0 20px rgba(199, 32, 39, 0.1);
    }

    .drag-hover {
        background: linear-gradient(135deg, rgba(199, 32, 39, 0.1), rgba(199, 32, 39, 0.05));
        border-color: var(--color-red) !important;
        animation: dragPulse 0.8s ease-in-out infinite alternate;
    }

    .file-dropped {
        animation: fileSuccess 0.6s ease-out;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes dragPulse {
        0% { transform: scale(1.02); }
        100% { transform: scale(1.05); }
    }

    @keyframes fileSuccess {
        0% { background: rgba(46, 125, 50, 0.2); }
        100% { background: transparent; }
    }

    /* Smooth scrolling momentum */
    .scrolling {
        scroll-behavior: auto; /* Disable browser smooth scroll during momentum */
    }

    .scroll-ending {
        scroll-behavior: smooth; /* Re-enable for final positioning */
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll {
            transition: none !important;
            opacity: 1;
            transform: none;
        }
    }
`;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = scrollAnimationCSS;
    document.head.appendChild(style);

    // Initialize scroll animations
    new ScrollAnimations();
    ScrollAnimations.setupAdvancedInteractions();
});

export { ScrollAnimations };
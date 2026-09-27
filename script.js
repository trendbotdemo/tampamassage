/* ==========================================================================
   Tampa Massage Hotel - Sleek Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. Hero Canvas Ambient Particle System
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 25), 45);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 1;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.opacity = Math.random() * 0.45 + 0.1;
                this.color = Math.random() > 0.5 ? '#c77dff' : '#9d4edd';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // ----------------------------------------------------------------------
    // 2. Sticky Navbar & Mobile Hamburger Menu
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Active Section Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNavOnScroll);

    // ----------------------------------------------------------------------
    // 3. Intersection Observer for Smooth Scroll Reveal Animations
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 4. Animated Counter Stats
    // ----------------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function startCounterAnimation() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection || counted) return;

        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos - 80) {
            counted = true;
            statNumbers.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 1800;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.innerText = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.ceil(current).toLocaleString();
                    }
                }, stepTime);
            });
        }
    }
    window.addEventListener('scroll', startCounterAnimation);

    // ----------------------------------------------------------------------
    // 5. About Section Interactive Tabs
    // ----------------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.about-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. Service Book Buttons - Auto-select in Reservation Form
    // ----------------------------------------------------------------------
    const serviceBookBtns = document.querySelectorAll('.btn-service-book');
    const serviceSelect = document.getElementById('service-select');

    serviceBookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceName = btn.getAttribute('data-service');
            if (serviceSelect && serviceName) {
                for (let option of serviceSelect.options) {
                    if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || 
                        serviceName.toLowerCase().includes(option.value.toLowerCase())) {
                        option.selected = true;
                        break;
                    }
                }
            }
        });
    });

    // ----------------------------------------------------------------------
    // 7. Booking Form Submission & Toast Notification
    // ----------------------------------------------------------------------
    const bookingForm = document.getElementById('booking-form');
    const toast = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');

    if (bookingForm && toast) {
        // Set minimum date for date picker to today
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;

            // Show Toast Notification
            toastTitle.innerText = `Thank You, ${name}!`;
            toastDesc.innerText = `Your reservation request has been submitted. Our Tampa concierge will call ${phone} shortly.`;
            
            toast.classList.add('show');

            // Reset form
            bookingForm.reset();

            // Hide Toast after 6 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 6000);
        });
    }
});

/**
 * Main JavaScript File
 * 
 * Handles global UI interactions for the portfolio website including:
 * - Theme toggling (Dark/Light mode)
 * - Mobile navigation menu
 * - Scroll animations (IntersectionObserver)
 * - Back to top button logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Set Copyright Year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // Applied theme on initial load
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            if (icon) icon.className = 'fas fa-moon';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // 3. Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');

    if (menuToggle && navMenu && navClose) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // 4. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Smooth Scroll for on-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
            }
        });
    });

    // 6. Animation on Scroll (IntersectionObserver)
    const animatedElements = document.querySelectorAll('.skill-card, .work-card, .hand-drawn-card, .contact-item, .testimonial-card, .post-card, .service-card');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
});
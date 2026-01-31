/**
 * Interactive Article JavaScript
 * Modern UI patterns for engaging reading experience
 */

(function () {
    'use strict';

    // ===== Reading Progress Bar =====
    function initReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ===== Fade-in Sections on Scroll =====
    function initScrollAnimations() {
        // Add fade-in class to major sections
        const sections = document.querySelectorAll('h2, h3, .diagram, .highlight, .warning, .key-point, .edge-case, .code-block, table');
        sections.forEach(section => {
            section.classList.add('fade-in-section');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ===== Active TOC Item Tracking =====
    function initTOCTracking() {
        const tocLinks = document.querySelectorAll('.toc a');
        const headings = [];

        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const heading = document.getElementById(href.slice(1));
                if (heading) {
                    headings.push({ link: link.parentElement, heading });
                }
            }
        });

        if (headings.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const item = headings.find(h => h.heading === entry.target);
                if (item) {
                    if (entry.isIntersecting) {
                        tocLinks.forEach(l => l.parentElement.classList.remove('active'));
                        item.link.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0,
            rootMargin: '-20% 0px -70% 0px'
        });

        headings.forEach(({ heading }) => observer.observe(heading));
    }

    // ===== Expandable Code Blocks =====
    function initExpandableCode() {
        const codeBlocks = document.querySelectorAll('.code-block');

        codeBlocks.forEach(block => {
            // Check if content is taller than max-height
            if (block.scrollHeight > 400) {
                block.classList.add('truncated');

                const btn = document.createElement('button');
                btn.className = 'code-expand-btn';
                btn.textContent = 'Show More';
                btn.onclick = () => {
                    block.classList.toggle('expanded');
                    block.classList.toggle('truncated');
                    btn.textContent = block.classList.contains('expanded') ? 'Show Less' : 'Show More';
                };
                block.appendChild(btn);
            }
        });
    }

    // ===== Back to Top Button =====
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        btn.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
    }

    // ===== Reading Stats Widget =====
    function initReadingStats() {
        const article = document.querySelector('article');
        if (!article) return;

        const text = article.innerText || article.textContent;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / 200); // 200 words per minute

        const stats = document.createElement('div');
        stats.className = 'reading-stats';
        stats.innerHTML = `
            <span><span id="reading-percent">0</span>% read</span>
            <div class="reading-stats-progress">
                <div class="reading-stats-progress-bar" id="reading-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(stats);

        const percentEl = document.getElementById('reading-percent');
        const progressBarEl = document.getElementById('reading-progress-bar');

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = Math.round((window.scrollY / scrollHeight) * 100);

            percentEl.textContent = Math.min(scrolled, 100);
            progressBarEl.style.width = Math.min(scrolled, 100) + '%';

            // Show stats after scrolling a bit
            if (window.scrollY > 300) {
                stats.classList.add('visible');
            } else {
                stats.classList.remove('visible');
            }
        });
    }

    // ===== Copy Code Button =====
    function initCopyCode() {
        const codeBlocks = document.querySelectorAll('.code-block');

        codeBlocks.forEach(block => {
            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';

            btn.onclick = async () => {
                const code = block.querySelector('code');
                const text = code ? code.textContent : block.textContent;

                try {
                    await navigator.clipboard.writeText(text);
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    btn.textContent = 'Failed';
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                    }, 2000);
                }
            };

            block.style.position = 'relative';
            block.appendChild(btn);
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL without jumping
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
    }

    // ===== Keyboard Navigation =====
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Press 't' to scroll to TOC
            if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                const toc = document.querySelector('.toc');
                if (toc && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    toc.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            // Press Home to go to top
            if (e.key === 'Home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Press End to go to bottom
            if (e.key === 'End') {
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
            }
        });
    }

    // ===== Image Lazy Loading with Fade =====
    function initLazyImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            img.onload = () => { img.style.opacity = '1'; };
            imageObserver.observe(img);
        });
    }

    // ===== Initialize All Features =====
    function init() {
        initReadingProgress();
        initScrollAnimations();
        initTOCTracking();
        initExpandableCode();
        initBackToTop();
        initReadingStats();
        initCopyCode();
        initSmoothScroll();
        initKeyboardNav();
        initLazyImages();

        console.log('📖 Article interactive features loaded');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

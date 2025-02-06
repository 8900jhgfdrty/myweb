
class ParallaxEffect {
    constructor() {
        this.sections = document.querySelectorAll('.parallax-section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        }, { passive: true });
    }

    handleScroll() {
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const parallaxBg = section.querySelector('.parallax-bg');

            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const scrolled = window.pageYOffset;
                const speed = 0.5;
                const yPos = (scrolled - rect.top) * speed;
                parallaxBg.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}


class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.drawer = document.getElementById('drawer');
        this.drawerClose = document.getElementById('drawerClose');
        this.drawerOverlay = document.getElementById('drawerOverlay');

        if (this.menuToggle && this.drawer && this.drawerClose && this.drawerOverlay) {
            this.init();
            this.initDrawer();
        }
    }

    init() {

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    initDrawer() {

        this.menuToggle.addEventListener('click', () => {
            this.drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });


        const closeDrawer = () => {
            this.drawer.classList.remove('active');
            document.body.style.overflow = '';
        };

        this.drawerClose.addEventListener('click', closeDrawer);
        this.drawerOverlay.addEventListener('click', closeDrawer);


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.drawer.classList.contains('active')) {
                closeDrawer();
            }
        });


        const drawerLinks = document.querySelectorAll('.drawer__link');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeDrawer();
            });
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.init();
    }

    init() {
        this.checkPosition();
        window.addEventListener('scroll', () => this.checkPosition());
    }

    checkPosition() {
        this.elements.forEach(element => {
            const positionFromTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (positionFromTop - windowHeight <= -100) {
                element.classList.add('visible');
            }
        });
    }
}
class LazyLoader {
    constructor() {
        this.lazyImages = document.querySelectorAll('.lazy-image');
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });

            this.lazyImages.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            this.loadImagesImmediately();
        }
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.src = src;
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }

    loadImagesImmediately() {
        this.lazyImages.forEach(img => this.loadImage(img));
    }
}

class CursorFollow {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-follow';
        document.body.appendChild(this.cursor);
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.cursor.style.borderColor = 'var(--accent-color)';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.style.borderColor = 'var(--accent-color)';
            });
        });
    }
}

class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.innerHTML = '<div class="scroll-progress__bar"></div>';
        document.body.appendChild(this.progressBar);
        this.bar = this.progressBar.querySelector('.scroll-progress__bar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.bar.style.width = scrolled + '%';
        });
    }
}

class TextAnimation {
    constructor() {
        this.textElements = document.querySelectorAll('.animate-text');
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.textElements.forEach(element => {
            this.prepareElement(element);
        });


        this.checkPosition();


        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.checkPosition());
        }, { passive: true });
    }

    prepareElement(element) {
        const text = element.textContent;
        element.textContent = '';


        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transitionProperty = 'opacity, transform';
            span.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
            span.style.transitionDelay = `${index * 0.03}s`;
            element.appendChild(span);
        });
    }

    checkPosition() {
        this.textElements.forEach(element => {
            if (this.animatedElements.has(element)) return;

            const position = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (position.top <= windowHeight * 0.85) {
                const chars = element.querySelectorAll('span');
                chars.forEach(char => {
                    char.style.opacity = '1';
                    char.style.transform = 'translateY(0)';
                });
                this.animatedElements.add(element);
            }
        });
    }
}

class NumberAnimation {
    constructor() {
        this.statItems = document.querySelectorAll('.stat-item');
        this.numbers = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.checkPosition();
        });
    }

    checkPosition() {
        if (this.animated) return;

        const statsSection = document.querySelector('.stats-section');
        const position = statsSection.getBoundingClientRect();

        if (position.top <= window.innerHeight * 0.75) {
            this.animated = true;
            this.animateNumbers();
            this.showItems();
        }
    }

    showItems() {
        this.statItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200);
        });
    }

    animateNumbers() {
        this.numbers.forEach((numberElement, index) => {
            const target = parseInt(numberElement.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    numberElement.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    numberElement.textContent = target;
                }
            };

            setTimeout(() => {
                requestAnimationFrame(updateNumber);
            }, index * 200);
        });
    }
}

class MenuDrawer {
    constructor() {
        this.drawer = document.getElementById('drawer');
        this.overlay = document.getElementById('drawerOverlay');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.closeBtn = document.getElementById('drawerClose');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.open());

        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    close() {
        this.drawer.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
    new Navigation();
    new ScrollAnimations();
    new LazyLoader();
    new CursorFollow();
    new ScrollProgress();
    new TextAnimation();
    new NumberAnimation();
    new MenuDrawer();
    new Navbar();
});



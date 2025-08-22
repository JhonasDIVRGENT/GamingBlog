// ===== GAMING BLOG - MAIN JAVASCRIPT =====
// Autor: Gaming Blog Team
// Versión: 2.0.0

class GamingBlog {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
    }

    // Inicialización
    init() {
        console.log('🎮 Gaming Blog inicializado');
        this.setupTheme();
        this.setupParticles();
        this.setupTypingEffects();
        this.setupScrollEffects();
    }

    // Configurar tema
    setupTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.createThemeToggle();
    }

    // Crear toggle de tema
    createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--gradient-primary);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: var(--shadow-soft);
            transition: all 0.3s ease;
        `;

        themeToggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(themeToggle);
    }

    // Cambiar tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.querySelector('.theme-toggle i');
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Animación de transición
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    // Configurar partículas
    setupParticles() {
        if (window.location.pathname === '/blog') {
            this.createParticles();
        }
    }

    // Crear partículas
    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }

        document.body.appendChild(particleContainer);
    }

    // Crear partícula individual
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            animation: floatParticle ${duration}s linear infinite;
            animation-delay: ${delay}s;
        `;

        container.appendChild(particle);
    }

    // Configurar efectos de escritura
    setupTypingEffects() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.typeWriter(heroTitle, heroTitle.textContent, 100);
        }
    }

    // Efecto de escritura
    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        setTimeout(type, 1000);
    }

    // Configurar efectos de scroll
    setupScrollEffects() {
        this.setupParallax();
        this.setupScrollProgress();
        this.setupScrollAnimations();
    }

    // Efecto parallax
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Barra de progreso de scroll
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-accent);
            z-index: 9999;
            transition: width 0.1s ease;
        `;

        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Animaciones de scroll
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.post-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Configurar animaciones
    setupAnimations() {
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupLoadingAnimations();
    }

    // Efectos hover
    setupHoverEffects() {
        document.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    // Efecto ripple
    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Efectos de click
    setupClickEffects() {
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createClickEffect(e);
            });
        });
    }

    // Efecto de click
    createClickEffect(event) {
        const circle = document.createElement('div');
        circle.className = 'click-effect';
        
        const size = 20;
        const x = event.clientX - size / 2;
        const y = event.clientY - size / 2;
        
        circle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: var(--accent-color);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            animation: clickExpand 0.3s ease-out;
        `;

        document.body.appendChild(circle);
        setTimeout(() => circle.remove(), 300);
    }

    // Animaciones de carga
    setupLoadingAnimations() {
        this.createLoadingStates();
        this.setupSkeletonLoading();
    }

    // Estados de carga
    createLoadingStates() {
        const loadingStates = {
            'createPostForm': {
                loading: 'Publicando...',
                success: '¡Post Creado!',
                error: 'Error al crear'
            }
        };

        Object.entries(loadingStates).forEach(([formId, states]) => {
            const form = document.getElementById(formId);
            if (form) {
                this.setupFormLoading(form, states);
            }
        });
    }

    // Configurar carga de formulario
    setupFormLoading(form, states) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;
        
        form.addEventListener('submit', () => {
            submitBtn.innerHTML = `<span class="loading-spinner me-2"></span>${states.loading}`;
            submitBtn.disabled = true;
        });
    }

    // Skeleton loading
    setupSkeletonLoading() {
        if (document.querySelector('.post-card')) {
            this.createSkeletonCards();
        }
    }

    // Crear tarjetas skeleton
    createSkeletonCards() {
        const skeletonHTML = `
            <div class="skeleton-card">
                <div class="skeleton-title"></div>
                <div class="skeleton-content"></div>
                <div class="skeleton-meta"></div>
            </div>
        `;

        const skeletonStyles = `
            <style>
                .skeleton-card {
                    background: white;
                    border-radius: var(--border-radius);
                    padding: 2rem;
                    margin-bottom: 1rem;
                }
                .skeleton-title {
                    height: 24px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                .skeleton-content {
                    height: 16px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                .skeleton-meta {
                    height: 12px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                    width: 60%;
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', skeletonStyles);
    }

    // Vincular eventos
    bindEvents() {
        this.bindSearchEvents();
        this.bindFormEvents();
        this.bindKeyboardEvents();
        this.bindResizeEvents();
    }

    // Eventos de búsqueda
    bindSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.filterPosts, 300));
            searchInput.addEventListener('focus', this.handleSearchFocus);
            searchInput.addEventListener('blur', this.handleSearchBlur);
        }
    }

    // Eventos de formulario
    bindFormEvents() {
        const createPostForm = document.getElementById('createPostForm');
        if (createPostForm) {
            createPostForm.addEventListener('submit', this.handleCreatePost.bind(this));
        }
    }

    // Eventos de teclado
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }
            
            // Escape para cerrar modales
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) modalInstance.hide();
                });
            }
        });
    }

    // Eventos de resize
    bindResizeEvents() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    // Manejar resize
    handleResize() {
        this.updateParticleCount();
        this.updateAnimations();
    }

    // Actualizar conteo de partículas
    updateParticleCount() {
        const width = window.innerWidth;
        const particleContainer = document.querySelector('.particle-container');
        
        if (particleContainer) {
            const currentCount = particleContainer.children.length;
            const targetCount = width < 768 ? 25 : 50;
            
            if (currentCount !== targetCount) {
                particleContainer.innerHTML = '';
                for (let i = 0; i < targetCount; i++) {
                    this.createParticle(particleContainer);
                }
            }
        }
    }

    // Actualizar animaciones
    updateAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.style.setProperty('--transition-normal', '0.1s ease');
            document.body.style.setProperty('--transition-slow', '0.2s ease');
        } else {
            document.body.style.setProperty('--transition-normal', '0.3s ease');
            document.body.style.setProperty('--transition-slow', '0.5s ease');
        }
    }

    // Funciones de utilidad
    debounce(func, wait) {
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

    // Filtro de posts
    filterPosts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const postItems = document.querySelectorAll('.post-item');
        
        postItems.forEach(item => {
            const title = item.querySelector('.post-title').textContent.toLowerCase();
            const content = item.querySelector('.post-content').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Manejar foco de búsqueda
    handleSearchFocus() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.2)';
    }

    // Manejar blur de búsqueda
    handleSearchBlur() {
        this.style.transform = '';
        this.style.boxShadow = '';
    }

    // Manejar creación de post
    async handleCreatePost(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = `<span class="loading-spinner me-2"></span>Publicando...`;
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const postData = {
                title: formData.get('postTitle') || document.getElementById('postTitle').value,
                content: formData.get('postContent') || document.getElementById('postContent').value,
                userID: parseInt(formData.get('postUserID') || document.getElementById('postUserID').value, 10) || 1
            };
            
            const response = await fetch('/blog/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear post');
            }
            
            // Éxito
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Post Creado!';
            submitBtn.style.background = 'var(--gradient-success)';
            
            // Cerrar modal y recargar
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
                if (modal) modal.hide();
                location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Error creating post:', error);
            alert('No se pudo crear el post: ' + error.message);
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Gaming Blog
    window.gamingBlog = new GamingBlog();
    
    // Configurar AOS si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768
        });
    }
    
    // Configurar tooltips de Bootstrap si está disponible
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

// ===== FUNCIONES GLOBALES =====
window.scrollToContent = function() {
    document.querySelector('.main-content').scrollIntoView({
        behavior: 'smooth'
    });
};

window.filterPosts = function() {
    if (window.gamingBlog) {
        window.gamingBlog.filterPosts();
    }
};

// ===== ANIMACIONES CSS ADICIONALES =====
const additionalStyles = `
    @keyframes floatParticle {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
        100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes clickExpand {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Insertar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

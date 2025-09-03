// Animations and visual effects for Boston Tracker Demo
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        this.setupCountUpAnimations();
        this.setupTypingEffects();
    }

    setupScrollAnimations() {
        // Observe elements for scroll-triggered animations
        const elementsToAnimate = document.querySelectorAll(
            '.card, .delivery-card, .table tr, .badge, .btn'
        );
        
        elementsToAnimate.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                this.observer.unobserve(entry.target);
            }
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects for cards
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.card:not(.delivery-card)')) {
                const card = e.target.closest('.card');
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = 'translateY(-4px)';
            }
            
            if (e.target.closest('.delivery-card')) {
                const card = e.target.closest('.delivery-card');
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = 'translateY(-3px) scale(1.02)';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.card:not(.delivery-card)')) {
                const card = e.target.closest('.card');
                card.style.transform = 'translateY(0)';
            }
            
            if (e.target.closest('.delivery-card')) {
                const card = e.target.closest('.delivery-card');
                if (!card.classList.contains('active')) {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            }
        }, true);

        // Button hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.btn:not(.btn-close)')) {
                const btn = e.target.closest('.btn');
                btn.style.transition = 'all 0.2s ease';
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.btn:not(.btn-close)')) {
                const btn = e.target.closest('.btn');
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '';
            }
        }, true);
    }

    setupLoadingAnimations() {
        // Create skeleton loading for tables
        this.createSkeletonRows();
        
        // Simulate progressive loading
        setTimeout(() => {
            this.removeSkeletonRows();
            this.animateTableRows();
        }, 1500);
    }

    createSkeletonRows() {
        const tables = document.querySelectorAll('table tbody');
        
        tables.forEach(tbody => {
            for (let i = 0; i < 3; i++) {
                const row = document.createElement('tr');
                row.className = 'skeleton-row';
                
                const cellCount = tbody.closest('table').querySelector('thead tr').children.length;
                
                for (let j = 0; j < cellCount; j++) {
                    const cell = document.createElement('td');
                    cell.innerHTML = '<div class="skeleton" style="height: 20px; border-radius: 4px;"></div>';
                    row.appendChild(cell);
                }
                
                tbody.appendChild(row);
            }
        });
    }

    removeSkeletonRows() {
        document.querySelectorAll('.skeleton-row').forEach(row => {
            row.remove();
        });
    }

    animateTableRows() {
        const rows = document.querySelectorAll('table tbody tr');
        
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.4s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    setupCountUpAnimations() {
        // Animate numbers counting up
        const numberElements = document.querySelectorAll(
            '#totalUsers, #activeUsers, #adminUsers, #deliveryUsers, #activeCount'
        );
        
        numberElements.forEach(element => {
            this.animateCountUp(element, parseInt(element.textContent) || 0);
        });
    }

    animateCountUp(element, targetNumber) {
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 20);
        const duration = 1000;
        const stepTime = duration / 20;
        
        element.textContent = '0';
        
        const timer = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            
            element.textContent = currentNumber;
        }, stepTime);
    }

    setupTypingEffects() {
        // Add typing effect to brand text
        const brandElement = document.querySelector('.dashboard-brand span');
        if (brandElement) {
            this.typeWriter(brandElement, 'BOSTON', 100);
        }
    }

    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Tab switching animations
    animateTabSwitch(fromTab, toTab) {
        const fromElement = document.getElementById(fromTab);
        const toElement = document.getElementById(toTab);
        
        if (fromElement && toElement) {
            // Slide out current tab
            fromElement.style.transform = 'translateX(-100%)';
            fromElement.style.opacity = '0';
            
            setTimeout(() => {
                // Slide in new tab
                toElement.style.transform = 'translateX(0)';
                toElement.style.opacity = '1';
            }, 150);
        }
    }

    // Loading state animations
    showLoadingState(container) {
        const originalContent = container.innerHTML;
        container.setAttribute('data-original-content', originalContent);
        
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border text-boston-red" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <div class="loading-text">Cargando datos...</div>
            </div>
        `;
    }

    hideLoadingState(container) {
        const originalContent = container.getAttribute('data-original-content');
        if (originalContent) {
            container.innerHTML = originalContent;
            container.removeAttribute('data-original-content');
        }
    }

    // Particle effect for successful actions
    createParticleEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--boston-red);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particle-explosion 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    // Ripple effect for button clicks
    addRippleEffect(event) {
        const button = event.target.closest('.btn');
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Smooth scrolling for navigation
    smoothScrollTo(targetElement, duration = 500) {
        const start = window.pageYOffset;
        const target = targetElement.offsetTop;
        const distance = target - start;
        let progress = 0;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            progress = timestamp - startTime;
            
            const percent = Math.min(progress / duration, 1);
            const ease = this.easeInOutCubic(percent);
            
            window.scrollTo(0, start + distance * ease);
            
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        };
        
        let startTime = null;
        requestAnimationFrame(step);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Add CSS animations dynamically
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-explosion {
                0% {
                    transform: scale(1) translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }

            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .shimmer {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }

            .pulse-success {
                animation: pulse-success 0.6s ease-out;
            }

            @keyframes pulse-success {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(40, 167, 69, 0.3); }
                100% { transform: scale(1); }
            }

            .shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Success feedback animation
    triggerSuccessAnimation(element) {
        element.classList.add('pulse-success');
        
        setTimeout(() => {
            element.classList.remove('pulse-success');
        }, 600);
    }

    // Error feedback animation
    triggerErrorAnimation(element) {
        element.classList.add('shake');
        
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // Progress bar animation
    animateProgressBar(progressBar, targetPercentage, duration = 2000) {
        let currentPercentage = 0;
        const increment = targetPercentage / (duration / 16);
        
        const animate = () => {
            currentPercentage += increment;
            
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
            }
            
            progressBar.style.width = `${currentPercentage}%`;
            progressBar.setAttribute('aria-valuenow', Math.round(currentPercentage));
            
            if (currentPercentage < targetPercentage) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Staggered animation for lists
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    // Connection status animation
    animateConnectionStatus(isConnected) {
        const dot = document.getElementById('connectionStatus');
        const text = document.getElementById('connectionText');
        
        if (!dot || !text) return;

        if (isConnected) {
            dot.classList.remove('bg-danger');
            dot.classList.add('bg-success');
            text.textContent = 'Conectado';
            
            // Add success pulse
            dot.style.animation = 'pulse-success 0.6s ease-out';
        } else {
            dot.classList.remove('bg-success');
            dot.classList.add('bg-danger');
            text.textContent = 'Desconectado';
            
            // Add error shake
            text.style.animation = 'shake 0.5s ease-in-out';
        }
        
        setTimeout(() => {
            dot.style.animation = 'pulse 2s infinite';
            text.style.animation = '';
        }, 1000);
    }

    // Map marker bounce animation
    bounceMarker(markerId) {
        const marker = document.querySelector(`[data-marker-id="${markerId}"]`);
        if (marker) {
            marker.style.animation = 'bounce 0.6s ease-in-out';
            
            setTimeout(() => {
                marker.style.animation = '';
            }, 600);
        }
    }

    // Notification slide-in animation
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger slide-in animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto dismiss
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }

    // Tab content slide animation
    animateTabContent(tabId) {
        const tabContent = document.getElementById(tabId);
        if (!tabContent) return;

        const elements = tabContent.querySelectorAll('.card, .table, .row > div');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    
    setTimeout(() => {
        window.animationManager.init();
        window.animationManager.addDynamicStyles();
    }, 500);

    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) {
            window.animationManager.addRippleEffect(e);
        }
    });

    // Animate tab content when switching
    document.addEventListener('shown.bs.tab', (e) => {
        const tabId = e.target.getAttribute('data-bs-target').substring(1);
        window.animationManager.animateTabContent(tabId);
    });

    // Add initial welcome notification
    setTimeout(() => {
        window.animationManager?.showNotification(
            '<i class="bi bi-hand-thumbs-up"></i> <strong>¡Bienvenido al Demo de Boston Tracker!</strong><br>Explora las diferentes funcionalidades del dashboard.',
            'success',
            8000
        );
    }, 2000);
});

// Export for external use
window.animations = {
    triggerSuccess: (element) => window.animationManager?.triggerSuccessAnimation(element),
    triggerError: (element) => window.animationManager?.triggerErrorAnimation(element),
    showNotification: (message, type, duration) => window.animationManager?.showNotification(message, type, duration),
    bounceMarker: (markerId) => window.animationManager?.bounceMarker(markerId)
};

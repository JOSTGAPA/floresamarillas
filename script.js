/* ==========================================================================
   CONFIGURACIÓN Y ESTADO GLOBAL
   ========================================================================== */
   const state = {
    moonDiscovered: false,
    waterDiscovered: false,
    letterRead: false,
    surpriseUnlocked: false
};

const DOM = {
    starsContainer: document.getElementById('stars-container'),
    mConstellation: document.getElementById('m-constellation'),
    particlesContainer: document.getElementById('particles-container'),
    moon: document.getElementById('moon'),
    moonContainer: document.getElementById('moon-container'),
    secretWaterZone: document.getElementById('secret-water-zone'),
    secretMarText: document.getElementById('secret-mar-text'),
    btnLetter: document.getElementById('btn-letter'),
    btnSurprise: document.getElementById('btn-surprise'),
    modals: document.querySelectorAll('.modal'),
    closeBtns: document.querySelectorAll('.btn-close'),
    finalExperience: document.getElementById('final-experience'),
    subtitle: document.getElementById('subtitle')
};

function createStars(count) {
    if(!DOM.starsContainer) return;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        DOM.starsContainer.appendChild(star);
    }
}

function createMConstellation() {
    if(!DOM.mConstellation) return;
    const points = [{ x: 10, y: 90 }, { x: 30, y: 10 }, { x: 50, y: 50 }, { x: 70, y: 10 }, { x: 90, y: 90 }];
    points.forEach(p => {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${p.x}%`;
        star.style.top = `${p.y}%`;
        star.style.width = '2.5px';
        star.style.height = '2.5px';
        star.style.backgroundColor = '#fff4cc';
        DOM.mConstellation.appendChild(star);
    });
}

function createFireflies(count) {
    if(!DOM.particlesContainer) return;
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        animateFirefly(firefly);
        DOM.particlesContainer.appendChild(firefly);
    }
}

function animateFirefly(element) {
    const startX = 40 + Math.random() * 20; 
    const startY = 60 + Math.random() * 20;
    const endX = startX + (Math.random() * 30 - 15);
    const endY = startY - (Math.random() * 40 + 10);
    element.style.left = `${startX}%`;
    element.style.top = `${startY}%`;

    element.animate([
        { transform: `translate(0, 0) scale(0)`, opacity: 0 },
        { transform: `translate(${(endX - startX)}vw, ${(endY - startY) / 2}vh) scale(1)`, opacity: 0.8, offset: 0.5 },
        { transform: `translate(${(endX - startX) * 1.5}vw, ${endY - startY}vh) scale(0)`, opacity: 0 }
    ], { duration: Math.random() * 4000 + 4000, easing: 'ease-in-out', iterations: 1 }
    ).onfinish = () => animateFirefly(element);
}

function handleMoonClick() {
    if (!state.moonDiscovered) {
        state.moonDiscovered = true;
        checkProgress();
    }
    if(DOM.moon) {
        DOM.moon.style.transform = 'scale(1.1)';
        DOM.moon.style.boxShadow = '0 0 80px rgba(255, 255, 255, 0.6), 0 0 150px rgba(230, 240, 255, 0.4)';
    }
    if(DOM.mConstellation) DOM.mConstellation.style.opacity = '0.8';
    
    if(DOM.subtitle) {
        const originalText = DOM.subtitle.innerText;
        DOM.subtitle.innerText = "Incluso de noche, algunas cosas saben encontrar la luz.";
        DOM.subtitle.style.color = '#fff4cc';
        setTimeout(() => {
            if(DOM.moon) {
                DOM.moon.style.transform = '';
                DOM.moon.style.boxShadow = '';
            }
            if(DOM.mConstellation) DOM.mConstellation.style.opacity = '0.15';
            DOM.subtitle.innerText = originalText;
            DOM.subtitle.style.color = '';
        }, 4000);
    }
}

function handleWaterClick(e) {
    if (!state.waterDiscovered) {
        state.waterDiscovered = true;
        checkProgress();
    }
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.transition = 'all 1.5s ease-out';
    DOM.secretWaterZone.appendChild(ripple);

    if(DOM.secretMarText) {
        DOM.secretMarText.style.opacity = '1';
        DOM.secretMarText.style.transform = 'translateY(-10px)';
    }

    requestAnimationFrame(() => {
        ripple.style.width = '100px';
        ripple.style.height = '40px';
        ripple.style.opacity = '0';
    });

    setTimeout(() => {
        if(DOM.secretMarText) {
            DOM.secretMarText.style.opacity = '0';
            DOM.secretMarText.style.transform = 'translateY(0)';
        }
        ripple.remove();
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        if (modalId === 'modal-letter' && !state.letterRead) {
            state.letterRead = true;
            checkProgress();
        }
    } else {
        alert("¡Falta el código de la carta en tu archivo index.html!");
    }
}

function closeAllModals() {
    DOM.modals?.forEach(modal => modal.classList.remove('active'));
    if (state.surpriseUnlocked && !document.getElementById('modal-surprise')?.classList.contains('active')) {
        if (DOM.finalExperience && !DOM.finalExperience.classList.contains('active')) {
             setTimeout(triggerFinalExperience, 1000);
        }
    }
}

function checkProgress() {
    if (state.moonDiscovered && state.waterDiscovered && state.letterRead && !state.surpriseUnlocked) {
        state.surpriseUnlocked = true;
        if(DOM.btnSurprise) {
            DOM.btnSurprise.classList.remove('hidden');
            DOM.btnSurprise.animate([
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1)' }
            ], { duration: 1000, easing: 'ease-out' });
        }
    }
}

function triggerFinalExperience() {
    if(DOM.finalExperience) DOM.finalExperience.classList.add('active');
    const uiLayer = document.getElementById('ui-layer');
    if(uiLayer) {
        uiLayer.style.opacity = '0';
        uiLayer.style.transition = 'opacity 2s ease';
    }
    const glow = document.getElementById('flower-light-glow');
    if(glow) glow.style.background = 'radial-gradient(circle, rgba(255, 200, 50, 0.4) 0%, transparent 70%)';
}

function init() {
    createStars(150);
    createMConstellation();
    createFireflies(12);

    DOM.moonContainer?.addEventListener('click', handleMoonClick);
    DOM.secretWaterZone?.addEventListener('click', handleWaterClick);
    DOM.btnLetter?.addEventListener('click', () => openModal('modal-letter'));
    
    DOM.btnSurprise?.addEventListener('click', () => {
        openModal('modal-surprise');
        DOM.btnSurprise.classList.add('hidden');
    });

    DOM.closeBtns?.forEach(btn => btn.addEventListener('click', closeAllModals));

    DOM.modals?.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeAllModals();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
}

document.addEventListener('DOMContentLoaded', init);
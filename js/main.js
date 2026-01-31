// Navegación móvil
const menuBtn = document.getElementById('menuBtn');
const navbar = document.getElementById('navbar');

function toggleMenu() {
    navbar.classList.toggle('active');
    menuBtn.innerHTML = navbar.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Cerrar menú si está abierto
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Scroll suave
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Cerrar menú al hacer scroll
window.addEventListener('scroll', () => {
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    initSmoothScroll();
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
});
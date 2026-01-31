// Carrito
let cart = JSON.parse(localStorage.getItem('simpleCart')) || [];
let cartTotal = 0;

// Elementos del DOM
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const mobileCart = document.getElementById('mobileCart');
const closeCartBtn = document.getElementById('closeCartBtn');
const mobileCartItems = document.getElementById('mobileCartItems');
const mobileCartTotal = document.getElementById('mobileCartTotal');
const mobileCheckoutBtn = document.getElementById('mobileCheckoutBtn');

// Abrir carrito
function openCart() {
    mobileCart.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquear scroll
    updateCartDisplay();
}

// Cerrar carrito
function closeCart() {
    mobileCart.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
}

// Agregar al carrito
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Buscar si ya está en el carrito
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Actualizar y guardar
    updateCart();
    saveCart();
    showNotification(`${product.name} agregado`);
    
    // Abrir carrito automáticamente en móvil
    if (window.innerWidth <= 768) {
        openCart();
    }
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
    showNotification('Producto eliminado');
}

// Actualizar cantidad
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCart();
    }
}

// Actualizar visualización
function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Guardar en localStorage
    saveCart();
}

// Actualizar display del carrito móvil
function updateCartDisplay() {
    if (!mobileCartItems) return;
    
    // Limpiar
    mobileCartItems.innerHTML = '';
    
    if (cart.length === 0) {
        mobileCartItems.innerHTML = '<p class="empty">Tu carrito está vacío</p>';
        mobileCartTotal.textContent = '$0';
        return;
    }
    
    // Agregar items
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString('es-AR')} c/u</p>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="item-actions">
                <p class="item-total">$${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        mobileCartItems.appendChild(div);
    });
    
    // Actualizar total
    mobileCartTotal.textContent = `$${cartTotal.toLocaleString('es-AR')}`;
    
    // Agregar eventos
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, -1);
            updateCartDisplay();
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, 1);
            updateCartDisplay();
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            removeFromCart(id);
            updateCartDisplay();
        });
    });
}

// Guardar en localStorage
function saveCart() {
    localStorage.setItem('simpleCart', JSON.stringify(cart));
}

// Mostrar notificación
function showNotification(message) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--verde);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    // Animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// WhatsApp checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    // Construir mensaje
    let message = `¡Hola Simple! Quiero realizar un pedido:\n\n`;
    message += `*PEDIDO DE COSMÉTICOS NATURALES*\n\n`;
    message += `*Productos:*\n`;
    
    cart.forEach((item, i) => {
        message += `${i+1}. ${item.name} - ${item.quantity} x $${item.price.toLocaleString('es-AR')}\n`;
    });
    
    message += `\n*TOTAL: $${cartTotal.toLocaleString('es-AR')}*\n\n`;
    message += `*Mis datos:*\n`;
    message += `• Nombre: \n`;
    message += `• Dirección: \n`;
    message += `• Comentarios: \n\n`;
    message += `*Zonas:* Colonia Avellaneda, Paraná, San Benito, Sauce Montrúl, María Grande\n\n`;
    message += `¡Gracias!`;
    
    // Abrir WhatsApp
    window.open(`https://wa.me/5493435345362?text=${encodeURIComponent(message)}`, '_blank');
    
    // Vaciar carrito
    cart = [];
    updateCart();
    updateCartDisplay();
    closeCart();
    
    showNotification('Pedido enviado a WhatsApp');
}

// Inicializar eventos
function initCart() {
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (mobileCheckoutBtn) mobileCheckoutBtn.addEventListener('click', checkout);
    
    // Cerrar carrito al hacer clic fuera (en el overlay)
    mobileCart.addEventListener('click', (e) => {
        if (e.target === mobileCart) {
            closeCart();
        }
    });
    
    // Actualizar carrito inicial
    updateCart();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCart);

// Exportar para usar en products.js
window.addToCart = addToCart;
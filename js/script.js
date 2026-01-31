/* === DATOS DE PRODUCTOS === */
const products = [
    { id: 1, name: "Shampoo sólido", price: 1000, image: "shampoo-solido.jpg", categoria: "cabello" },
    { id: 2, name: "Crema corporal y manos", price: 1000, image: "crema-corporal-manos.jpg", categoria: "cuerpo" },
    { id: 3, name: "Crema corporal", price: 1000, image: "crema-corporal.jpg", categoria: "cuerpo" },
    { id: 4, name: "Sales terapéuticas", price: 1000, image: "sales-terapeuticas.jpg", categoria: "cuerpo" },
    { id: 5, name: "Acondicionador", price: 1000, image: "acondicionador.jpg", categoria: "cabello" },
    { id: 6, name: "Tónico facial", price: 1000, image: "tonico-facial.jpg", categoria: "rostro" },
    { id: 7, name: "After shave", price: 1000, image: "after-shave.jpg", categoria: "cuerpo" },
    { id: 8, name: "Protector térmico capilar", price: 1000, image: "protector-termico.jpg", categoria: "cabello" },
    { id: 9, name: "Repelente", price: 1000, image: "repelente.jpg", categoria: "otros" },
    { id: 10, name: "Gel de limpieza", price: 1000, image: "gel-limpieza.jpg", categoria: "rostro" },
    { id: 11, name: "Crema de limpieza facial", price: 1000, image: "crema-limpieza-facial.jpg", categoria: "rostro" },
    { id: 12, name: "Acondicionador para peinar", price: 1000, image: "acondicionador-peinar.jpg", categoria: "cabello" },
    { id: 13, name: "Perfumes", price: 1000, image: "perfumes.jpg", categoria: "otros" },
    { id: 14, name: "Lip gloss", price: 1000, image: "lip-gloss.jpg", categoria: "maquillaje" },
    { id: 15, name: "Serúm facial", price: 1000, image: "serum-facial.jpg", categoria: "rostro" },
    { id: 16, name: "Sombra", price: 1000, image: "sombra.jpg", categoria: "maquillaje" },
    { id: 17, name: "Bálsamo labial", price: 1000, image: "balsamo-labial.jpg", categoria: "rostro" },
    { id: 18, name: "Labial", price: 1000, image: "labial.jpg", categoria: "maquillaje" },
    { id: 19, name: "Jabones saponificados", price: 1000, image: "jabones-saponificados.jpg", categoria: "cuerpo" },
    { id: 20, name: "Agua micelar", price: 1000, image: "agua-micelar.jpg", categoria: "rostro" },
    { id: 21, name: "Gel contorno de ojos", price: 1000, image: "gel-contorno-ojos.jpg", categoria: "rostro" },
    { id: 22, name: "Óleo gel para dolores articulares", price: 1000, image: "oleo-gel-dolores.jpg", categoria: "otros" },
    { id: 23, name: "Crema pañalera", price: 1000, image: "crema-panalera.jpg", categoria: "otros" },
    { id: 24, name: "Crema facial", price: 1000, image: "crema-facial.jpg", categoria: "rostro" }
];

/* === VARIABLES DE ESTADO Y DOM === */
let cart = JSON.parse(localStorage.getItem('simple-cart')) || [];
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const checkoutModal = document.getElementById('checkout-modal');

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('todos');
    updateCartUI();
    setupEventListeners();
});

/* === FUNCIONES PRINCIPALES === */

// 1. Renderizar Productos
function renderProducts(category) {
    productsContainer.innerHTML = '';
    
    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(p => p.categoria === category);

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron productos.</p>';
        return;
    }

    // Colores para etiquetas
    const categoryColors = {
        'cabello': '#2E8B57', 'rostro': '#4682B4', 'cuerpo': '#8B4513',
        'maquillaje': '#DDA0DD', 'otros': '#666666'
    };

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const catColor = categoryColors[product.categoria] || '#666';
        const imgPath = `assets/productos/${product.image}`;
        // Placeholder si falla la imagen
        const fallback = "https://via.placeholder.com/300?text=Simple+Cosmeticos";

        card.innerHTML = `
            <div class="product-img">
                <span class="product-category" style="background-color: ${catColor}">${product.categoria.toUpperCase()}</span>
                <img src="${imgPath}" alt="${product.name}" onerror="this.src='${fallback}'">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toLocaleString('es-AR')}</p>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// 2. Gestión del Carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification(`¡${product.name} agregado!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('simple-cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Actualizar contador
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalCount;

    // Actualizar lista visual
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toLocaleString('es-AR')} = $${itemTotal.toLocaleString('es-AR')}</p>
                </div>
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    cartTotalElement.textContent = `$${totalPrice.toLocaleString('es-AR')}`;
}

// 3. Sistema de Notificaciones
function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.className = 'notification show';
    setTimeout(() => { notif.className = 'notification'; }, 3000);
}

// 4. Lógica de Interfaz y Event Listeners
function setupEventListeners() {
    // Filtros de Categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.dataset.category);
        });
    });

    // Abrir/Cerrar Carrito
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartDropdown.classList.toggle('active');
    });
    document.getElementById('close-cart').addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });

    // Menú Hamburguesa
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.navbar');
    
    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        // Cambiar icono
        const icon = menuBtn.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer click en enlace (Móvil)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            if(menuBtn.querySelector('i')) {
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Checkout Modal
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío');
            return;
        }
        cartDropdown.classList.remove('active'); // Cerrar carrito
        checkoutModal.style.display = 'flex';
    });

    // Cerrar Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeModal();
    });

    // Enviar Formulario WhatsApp
    document.getElementById('checkout-form').addEventListener('submit', processWhatsAppOrder);
}

function closeModal() {
    checkoutModal.style.display = 'none';
}

// 5. Procesar Pedido (WhatsApp)
function processWhatsAppOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const comments = document.getElementById('customer-comments').value;

    let message = `¡Hola Simple! 👋 Quiero realizar un pedido:\n\n`;
    
    cart.forEach(item => {
        message += `▪️ ${item.quantity} x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    message += `\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n\n`;
    
    message += `👤 *Datos del Cliente:*\n`;
    message += `Nombre: ${name}\n`;
    message += `Dirección: ${address}\n`;
    if (comments) message += `Nota: ${comments}\n`;
    
    message += `\n📍 *Zona de Entrega:* Verificada\n`;

    const whatsappUrl = `https://wa.me/5493435345362?text=${encodeURIComponent(message)}`;
    
    // Limpiar y redirigir
    cart = [];
    saveCart();
    updateCartUI();
    closeModal();
    window.open(whatsappUrl, '_blank');
}

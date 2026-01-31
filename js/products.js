// Datos de productos
const productsData = [
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
    { id: 22, name: "Óleo gel para dolores", price: 1000, image: "oleo-gel-dolores.jpg", categoria: "otros" },
    { id: 23, name: "Crema pañalera", price: 1000, image: "crema-panalera.jpg", categoria: "otros" },
    { id: 24, name: "Crema facial", price: 1000, image: "crema-facial.jpg", categoria: "rostro" }
];

let currentFilter = 'all';

// Mostrar productos
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const filteredProducts = currentFilter === 'all' 
        ? productsData 
        : productsData.filter(p => p.categoria === currentFilter);
    
    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p class="empty">No hay productos en esta categoría</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-img">
                <img src="assets/productos/${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200/E8F5E8/2E8B57?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toLocaleString('es-AR')}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// Inicializar filtros
function initFilters() {
    document.querySelectorAll('.filter').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos
            document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
            // Agregar al clickeado
            this.classList.add('active');
            // Filtrar
            currentFilter = this.getAttribute('data-filter');
            renderProducts();
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initFilters();
});
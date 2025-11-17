// Carrito de compras: array que almacena los productos agregados por el usuario.
// Cada elemento es un objeto con nombre, precio y cantidad.
let cart = [];

// Función para agregar un producto al carrito.
// Recibe:
//   - button: referencia al botón "Agregar al Carrito" pulsado (para ubicar el input de cantidad).
//   - productName: nombre del libro.
//   - productPrice: precio unitario del libro.

function addToCart(button, productName, productPrice) {
    // Busca el input de cantidad asociado al botón (está en la celda anterior dentro de la misma fila).
    const quantityInput = button.parentElement.previousElementSibling.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value);

    // Valida que la cantidad sea un número positivo.
    if (isNaN(quantity) || quantity <= 0) {
        showNotification('Cantidad inválida');
        return;
    }

    // Agrega el producto al carrito como un nuevo objeto.
    cart.push({ name: productName, price: productPrice, quantity: quantity });

    // Actualiza la vista del carrito en la página.
    updateCart();

    // Muestra una notificación visual al usuario.
    showNotification('¡Producto agregado al carrito!');
}

// Función que actualiza la visualización del carrito en la interfaz.
// Limpia la lista actual, recalcula el total y muestra cada ítem.

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalElement = document.getElementById('total');

    // Limpia la lista actual de productos en el carrito.
    cartItems.innerHTML = '';
    let totalAmount = 0;

    // Recorre cada producto en el carrito, calcula su subtotal y lo muestra.
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} x ${item.quantity} = $${itemTotal}`;
        cartItems.appendChild(li);
    });

    // Actualiza el total mostrado.
    totalElement.textContent = `Total: $${totalAmount}`;
}

// Función para vaciar completamente el carrito.
// Reinicia el array y actualiza la vista.

function clearCart() {
    cart = [];
    updateCart();
}

// Función que filtra los productos visibles en la tabla.
// Se activa al cambiar la categoría o escribir en el buscador.
// Filtra por categoría (select) y/o nombre del libro (input de texto).

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    // Recorre cada fila de producto y decide si debe mostrarse u ocultarse.
    products.forEach(product => {
        const prodCategory = product.getAttribute('data-category');
        const prodName = product.getAttribute('data-name').toLowerCase();

        // Verifica si coincide con la categoría seleccionada y contiene el texto buscado.
        const show = (category === 'all' || prodCategory === category) && prodName.includes(search);
        product.style.display = show ? '' : 'none'; // Muestra u oculta la fila.
    });
}

// Función que finaliza la compra y muestra el resumen en un modal.
// Valida que el carrito no esté vacío y muestra datos del cliente y notas.

function finalizePurchase() {
    // Evita finalizar si no hay productos.
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }

    // Obtiene los datos del cliente y las notas del formulario.
    const customerName = document.getElementById('customerName').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Referencias a los elementos del modal.
    const modal = document.getElementById('modal');
    const summaryBody = document.getElementById('summaryBody');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryCustomer = document.getElementById('summaryCustomer');
    const summaryNotes = document.getElementById('summaryNotes');

    // Limpia el contenido anterior del resumen.
    summaryBody.innerHTML = '';
    let totalAmount = 0;

    // Genera una fila en la tabla del resumen por cada producto.
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>$${itemTotal}</td>`;
        summaryBody.appendChild(tr);
    });

    // Actualiza el total y la información del cliente en el modal.
    summaryTotal.textContent = `Total: $${totalAmount}`;
    summaryCustomer.textContent = customerName ? `Cliente: ${customerName}` : 'Cliente: No especificado';
    summaryNotes.textContent = notes ? `Notas: ${notes}` : '';

    // Muestra el modal.
    modal.style.display = 'block';
}

// Función para cerrar el modal de resumen de compra.
// Oculta el modal al hacer clic en la "X".

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Función para mostrar una notificación visual suave (sin alert).
// Usa una capa con transición de opacidad que desaparece automáticamente.

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show'); // Activa la animación de aparición.

    // Después de 2 segundos, elimina la clase para ocultar la notificación.
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
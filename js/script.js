

let carrito = [];

// desde aca obtengo los productos desde la api publica
function obtenerProductos() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data); 
            mostrarCategorias(data); 
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

// me muestra los productos en la pagina
function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; 

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('col-md-4', 'mb-4');
        productoCard.innerHTML = `
            <div class="card">
                <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text">$${producto.price}</p>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price}, '${producto.image}')">Agregar al carrito</button>
                </div>
            </div>
        `;
        productosContainer.appendChild(productoCard);
    });
}

// categorias para filtrar indumentaria masculina,femenina,electronica etc etc
function mostrarCategorias(productos) {
    const categoriasContainer = document.getElementById('categorias');
    const categorias = Array.from(new Set(productos.map(producto => producto.category))); 

    categoriasContainer.innerHTML = '<button class="btn btn-secondary" onclick="filtrarPorCategoria()">Ver todos</button>'; // Botón para mostrar todos los productos

    // me crea un boton para cada categoria
    categorias.forEach(categoria => {
        const categoriaButton = document.createElement('button');
        categoriaButton.classList.add('btn', 'btn-primary', 'm-2');
        categoriaButton.innerText = categoria;
        categoriaButton.onclick = function () { filtrarPorCategoria(categoria, productos); };
        categoriasContainer.appendChild(categoriaButton);
    });
}
// me muestra los productos filtrados(aunque no funciona no se porque)
function filtrarPorCategoria(categoria, productos) {
    const productosFiltrados = categoria ? productos.filter(producto => producto.category === categoria) : productos;
    mostrarProductos(productosFiltrados); 
}

// funcion para agregar al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    const productoExistente = carrito.find(producto => producto.id === id);

    if (productoExistente) {
        // Si el producto ya está en el carrito, me suma la cantidad
        productoExistente.cantidad++;
    } else {
        // Si el producto no está en el carrito, me agrega con cantidad 1
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    // me guarda el carrito actualizado en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // me actualiza la vista del carrito
    mostrarCarrito();
}

// me meustra el carrito en una tabla
function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito');
    carritoContainer.innerHTML = ''; 

    let total = 0;

    // me muestra los productos en la tabla
    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;
        const productoCarrito = document.createElement('tr');
        productoCarrito.innerHTML = `
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" width="50" height="50">
                ${producto.nombre}
            </td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.cantidad}</td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </td>
        `;
        carritoContainer.appendChild(productoCarrito);
    });

    // me muestra el total de la compra en la tabla
    const totalDiv = document.getElementById('total');
    totalDiv.innerHTML = `
        <strong>Total: $${total.toFixed(2)}</strong>
    `;
}

// funcion para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1); // Elimina el producto del carrito
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualiza el carrito en localStorage
    mostrarCarrito(); // Actualiza la vista del carrito
}

// Carga el carrito desde localStorage al cargar la página
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    mostrarCarrito();
}

// me finaliza la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
    } else {
        alert('Compra finalizada con éxito. ¡Gracias por tu compra!');
        localStorage.removeItem('carrito'); 
        mostrarCarrito(); 
    }
}


window.onload = function() {
    if (document.getElementById('productos')) {
        obtenerProductos(); 
    }

    if (document.getElementById('carrito')) {
        cargarCarrito(); 
    }
};



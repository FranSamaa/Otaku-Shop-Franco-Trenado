class ProductoCarrito{
    constructor(title,description,thumbnail,currency_id, unit_price,available_quantity){
        this.title = title
        this.description = description
        this.thumbnail = thumbnail
        this.currency_id = currency_id
        this.unit_price = unit_price
        this.quantity = available_quantity
    }
}


if (!localStorage.getItem("user")) {
    alert("No estás logueado, redirigiendo a la página de login...");
    window.location.href = "./login.html";
}

const callML= ()=>{
    return fetch ("https://api.mercadolibre.com/sites/MLA/search?q=mangas")
}


productos=[]

const getInfo = () => {
    callML()
    .then(res => res.json())
    .then((res) => {
        console.log(res);
        productos = [...productos, ...res.results];
        cargarProductos(productos, contenedorProductos)
    })
    .finally(() =>{
        console.log('termino de cargar')
    })
}

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(productos => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${productos.thumbnail}" alt="${productos.title}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${productos.title}</h3>
                <p class="producto-precio">$${productos.price}</p>
                <button class="producto-agregar" id="${productos.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
    
}
getInfo()

cargarProductos(productos);

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = sessionStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;

    const productoAgregado = productos.find(producto => producto.id === idBoton);
    const productoCarrito = new ProductoCarrito(
        productoAgregado.title,
        productoAgregado.description,
        productoAgregado.thumbnail,
        productoAgregado.currency_id,
        productoAgregado.price,
        productoAgregado.available_quantity

        )
    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoCarrito);
    }

    actualizarNumerito();

    sessionStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


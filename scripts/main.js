
if (!localStorage.getItem("user")) {
    alert("No estás logueado, redirigiendo a la página de login...");
    window.location.href = "./login.html";
}

const productos = [
    //MANGAS
    {
        id: "manga1-Naruto",
        titulo: "Naruto",
        imagen: "Mangas/naruto-1.jpg",
        categoria:{
            nombre: "Mangas",
            id: "mangas"
        },
        precio: 900,
    },
    {
        id: "manga2-Naruto",
        titulo: "Naruto",
        imagen: "Mangas/naruto-2.jpg",
        categoria:{
            nombre: "Mangas",
            id: "mangas"

        },
        precio: 900,
    },
    {
        id: "manga1-OnePiece-1",
        titulo: "One Piece",
        imagen: "Mangas/one-piece-1.jpg",
        categoria:{
            nombre: "Mangas",
            id: "mangas"
        },
        precio: 900,
    },
    {
        id: "manga2-OnePiece-2",
        titulo: "One Piece",
        imagen: "Mangas/one-piece-2.jpg",
        categoria:{
            nombre: "Mangas",
            id: "mangas"
        },
        precio: 900,
    },
    {
        id: "manga1-Bleach",
        titulo: "Bleach",
        imagen: "Mangas/bleach-1.jpg",
        categoria:{
            nombre: "Mangas",
            id: "mangas"
        },
        precio: 900,
    },
    //REMERAS
    {
        id: "remera1-Naruto",
        titulo: "Remera-Naruto",
        imagen: "Remeras/naruto-1.jpg",
        categoria:{
            nombre: "Remeras",
            id: "remeras"
        },
        precio: 2000,
    },
    {
        id: "remera2-Naruto",
        titulo: "Remera-Naruto",
        imagen: "Remeras/naruto-2.jpg",
        categoria:{
            nombre: "Remeras",
            id: "remeras"
        },
        precio: 2000,
    },
    {
        id: "remera1-OnePiece",
        titulo: "Remera-OnePiece",
        imagen: "Remeras/one-piece-1.jpg",
        categoria:{
            nombre: "Remeras",
            id: "remeras"
        },
        precio: 2000,
    },
    {
        id: "remera2-OnePiece",
        titulo: "Remera-OnePiece",
        imagen: "Remeras/one-piece-2.jpg",
        categoria:{
            nombre: "Remeras",
            id: "remeras"
        },
        precio: 2000,
    },
    {
        id: "remera1-Bleach",
        titulo: "Remera-Bleach",
        imagen: "Remeras/bleach-1.jpg",
        categoria:{
            nombre: "Remeras",
            id: "remeras"
        },
        precio: 2000,
    },  
    //buzos
    {
        id: "buzo1-Naruto",
        titulo: "Buzo-Naruto",
        imagen: "Buzos/naruto-1.jpg",
        categoria:{
            nombre: "Buzos",
            id: "buzos"

        },
        precio: 3000,
    },
    {
        id: "buzo2-Naruto",
        titulo: "Buzo-Naruto",
        imagen: "Buzos/naruto-2.jpg",
        categoria:{
            nombre: "Buzos",
            id: "buzos"
        },
        precio: 3000,
    },
    {
        id: "buzo1-OnePiece",
        titulo: "Buzo-OnePiece",
        imagen: "Buzos/one-piece-1.jpg",
        categoria:{
            nombre: "Buzos",
            id: "buzos"

        },
        precio: 3000,
    },
    {
        id: "buzo2-OnePiece",
        titulo: "Buzo-OnePiece",
        imagen: "Buzos/one-piece-2.jpg",
        categoria:{
            nombre: "Buzos",
            id: "buzos"
        },
        precio: 3000,
    },
    {
        id: "buzo1-Bleach",
        titulo: "Buzo-Bleach",
        imagen: "Buzos/bleach-1.jpg",
        categoria:{
            nombre: "Buzos",
            id: "buzos"
        },
        precio: 3000,
    }
];

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

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

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    sessionStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


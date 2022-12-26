
const token="TEST-926637421921342-122011-96bc333adede832c93d7bde748b71ac9-182762410";

let productosEnCarrito = sessionStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.thumbnail}" alt="${producto.title}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.title}</h3>
                </div>
                
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.unit_price}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);

        })
    
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    actualizarTotal();
    
}


cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    sessionStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    productosEnCarrito.length = 0;
    sessionStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.unit_price, 0);
    total.innerText = `$${totalCalculado}`;
    sessionStorage.setItem("total", totalCalculado);
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    sessionStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}

const fetchML = (item) => fetch('https://api.mercadopago.com/checkout/preferences', {
    headers: {
        "Authorization": 'Bearer ' + token,
        "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify({
            "items": [
       item
          ]
    })
})

const pagoML = async (item) => {
    // const response = await fetchML();
    // const responseJSON = await response.json()
    const response = await JSONResponse(fetchML(item))

    console.log(response);
    //REDIRIGIMOS A LA URL DE PAGO
    window.location.href = response.init_point
}
const irAlPago = (e) => {
    const id = e.target.getAttribute('ref');

    const producto = productos.find(producto => producto.id === id);

    if (!producto) {
        return;
    }

    const item = {
        title: producto.title,
        picture_url: producto.thumbnail,
        currency_id: producto.currency_id,
        unit_price: producto.unit_price,
        quantity:sessionStorage.getItem("total")
      }
      botonComprar.innerHTML = spinner;
      pagoML(item)
    
}

function comprar(){
    const items = {
        items:JSON.parse(sessionStorage.getItem("productos-en-carrito"))
    }
    console.log((items));
    const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer TEST-926637421921342-122011-96bc333adede832c93d7bde748b71ac9-182762410'
        },
        body: JSON.stringify(items)
      };

      fetch('https://api.mercadopago.com/checkout/preferences', options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            Swal.fire({
                title:"Gracias Por Comprar",
                text:"En OtakuShop",
                icon:"success"
           })
            window.location.href = response.sandbox_init_point;
        })
        .catch(err => console.error(err));
}



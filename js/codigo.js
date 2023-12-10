

// el codigo por alguna razon me dejo de funcionar no entiendo como pero bueno yo creo que esta bien saludos


class Camioneta {
    constructor(modelo, marca, precio, imagen) {
      this.modelo = modelo;
      this.marca = marca;
      this.precio = precio;
      this.imagen = imagen;
    }
  
    agregarAlCarrito(carrito) {
      carrito.push(this);
      cantidadBotonCarrito();
      guardarCarritoLocalStorage();
      Toastify({
        text: `${this.marca} ${this.modelo} añadida al carrito.`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#5bc0de",
          'box-shadow': "-8px 9px 73px -14px rgba(0,0,0,0.46)",
        },
      }).showToast();
    }
  }
  
  
  let carrito = localStorage.getItem("carrito")? JSON.parse(localStorage.getItem("carrito")) : [];
  let camionetaEnVenta = [];
  
  fetch('./cam.json')
  .then(response => response.json())
  .then(data => {
    camionetaEnVenta = data.map(Camioneta => new Camioneta(Camioneta.modelo, Camioneta.marca, Camioneta.precio, Camioneta.imagen));
  })
  .catch(error => {
    console.log('ERROR: No se pudieron cargar las camionetas:', error)
  })
  
  const camionetaDiv =  document.getElementById("camionetaDiv");
  
  // BOTONES
  const mostrarCamionetaBtn = document.getElementById("mostrarCamionetaBtn");
  mostrarCamionetaBtn.addEventListener("click", () => {mostrarCamioneta(camionetaEnVenta, "En este momento contamos con "+camionetaEnVenta.length+" camionetas disponibles:")})
  
  const buscarPrecioMaximoBtn = document.getElementById("buscarPrecioMaximoBtn");
  buscarPrecioMaximoBtn.addEventListener("click", buscarPrecioMaximoCrearInput);
  
  const ordenarBarataACaraBtn = document.getElementById("ordenarBarataACaraBtn");
  ordenarBarataACaraBtn.addEventListener("click", ordenarBarataACara);
  
  const ordenarCaraABarataBtn = document.getElementById("ordenarCaraABarataBtn");
  ordenarCaraABarataBtn.addEventListener("click", ordenarCaraABarata);
  
  const buscarMarcaBtn = document.getElementById("buscarMarcaBtn");
  buscarMarcaBtn.addEventListener("click", buscarMarcaCrearInput);
  
  const carritoBtn = document.getElementById("carritoBtn");
  carritoBtn.addEventListener("click", verCarrito);
  
  cantidadBotonCarrito();
  
  // FUNCIONES
  
  
  function mostrarCamioneta(arrayCamioneta = camionetaEnVenta, mensaje = "En este momento contamos con "+camionetaEnVenta.length+" camionetas disponibles:"){
    const p = document.createElement("p");
    const ul = document.createElement("ul");
  
    p.textContent = mensaje;
    arrayCamioneta.forEach(Camioneta => {
      const {modelo, marca, precio, imagen} = Camioneta
      const li = document.createElement("li");
      li.classList.add("contenedorCamioneta");
  
      const imgCamioneta = document.createElement("img");
      imgCamioneta.src = imagen;
      imgCamioneta.onerror = function() {
        this.src = "asset/img/camioneta.png";
      };    
      imgCamioneta.alt = "camioneta"
      imgCamioneta.classList.add("imgCamioneta");
  
      const pPrecioCamioneta = document.createElement("p");
      pPrecioCamioneta.textContent = `$${precio}`;
      pPrecioCamioneta.classList.add("precioCamioneta");
  
      const h1Camioneta = document.createElement("h1");
      h1Camioneta.textContent = `${marca} ${modelo}`
      h1Camioneta.classList.add("h1Camioneta");
    
      const button = document.createElement("button");
      button.textContent = "Agregar al carrito";
      button.classList.add("botonAgregarCarrito");
      button.addEventListener("click", () => {
        camioneta.agregarAlCarrito(carrito);
      })
  
      li.appendChild(h1Camioneta);
      li.appendChild(pPrecioCamioneta);
      li.appendChild(imgCamioneta);
      li.appendChild(button);
      ul.appendChild(li)});
    camionetaDiv.innerHTML = '';
    camionetaDiv.appendChild(p);
    camionetaDiv.appendChild(ul);
  }
  
  
  function buscarPrecioMaximoCrearInput(){
    const p = document.createElement("p");
    p.innerText = "Ingrese el precio máximo deseado:";
    const input = document.createElement("input");
    input.type = "number";
    const button = document.createElement("button");
    button.textContent = "Buscar";
    button.addEventListener("click", buscarPrecioMaximo);
    input.addEventListener("keydown", function(event){
      if(event.key === "Enter") {buscarPrecioMaximo();}
    })
    camionetaDiv.innerHTML = '';
    camionetaDiv.appendChild(p);
    camionetaDiv.appendChild(input);
    camionetaDiv.appendChild(button);
    function buscarPrecioMaximo(){
      let precioMaximo = input.value;
      if(precioMaximo == false){
        p.innerText = "ERROR: Ingrese un precio válido.";
        button.textContent = "Volver"
        button.addEventListener("click", buscarPrecioMaximoCrearInput);
        camionetaDiv.innerHTML = '';
        camionetaDiv.appendChild(p);
        camionetaDiv.appendChild(button);
      } else {
        const camionetaPrecioMaximo = camionetaEnVenta.filter((camioneta) => camioneta.precio <= precioMaximo);
        if(camionetaPrecioMaximo.length === 0){
          p.innerText = `No encontramos camionetas con valor de $${precioMaximo} o menos.`
          button.textContent = "Volver"
          button.addEventListener("click", buscarPrecioMaximoCrearInput);
          camionetaDiv.innerHTML = '';
          camionetaDiv.appendChild(p);
          camionetaDiv.appendChild(button);
        } else {
          mostrarCamioneta(camionetaPrecioMaximo, `Encontramos ${camionetaPrecioMaximo.length} camioneta/s de hasta $${precioMaximo}.`);
        }}
  
    }
  } 
  
  function ordenarBarataACara(){
    camionetaEnVenta.sort((a, b) => a.precio - b.precio);
    console.log("Las camionetas fueron ordenadas por precio de menor a mayor.");
    mostrarCamioneta();
  }
  
  function ordenarCaraABarata(){
    camionetaEnVenta.sort((a, b) => b.precio - a.precio);
    console.log("Las camionetas fueron ordenadas por precio de mayor a menor.");
    mostrarCamioneta();
  }
  
  function buscarMarcaCrearInput(){
    const p = document.createElement("p");
    p.innerText = "Ingrese la marca (Ejemplos: Ford, Volkswagen, etc.):";
    const input = document.createElement("input");
    input.type = "text";
    const button = document.createElement("button");
    button.textContent = "Buscar";
    button.addEventListener("click", buscarMarca);
    input.addEventListener("keydown", function(event){
      if(event.key === "Enter") {buscarMarca();}
    })
    camionetaDiv.innerHTML = '';
    camionetaDiv.appendChild(p);
    camionetaDiv.appendChild(input);
    camionetaDiv.appendChild(button);
    function buscarMarca(){
      let marcaBuscada = input.value;
      const p = document.createElement("p");
      const camionetaMarcaBuscada = camionetaEnVenta.filter((camioneta) => camioneta.marca.toLowerCase() === marcaBuscada.toLowerCase());
      if(camionetaMarcaBuscada.length === 0){
        p.innerText = `No encontramos camionetas de la marca "${marcaBuscada}".`
        button.textContent = "Volver"
        button.addEventListener("click", buscarMarcaCrearInput);
        camionetaDiv.innerHTML = '';
        camionetaDiv.appendChild(p);
        camionetaDiv.appendChild(button);
      } else {
        mostrarCamioneta(camionetaMarcaBuscada, `Encontramos ${camionetaMarcaBuscada.length} camioneta/s de la marca "${marcaBuscada}".`)
      }
    }
  }
  
  function verCarrito() {
    cantidadBotonCarrito();
    const precioTotal = carrito.reduce((acumulador, camioneta) => acumulador + camioneta.precio, 0);
    const p = document.createElement("p");
    if (carrito.length == 0){
    const button = document.createElement("button")
    p.innerText = "Su carrito se encuentra vacío.";
    button.textContent = "Ver camionetas en venta"
    button.addEventListener("click", () => {mostrarCamionetaa(camionetaEnVenta, "En este momento contamos con "+camionetaEnVenta.length+" camionetas disponibles:")});
    
    camionetaiv.innerHTML = '';
    camionetaDiv.appendChild(p);
    camionetaDiv.appendChild(button);
    } else {
      p.innerText = `Hay ${carrito.length} camionetas en el carrito.`;
      const pTotal = document.createElement("p");
      pTotal.innerText = `Total: $${precioTotal}`
      const vaciarCarritoBtn = document.createElement("button");
      vaciarCarritoBtn.textContent = "Vaciar carrito"
      vaciarCarritoBtn.addEventListener("click", () => {
        vaciarCarrito();
        toastifyVaciarCarrito();
      })
      const finalizarCompraBtn = document.createElement("button");
      finalizarCompraBtn.textContent = "Finalizar compra";
      finalizarCompraBtn.addEventListener("click", finalizarCompra)
      
      const ul = document.createElement("ul");
      carrito.forEach(camioneta => {
        const li = document.createElement("li");
        li.textContent = `${camioneta.marca} ${camioneta.modelo} - Precio $${camioneta.precio}`;
  
        const eliminarDelCarritoBtn = document.createElement("button");
        eliminarDelCarritoBtn.textContent = "Eliminar del carrito";
        eliminarDelCarritoBtn.addEventListener("click", () => {
          eliminarDelCarrito(camioneta, carrito);
          verCarrito(carrito);
        })
  
        li.appendChild(eliminarDelCarritoBtn);
        ul.appendChild(li);
        camionetaDiv.innerHTML = '';
        camionetaDiv.appendChild(p);
        camionetaDiv.appendChild(ul);
        camionetaDiv.appendChild(pTotal);
        camionetaDiv.appendChild(vaciarCarritoBtn);
        camionetaDiv.appendChild(finalizarCompraBtn);
      })   
    }
  }
  
  function eliminarDelCarrito(camioneta, carrito) {
    const index = carrito.findIndex(item => item === camioneta);
    if (index !== -1) {
      carrito.splice(index, 1);
      guardarCarritoLocalStorage();
      Toastify({
        text: `${camioneta.marca} ${camioneta.modelo} eliminada del carrito.`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#f0ad4e",
          'box-shadow': "-8px 9px 73px -14px rgba(0,0,0,0.46)",
        },
      }).showToast();
    }
  }
  
  
  function guardarCarritoLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }
  
  function vaciarCarrito(){
    localStorage.removeItem("carrito");
    carrito = [];
    verCarrito();
  }
  
  function toastifyVaciarCarrito() {
    Toastify({
      text: `El carrito fue vaciado.`,
      duration: 3000,
      gravity: "top",
      position: "right",
      style : {
        background: "white",
        color: "black",
        'box-shadow': "-8px 9px 73px -14px rgba(0,0,0,0.46)",
      },
    }).showToast();
  }
  
  function finalizarCompra(){
    Swal.fire({
      icon: 'question',
      title: 'Confirmar compra',
      text: '¿Está seguro/a de realizar esta compra?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Comprar',
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarrito();
        camionetaDiv.innerHTML = '';
        Swal.fire('¡Compra realizada con éxito!', 'Su pedido ha sido confirmado. ¡Disfrute de su compra!', 'success')
      }
    })
  }
  
  function cantidadBotonCarrito(){
    carrito.length > 0 ? carritoBtn.value = `Carrito (${carrito.length})` : carritoBtn.value = "Carrito";
  }
const zapatillasKey = "zapatillasData";
let zapatillas = JSON.parse(localStorage.getItem(zapatillasKey)) || [];

const mensajeDiv = document.getElementById("mensaje");
const mensajeListado = document.getElementById("mensajeListado");
const mensajeEliminarContenedor = document.getElementById(
  "mensajeEliminarContenedor"
);

const vistaFormulario = document.getElementById("vistaFormulario");
const vistaListado = document.getElementById("vistaListado");

const zapatillaForm = document.getElementById("zapatillaForm");
const modeloInput = document.getElementById("modelo");
const colorInput = document.getElementById("color");
const talleDesdeInput = document.getElementById("talleDesde");
const talleHastaInput = document.getElementById("talleHasta");
const sinTalleInput = document.getElementById("sinTalle");
const costoInput = document.getElementById("costo");
const envioInput = document.getElementById("envio");
const porcVentaInput = document.getElementById("porcVenta");
const gananciaDiv = document.getElementById("ganancia");
const precioVentaDiv = document.getElementById("precioVenta");
const imagenInput = document.getElementById("imagen");
const tituloFormulario = vistaFormulario.querySelector("h2");

const inputBusqueda = document.getElementById("inputBusqueda");

let botonCancelar = document.getElementById("cancelarEdicion");
if (!botonCancelar) {
  botonCancelar = document.createElement("button");
  botonCancelar.type = "button";
  botonCancelar.id = "cancelarEdicion";
  botonCancelar.style.marginLeft = "10px";
  botonCancelar.style.display = "none";
  botonCancelar.textContent = "Cancelar";
  zapatillaForm
    .querySelector("button[type='submit']")
    .insertAdjacentElement("afterend", botonCancelar);
}

const tablaBody = document.getElementById("tablaBody");

let modoEdicion = false;
let indiceEdicion = null;
let imagenBase64Edicion = null;

function mostrarVista(vista) {
  vistaFormulario.classList.toggle("hidden", vista !== "formulario");
  vistaListado.classList.toggle("hidden", vista !== "listado");
}

function mostrarMensaje(div, texto, tipo = "info") {
  div.textContent = texto;
  div.className = tipo;
  div.style.display = "block";
  setTimeout(() => {
    div.style.display = "none";
  }, 3000);
}
function mostrarModalConfirmacion(mensaje, callbackConfirmar) {
  const modal = document.getElementById("modalConfirmacion");
  const modalMensaje = document.getElementById("modalMensaje");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const btnCancelar = document.getElementById("btnCancelar");

  modalMensaje.innerHTML = mensaje;
  modal.classList.remove("hidden");

  // Limpiar eventos anteriores para evitar múltiples triggers
  btnConfirmar.onclick = null;
  btnCancelar.onclick = null;

  btnConfirmar.onclick = () => {
    modal.classList.add("hidden");
    callbackConfirmar();
  };

  btnCancelar.onclick = () => {
    modal.classList.add("hidden");
  };
}

function calcularGananciaYPrecio() {
  const costo = parseFloat(costoInput.value) || 0;
  const envio = parseFloat(envioInput.value) || 0;
  const porcVenta = parseFloat(porcVentaInput.value) || 0;

  const ganancia = ((costo + envio) * porcVenta) / 100;
  const precioFinal = costo + envio + ganancia;

  gananciaDiv.textContent = `$${ganancia.toFixed(2)}`;
  precioVentaDiv.textContent = `$${precioFinal.toFixed(2)}`;
  return { ganancia, precioFinal };
}

function limpiarFormulario() {
  zapatillaForm.reset();
  gananciaDiv.textContent = "$0.00";
  precioVentaDiv.textContent = "$0.00";
  imagenBase64Edicion = null;
  modoEdicion = false;
  indiceEdicion = null;
  imagenInput.required = true;
  tituloFormulario.textContent = "Agregar Producto";
  botonCancelar.style.display = "none";
  botonSubmit.textContent = "Agregar Producto";
}

function guardarEnLocalStorage() {
  localStorage.setItem(zapatillasKey, JSON.stringify(zapatillas));
}

/**
 * Muestra el listado filtrando por texto (modelo o color)
 * @param {string} filtro texto para filtrar
 */
function mostrarListado(filtro = "") {
  tablaBody.innerHTML = "";

  const filtroLower = filtro.toLowerCase();

  const listaFiltrada = zapatillas.filter((prod) => {
    return (
      prod.modelo.toLowerCase().includes(filtroLower) ||
      prod.color.toLowerCase().includes(filtroLower)
    );
  });

  if (listaFiltrada.length === 0) {
    mostrarMensaje(mensajeListado, "No hay productos que coincidan.", "info");
    return;
  }

  let totalCosto = 0;
  let totalEnvio = 0;
  let totalGanancia = 0;
  let totalPrecioFinal = 0;

  listaFiltrada.forEach((prod, index) => {
    const tr = document.createElement("tr");

    const tdModelo = document.createElement("td");
    tdModelo.textContent = prod.modelo;
    tr.appendChild(tdModelo);

    const tdColor = document.createElement("td");
    tdColor.textContent = prod.color;
    tr.appendChild(tdColor);

    const tdTalles = document.createElement("td");
    tdTalles.textContent =
      `Desde ${prod.talleDesde} hasta ${prod.talleHasta}` +
      (prod.sinTalle ? ` (Sin: ${prod.sinTalle})` : "");
    tr.appendChild(tdTalles);

    const tdCosto = document.createElement("td");
    tdCosto.textContent = `$${parseFloat(prod.costo).toFixed(2)}`;
    tr.appendChild(tdCosto);

    const tdEnvio = document.createElement("td");
    tdEnvio.textContent = `$${parseFloat(prod.envio).toFixed(2)}`;
    tr.appendChild(tdEnvio);

    const tdPorcVenta = document.createElement("td");
    tdPorcVenta.textContent = `${parseFloat(prod.porcVenta).toFixed(2)}%`;
    tr.appendChild(tdPorcVenta);

    const tdGanancia = document.createElement("td");
    tdGanancia.textContent = `$${parseFloat(prod.ganancia).toFixed(2)}`;
    tr.appendChild(tdGanancia);

    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = `$${parseFloat(prod.precioFinal).toFixed(2)}`;
    tr.appendChild(tdPrecio);

    const tdImagen = document.createElement("td");
    if (prod.imagenBase64) {
      const img = document.createElement("img");
      img.src = prod.imagenBase64;
      img.alt = prod.modelo;
      img.style.maxWidth = "50px";
      img.style.maxHeight = "50px";
      tdImagen.appendChild(img);
    } else {
      tdImagen.textContent = "Sin imagen";
    }
    tr.appendChild(tdImagen);

    const tdAccion = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => {
      modoEdicion = true;
      indiceEdicion = zapatillas.indexOf(prod);
      cargarProductoEnFormulario(prod);
      mostrarVista("formulario");
      tituloFormulario.textContent = "Editando producto";
      botonCancelar.style.display = "inline-block";
      botonSubmit.textContent = "Modificar Producto";
      imagenInput.required = false;
    });
    tdAccion.appendChild(btnEditar);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.style.marginLeft = "5px";
    btnEliminar.addEventListener("click", () => {
      mostrarModalConfirmacion(
        `¿Estás seguro de que querés eliminar el producto <strong>${prod.modelo}</strong>?`,
        () => {
          zapatillas.splice(index, 1);
          guardarEnLocalStorage();
          mostrarListado();
          mostrarMensaje(
            mensajeEliminarContenedor,
            "Producto eliminado.",
            "exito"
          );
        }
      );
    });

    tdAccion.appendChild(btnEliminar);

    tr.appendChild(tdAccion);
    tablaBody.appendChild(tr);

    totalCosto += parseFloat(prod.costo);
    totalEnvio += parseFloat(prod.envio);
    totalGanancia += parseFloat(prod.ganancia);
    totalPrecioFinal += parseFloat(prod.precioFinal);
  });

  // fila totales
  const trTotal = document.createElement("tr");
  trTotal.style.fontWeight = "bold";
  trTotal.style.backgroundColor = "#ddd";

  const tdTotalLabel = document.createElement("td");
  tdTotalLabel.textContent = "Totales";
  tdTotalLabel.colSpan = 3; // abarca Modelo, Color, Talles
  trTotal.appendChild(tdTotalLabel);

  const tdTotalCosto = document.createElement("td");
  tdTotalCosto.textContent = `$${totalCosto.toFixed(2)}`;
  trTotal.appendChild(tdTotalCosto);

  const tdTotalEnvio = document.createElement("td");
  tdTotalEnvio.textContent = `$${totalEnvio.toFixed(2)}`;
  trTotal.appendChild(tdTotalEnvio);

  const tdVacio = document.createElement("td");
  trTotal.appendChild(tdVacio); // para % de venta, vacío

  const tdTotalGanancia = document.createElement("td");
  tdTotalGanancia.textContent = `$${totalGanancia.toFixed(2)}`;
  trTotal.appendChild(tdTotalGanancia);

  const tdTotalPrecioFinal = document.createElement("td");
  tdTotalPrecioFinal.textContent = `$${totalPrecioFinal.toFixed(2)}`;
  trTotal.appendChild(tdTotalPrecioFinal);

  const tdVacio2 = document.createElement("td");
  trTotal.appendChild(tdVacio2); // para imagen

  const tdVacio3 = document.createElement("td");
  trTotal.appendChild(tdVacio3); // para acciones

  tablaBody.appendChild(trTotal);
}

function cargarProductoEnFormulario(prod) {
  modeloInput.value = prod.modelo;
  colorInput.value = prod.color;
  talleDesdeInput.value = prod.talleDesde;
  talleHastaInput.value = prod.talleHasta;
  sinTalleInput.value = prod.sinTalle || "";
  costoInput.value = prod.costo;
  envioInput.value = prod.envio;
  porcVentaInput.value = prod.porcVenta;

  gananciaDiv.textContent = `$${parseFloat(prod.ganancia).toFixed(2)}`;
  precioVentaDiv.textContent = `$${parseFloat(prod.precioFinal).toFixed(2)}`;

  imagenBase64Edicion = prod.imagenBase64 || null;
  imagenInput.value = "";
  imagenInput.required = false;
}

function leerImagenComoBase64(inputFile, callback) {
  const archivo = inputFile.files[0];
  if (!archivo) {
    callback(null);
    return;
  }
  const lector = new FileReader();
  lector.onload = function (e) {
    callback(e.target.result);
  };
  lector.readAsDataURL(archivo);
}

function validarFormulario() {
  if (!modeloInput.value.trim() || !colorInput.value.trim()) {
    mostrarMensaje(mensajeDiv, "Modelo y Color son obligatorios.", "error");
    return false;
  }
  if (modoEdicion === false && imagenInput.files.length === 0) {
    mostrarMensaje(mensajeDiv, "La imagen es obligatoria.", "error");
    return false;
  }
  return true;
}

[costoInput, envioInput, porcVentaInput].forEach((input) => {
  input.addEventListener("input", calcularGananciaYPrecio);
});

const botonSubmit = zapatillaForm.querySelector("button[type='submit']");

botonCancelar.addEventListener("click", () => {
  limpiarFormulario();
  mostrarVista("listado");
});

zapatillaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormulario()) return;

  leerImagenComoBase64(imagenInput, (base64) => {
    let imagenFinal = base64;
    if (modoEdicion && !base64) imagenFinal = imagenBase64Edicion;

    const { ganancia, precioFinal } = calcularGananciaYPrecio();
    const producto = {
      modelo: modeloInput.value.trim(),
      color: colorInput.value.trim(),
      talleDesde: parseInt(talleDesdeInput.value),
      talleHasta: parseInt(talleHastaInput.value),
      sinTalle: sinTalleInput.value.trim(),
      costo: parseFloat(costoInput.value),
      envio: parseFloat(envioInput.value),
      porcVenta: parseFloat(porcVentaInput.value),
      ganancia,
      precioFinal,
      imagenBase64: imagenFinal,
    };

    if (modoEdicion) {
      zapatillas[indiceEdicion] = producto;
      mostrarMensaje(mensajeDiv, "Producto modificado con éxito.", "exito");
    } else {
      zapatillas.push(producto);
      mostrarMensaje(mensajeDiv, "Producto agregado con éxito.", "exito");
    }

    guardarEnLocalStorage();
    limpiarFormulario();
    mostrarListado(inputBusqueda.value);
    mostrarVista("listado");
  });
});

inputBusqueda.addEventListener("input", () => {
  mostrarListado(inputBusqueda.value);
});

// Mostrar listado inicial sin filtro
mostrarListado();

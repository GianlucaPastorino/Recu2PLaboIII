import { actualizarTabla } from "./tabla.js";
import { Superheroe } from "./superheroe.js";
import { LeerData, GuardarData } from "./localStorage.js";
import { getSuperheroes, createSuperheroe, deleteSuperheroe, updateSuperheroe } from "./accesoDatos.js";

const armas = [
  "Armadura",
  "Espada",
  "Martillo",
  "Escudo",
  "Arma de Fuego",
  "Flechas",
];
GuardarData("armas", armas);

const $selectArmas = document.getElementById("selectArmas");
const armasStorage = LeerData("armas");

armasStorage.forEach((arma) => {
  $selectArmas.innerHTML += `<option value="${arma}">${arma}</option>`;
});

let superheroes = [];
const $tabla = document.getElementById("tabla");
const $formulario = document.forms[0];
const $promedio = document.getElementById("txtPromedio");
const $maximo = document.getElementById("txtMaximo");
const $minimo = document.getElementById("txtMinimo");
const $spinner = document.getElementById("spinner");
const $btnCancelar = document.getElementById("cancelar");
const $btnEliminar = document.getElementById("eliminar");
const $filtros = document.getElementById("filtros"); // Opciones combobox "filtrar editorial".
const $checkboxFiltros = document.querySelectorAll(".check"); // Todos los checkbox para tabla.

/*** MANEJADORES DE EVENTOS ***/

window.addEventListener("load", async() => {
  $spinner.classList.remove("ocultar");
  superheroes = await getSuperheroes();
  $spinner.classList.add("ocultar");
  if (superheroes.length) {
    actualizarTabla($tabla, superheroes);
    $promedio.value = CalcularPromedio(superheroes);
    $maximo.value = CalcularMaximo(superheroes);
    $minimo.value = CalcularMinimo(superheroes);
  } else {
    $tabla.insertAdjacentHTML(
      "afterbegin",
      `<p>No se encontraron superheroes.</p>`
    )
  }
  CargarFiltros();
}
);

window.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    const id = e.target.parentElement.dataset.id;

    const selectedSuperheroe = superheroes.find(
      (superheroe) => superheroe.id == id
    );
    cargarFormulario($formulario, selectedSuperheroe);
    MostrarBotonesEliminarCancelar();
  } else if (e.target.matches("input[value='Eliminar']")) {
    deleteSuperheroe(parseInt($formulario.txtId.value));
    $tabla.classList.add("ocultar");
    $formulario.reset();
    $formulario.txtId.value = "";
    OcultarBotonesEliminarCancelar();
  } else if (e.target.matches("input[value='Cancelar']")) {
    $formulario.reset();
    $formulario.txtId.value = "";
    OcultarBotonesEliminarCancelar();
  }
});

$formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const { txtId, txtNombre, rangeFuerza, txtAlias, rdoEditorial, selectArma } =
    $formulario;

  if (
    txtNombre.value.length < 100 &&
    txtAlias.value.length < 100 &&
    txtNombre.value.length > 0 &&
    txtAlias.value.length > 0 &&
    isNaN(txtNombre.value) &&
    isNaN(txtAlias.value)
  ) {
    if (txtId.value === "") {
      const nuevoSuperheroe = new Superheroe(
        Date.now(),
        txtNombre.value,
        parseInt(rangeFuerza.value),
        txtAlias.value,
        rdoEditorial.value,
        selectArma.value
      );
      createSuperheroe(nuevoSuperheroe);
      $tabla.classList.add("ocultar");
    } else {
      const superheroeActualizado = new Superheroe(
        parseInt(txtId.value),
        txtNombre.value,
        parseInt(rangeFuerza.value),
        txtAlias.value,
        rdoEditorial.value,
        selectArma.value
      );
      
      updateSuperheroe(parseInt(txtId.value), superheroeActualizado);
      $tabla.classList.add("ocultar");
      $btnCancelar.classList.toggle("ocultar");
      $btnEliminar.classList.toggle("ocultar");
    }

    $formulario.reset();
  } else {
    alert("Verifique los datos ingresados.");
  }
});

$filtros.addEventListener("change", () => {
  let lista;
  if (superheroes.length > 0) {
    lista = handlerFiltros(handlerCheckbox(superheroes));
    actualizarTabla($tabla, lista);

    if (lista.length > 0) {
      $promedio.value = CalcularPromedio(handlerFiltros(superheroes));
      $minimo.value = CalcularMinimo(handlerFiltros(superheroes));
      $maximo.value = CalcularMaximo(handlerFiltros(superheroes));
    } else {
      $promedio.value = "";
      $maximo.value = "";
      $minimo.value = "";
      $tabla.insertAdjacentHTML(
        "afterbegin",
        `<p>No se encontraron superheroes.</p>`
      );
    }
  }
});

$checkboxFiltros.forEach((element) =>
  element.addEventListener("click", () => {
    actualizarTabla($tabla, handlerCheckbox(handlerFiltros(superheroes)));
    GuardarFiltros();
  })
);

/*** Otras Funciones ***/

function cargarFormulario(formulario, superheroe) {
  formulario.txtId.value = superheroe.id;
  formulario.txtNombre.value = superheroe.nombre;
  formulario.rangeFuerza.value = superheroe.fuerza;
  formulario.txtAlias.value = superheroe.alias;
  formulario.rdoEditorial.value = superheroe.editorial;
  formulario.selectArma.value = superheroe.arma;
}

function MostrarBotonesEliminarCancelar() {
  if (
    $btnCancelar.classList.contains("ocultar") &&
    $btnEliminar.classList.contains("ocultar")
  ) {
    $btnCancelar.classList.remove("ocultar");
    $btnEliminar.classList.remove("ocultar");
  }
}

function OcultarBotonesEliminarCancelar() {
  if (
    !$btnCancelar.classList.contains("ocultar") &&
    !$btnEliminar.classList.contains("ocultar")
  ) {
    $btnCancelar.classList.add("ocultar");
    $btnEliminar.classList.add("ocultar");
  }
}

/*** REDUCE, MAP, FILTER ***/

function CalcularPromedio(lista) {
  return (
    lista.reduce((previo, actual) => {
      return previo + actual.fuerza;
    }, 0) / lista.length
  );
}

function CalcularMaximo(lista) {
  return (lista.reduce((previo, actual) => {
      return previo >= actual.fuerza ? previo : actual.fuerza;
    }, 0));
}

function CalcularMinimo(lista) {
  return (
    lista.reduce((previo, actual) => {
      return previo < actual.fuerza ? previo : actual.fuerza;
    }, CalcularMaximo(lista))
  );
}

function handlerFiltros(lista) {
  let filtrada;
  switch ($filtros.value) {
    case "DC Comics":
      filtrada = lista.filter((sup) => sup.editorial === "DC");
      break;
    case "Marvel":
      filtrada = lista.filter((sup) => sup.editorial === "Marvel");
      break;
    default:
      filtrada = lista;
      break;
  }
  return filtrada;
}

function handlerCheckbox(lista) {
  const filtros = {};

  $checkboxFiltros.forEach((item) => {
    filtros[item.name] = item.checked;
  });

  return lista.map((item) => {
    const map = {};
    for (const key in item) {
      if (filtros[key] || key == "id") {
        map[key] = item[key];
      }
    }
    return map;
  });
}

  /******/

function GuardarFiltros()
{
  const filtros = {};
  $checkboxFiltros.forEach((item) => {
    filtros[item.name] = item.checked;
  });
  GuardarData("filtrosPastorino", filtros);
}

function CargarFiltros()
{
    const f = LeerData("filtrosPastorino");
    if(f.length !== [])
    {
      $checkboxFiltros.forEach((item) => {
        if(f[item.name] == false){
          item.removeAttribute("checked");
        }
      });
    } 
}

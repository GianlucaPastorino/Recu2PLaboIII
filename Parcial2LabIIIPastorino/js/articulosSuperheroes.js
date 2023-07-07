import { getSuperheroes } from "./accesoDatos.js";

const superheroes = await getSuperheroes();
const $articulos = document.getElementById("articulos");
const $spinner = document.getElementById("spinner2");
$spinner.classList.add("ocultar");

if(superheroes.length)
{
        superheroes.forEach(superheroe => 
        {
            $articulos.insertAdjacentHTML("beforeend",
            `<article>
                <p>Nombre: ${superheroe.nombre}</p>
                <p><i class="fa-solid fa-mask text-white"></i> Alias: ${superheroe.alias}</p>
                <p><i class="fa-solid fa-book text-white"></i> Editorial: ${superheroe.editorial}</p>
                <p><i class="fa-solid fa-dumbbell text-white"></i> Fuerza: ${superheroe.fuerza}</p>
                <p><i class="fa-solid fa-shield text-white"></i> Arma: ${superheroe.arma}</p>
            </article>`);
        });
}
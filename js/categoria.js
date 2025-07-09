import { API_URL } from "./config.js";


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Obtén los toggles y los menús móviles por separado
    const menuToggleLogueado = document.getElementById("menuToggleLogueado");
    const menuToggleAnonimo = document.getElementById("menuToggleAnonimo");

    const menuMovilLogueado = document.getElementById("menuMovilLogueado");
    const menuMovilAnonimo = document.getElementById("menuMovilAnonimo");

    if (token) {
        document.getElementById("headerLogueado").style.display = "flex";
        document.getElementById("headerAnonimo").style.display = "none";

        if (menuToggleLogueado && menuMovilLogueado) {
            menuToggleLogueado.addEventListener("click", () => {
                menuMovilLogueado.classList.toggle("activo");
            });
        }

        const btnCerrar = document.getElementById("cerrarSesionBtn");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("idUsuario");
                window.location.reload();
            });
        }

    } else {
        document.getElementById("headerLogueado").style.display = "none";
        document.getElementById("headerAnonimo").style.display = "flex";

        if (menuToggleAnonimo && menuMovilAnonimo) {
            menuToggleAnonimo.addEventListener("click", () => {
                menuMovilAnonimo.classList.toggle("activo");
            });
        }
    }
});


//busqueda

document.addEventListener("DOMContentLoaded", function () {
    const campos = document.querySelectorAll(".textarea__header");
    const botones = document.querySelectorAll(".boton__buscar");

    // Suponiendo que cada campo tiene su botón correspondiente en el mismo orden
    campos.forEach((campo, index) => {
        const boton = botones[index];

        if (boton) {
            boton.addEventListener("click", function () {
                const termino = campo.value.trim();
                if (termino !== "") {
                    window.location.href = `busqueda.html?query=${encodeURIComponent(termino)}`;
                }
            });

            campo.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    boton.click();
                }
            });
        }
    });
});


document.addEventListener("DOMContentLoaded", async function () {

    const params = new URLSearchParams(window.location.search);
    const genero = params.get("genero");

    // Si no hay género, usa uno por defecto o redirige
    if (!genero) {
        document.getElementById("tituloGenero").textContent = "Género desconocido";
        return;
    }

    // Formatea la palabra (opcional: convierte a mayúscula la primera letra)
    const generoFormateado = genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase();

    document.getElementById("tituloGenero").textContent = generoFormateado;

    // Aquí puedes seguir con el fetch, por ejemplo:
    // fetch(`${API_URL}/historia/genero/${genero}`)


    try {
        const respuesta = await fetch(API_URL + "/historia/genero/" + genero);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las portadas");
        }

        const resultado = await respuesta.json();
        const historias = resultado.content;
        const galeria = document.getElementById("galeriaGenero");

        if (!Array.isArray(historias)) {
            galeria.innerHTML = "<p>No se pudo cargar la galería de historias.</p>";
            console.error("Respuesta inesperada del backend:", resultado);
            return;
        }

        if (historias.length === 0) {
            galeria.innerHTML = "<p>No hay historias aún.</p>";
            return;
        }

        historias.forEach(historia => {
            if (!historia.portada) return;

            const nombreArchivo = extraerNombreArchivo(historia.portada);

            const enlace = document.createElement("a");
            enlace.href = `libro.html?id=${historia.id}`;
            enlace.classList.add("portada");

            const img = document.createElement("img");
            img.src = `${API_URL}/uploads/${nombreArchivo}`;
            img.alt = historia.titulo;
            img.classList.add("portada");

            enlace.appendChild(img);
            galeria.appendChild(enlace);
        });
    } catch (error) {
        document.getElementById("galeriaPortadas").innerHTML = `<p class="error">${error.message}</p>`;
        console.error(error);
    }

    function extraerNombreArchivo(ruta) {
        return ruta.split("\\").pop();
    }
});



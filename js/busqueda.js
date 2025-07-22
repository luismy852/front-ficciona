import { API_URL } from "./config.js";


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        document.getElementById("headerLogueado").style.display = "flex";
        document.getElementById("headerAnonimo").style.display = "none";
    } else {
        document.getElementById("headerLogueado").style.display = "none";
        document.getElementById("headerAnonimo").style.display = "flex";
    }

    // Botón de cerrar sesión
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("idUsuario");
            window.location.reload();
        });
    }
});

const btnCerrarWeb = document.getElementById("cerrarSesionBtn");
const btnCerrarMovil = document.getElementById("cerrarSesionMovil");

[btnCerrarWeb, btnCerrarMovil].forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("idUsuario");
      window.location.reload(); // O redirecciona a login si prefieres
    });
  }
});


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

document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("contenedorHistorias");

    // ✅ Obtener el término de búsqueda de la URL
    const params = new URLSearchParams(window.location.search);
    const terminoBusqueda = params.get("query");

    // ✅ Mostrar mensaje mientras carga
    contenedor.innerHTML = "<p>Buscando historias...</p>";

    fetch(API_URL + `/historia/busqueda/${encodeURIComponent(terminoBusqueda)}`)
        .then(response => response.json())
        .then(data => {
            contenedor.innerHTML = ""; // limpia contenido previo

            if (data.length === 0) {
                contenedor.innerHTML = "<p>No se encontraron historias.</p>";
                return;
            }

            data.forEach(historia => {
                const card = document.createElement("div");
                card.classList.add("historia__card");

                let rutaImagen = "Imagenes/imagen-default.png"; // imagen por defecto

                if (historia.portada) {
                    rutaImagen = API_URL + "/uploads/" + historia.portada;
                }

                card.innerHTML = `
        <img class="imagen__historia" src="${rutaImagen}" alt="Portada de ${historia.titulo}">
        <div>
            <a class="titulo__historia">${historia.titulo}</a>
            <p class="descripcion__historia">${historia.descripcion}</p>
            <a class="boton1" href="/historia/${historia.id}">Leer</a>
        </div>
    `;

                contenedor.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar historias:", error);
            contenedor.innerHTML = "<p>No se pudieron cargar las historias.</p>";
        });
});
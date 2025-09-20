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
    try {
        const res = await fetch(API_URL + "/historia/reto/ranking");
        const ranking = await res.json();
        const contenedor = document.querySelector(".ranking__reto__contenedor");
        if (!contenedor) return;

        // Limpiar el contenedor antes de agregar los rankings
        contenedor.innerHTML = "";

        ranking.forEach((historia, idx) => {
            const div = document.createElement("div");
            div.classList.add("ranking__reto");

            div.innerHTML = `
                <p class="ranking">#${idx + 1}</p>
                <img class="ranking__imagen" src="${API_URL}/uploads/${historia.portada}" alt="">
                <div class="ranking__historia">
                    <h2 class="ranking__titulo">${historia.titulo}</h2>
                    <a class="ranking__autor" href="perfil.html?id=${historia.idAutor}">${historia.autor}</a>
                    <p class="ranking__texto">${historia.descripcion}</p>
                    <a class="ranking__boton" href="libro.html?id=${historia.id}">Leer</a>
                </div>
            `;
            // Manejo de error de imagen
            const img = div.querySelector(".ranking__imagen");
            img.onerror = function () {
                this.onerror = null;
                this.src = "Imagenes/predefinido.png";
            };

            contenedor.appendChild(div);
        });
    } catch (e) {
        const contenedor = document.querySelector(".ranking__reto__contenedor");
        if (contenedor) {
            contenedor.innerHTML = "<p>No se pudo cargar el ranking del reto.</p>";
        }
    }
});



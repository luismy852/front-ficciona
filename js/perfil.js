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
    // Obtener idUsuario de la URL
    const params = new URLSearchParams(window.location.search);
    const idUsuario = params.get("id");
    if (!idUsuario) return;

    try {
        const res = await fetch(`${API_URL}/historia/${idUsuario}`);
        const historias = await res.json();

        // Cambiar el h1 por el autor si hay historias
        if (historias.length > 0 && historias[0].autor) {
            const h1 = document.querySelector("h1.autor__perfil");
            if (h1) {
                const autor = historias[0].autor;
                h1.textContent = autor.charAt(0).toUpperCase() + autor.slice(1);
            }
        }

        // Poner las portadas en #galeriaGenero
        const galeria = document.getElementById("galeriaGenero");
        if (galeria) galeria.innerHTML = ""; // Limpiar galería

        historias.forEach(historia => {
            const nombreArchivo = historia.portada ? historia.portada.split("\\").pop() : "";
            const enlace = document.createElement("a");
            enlace.href = `libro.html?id=${historia.id}`;
            enlace.classList.add("enlacePortada");

            const img = document.createElement("img");
            img.src = API_URL + `/uploads/${nombreArchivo}`;
            img.alt = historia.titulo;
            img.classList.add("portada");

            img.onerror = function () {
                this.onerror = null;
                this.src = "/Imagenes/predefinido.png";
            };

            enlace.appendChild(img);
            galeria.appendChild(enlace);
        });
    } catch (e) {
        const galeria = document.getElementById("galeriaGenero");
        if (galeria) galeria.innerHTML = "<p>No se pudieron cargar las historias del usuario.</p>";
    }
});

import { API_URL } from "./config.js";


document.addEventListener("DOMContentLoaded", function () {
    // Obtén los toggles y los menús móviles por separado
    const menuToggleLogueado = document.getElementById("menuToggleLogueado");
    const menuMovilLogueado = document.getElementById("menuMovilLogueado");

    if (menuToggleLogueado && menuMovilLogueado) {
        menuToggleLogueado.addEventListener("click", () => {
            menuMovilLogueado.classList.toggle("activo");
        });
    }
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

document.addEventListener("DOMContentLoaded", function () {
    const usuarioId = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!usuarioId || !token) {
        console.warn("⚠️ Usuario no autenticado");
        return;
    }

    fetch(API_URL + `/progreso/${usuarioId}`, {
        headers: {
            Authorization: token
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener lecturas");
            return res.json();
        })
        .then(data => {
            const main = document.querySelector("main");

            if (!data.length) {
                const sinLecturas = document.createElement("p");
                sinLecturas.textContent = "No tienes lecturas en progreso.";
                sinLecturas.classList.add("sinlectura");
                main.appendChild(sinLecturas);
                return;
            }

            // Crear un contenedor general para todas las lecturas
            const contenedor = document.createElement("div");
            contenedor.classList.add("lectura");
            contenedor.id = `galeriaGenero`; // o algún valor único del objeto


            data.forEach(item => {
                const link = document.createElement("a");
                link.classList.add("portada");
                link.href = `capitulo.html?id=${item.historiaId}&capitulo=${item.capituloId}`;

                const img = document.createElement("img");
                const nombreArchivo = item.portada.split("\\").pop(); // Corregir ruta de archivo
                img.src = `${API_URL}/uploads/${nombreArchivo}`;
                img.alt = item.tituloHistoria;
                img.classList.add("portada");

                link.appendChild(img);
                contenedor.appendChild(link);
            });

            main.appendChild(contenedor);
        })
        .catch(err => {
            console.error("❌ Error al cargar lecturas:", err.message);
        });
});

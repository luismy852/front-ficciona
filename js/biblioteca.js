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

    const btnCerrar = document.getElementById("cerrarSesionBtn");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("idUsuario");
            window.location.reload();
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
                main.appendChild(sinLecturas);
                return;
            }

            data.forEach(item => {
                const contenedor = document.createElement("div");
                contenedor.classList.add("lectura");

                const link = document.createElement("a");
                link.href = `capitulo.html?id=${item.historiaId}&capitulo=${item.capituloId}`;

                const img = document.createElement("img");
                const nombreArchivo = item.portada.split("\\").pop(); // corregir la ruta
                img.src = `${API_URL}/uploads/${nombreArchivo}`;
                img.alt = item.tituloHistoria;
                img.classList.add("portada");

                link.appendChild(img);
                contenedor.appendChild(link);
                main.appendChild(contenedor);
            });
        })
        .catch(err => {
            console.error("❌ Error al cargar lecturas:", err.message);
        });
});

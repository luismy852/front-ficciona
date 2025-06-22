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


// Cargar las portadas de las historias al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const respuesta = await fetch(API_URL + "/historia/ult");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las portadas");
        }

        const historias = await respuesta.json();
        const galeria = document.getElementById("galeriaPortadas");

        if (historias.length === 0) {
            galeria.innerHTML = "<p>No hay historias aún.</p>";
            return;
        }

        historias.forEach(historia => {
            const nombreArchivo = extraerNombreArchivo(historia.portada);

            const enlace = document.createElement("a");
            enlace.href = `libro.html?id=${historia.id}`;
            enlace.classList.add("enlacePortada");

            const img = document.createElement("img");
            img.src = `https://api.ficciona.co/uploads/${nombreArchivo}`;
            img.alt = historia.titulo;
            img.classList.add("portada");

            enlace.appendChild(img);
            galeria.appendChild(enlace);
        });
    } catch (error) {
        document.getElementById("galeriaPortadas").innerHTML = `<p class="error">${error.message}</p>`;
    }

    function extraerNombreArchivo(ruta) {
        return ruta.split("\\").pop();
    }
});


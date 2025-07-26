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


// 1. Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const historiaId = params.get("id");

const idHistoria = historiaId; // este es el ID que ya tienes
const enlace = document.querySelector("a.añadir");


if (historiaId) {
    fetch(API_URL + `/historia/porid/${historiaId}`)
        .then(response => response.json())
        .then(data => {
            // 2. Rellenar la información de la historia
            document.querySelector(".titulo__panel").textContent = data.titulo;
            document.querySelector(".descripcion__panel").textContent = data.descripcion;
               // Cambiar el <title> de la página
            document.title = data.titulo;


            // Si hay portada, mostrarla
            const img = document.querySelector(".imagen__panel");
            if (data.portada) {
                const nombreArchivo = data.portada.split("\\").pop();
                img.src = API_URL + `/uploads/${nombreArchivo}`;
                            img.onerror = function () {
    this.onerror = null;
    this.src = "/imagenes/predefinido.png";
};
            }

            // 3. Mostrar capítulos
            const contenedorCapitulos = document.querySelector(".capitulo__contenedor");
            contenedorCapitulos.innerHTML = ""; // Limpiar si ya hay algo

            data.capitulos.forEach(capitulo => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <div>
                        <h3>${capitulo.titulo}</h3>
                    </div>
                        <div>
                    <a href="capitulo.html?id=${historiaId}&capitulo=${capitulo.id}">
                        <img src="Imagenes/leer.png" alt="">
                    </a>
                    </div>

                `;
                div.classList.add("capitulo__contenedor");
                contenedorCapitulos.parentNode.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error al cargar la historia:", error);
        });
} else {
    console.error("No se encontró el ID en la URL.");
}

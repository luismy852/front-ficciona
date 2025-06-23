import { API_URL } from "./config.js";

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

            // Si hay portada, mostrarla
            const img = document.querySelector(".imagen__panel");
            if (data.portada) {
                const nombreArchivo = data.portada.split("\\").pop();
                img.src = API_URL + `/uploads/${nombreArchivo}`;
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

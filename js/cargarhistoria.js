// 1. Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const historiaId = params.get("id");

const idHistoria = historiaId; // este es el ID que ya tienes
const enlace = document.querySelector("a.añadir");
enlace.href = `editar.html?id=${idHistoria}`;


if (historiaId) {
    fetch(`http://localhost:8080/historia/porid/${historiaId}`)
        .then(response => response.json())
        .then(data => {
            // 2. Rellenar la información de la historia
            document.querySelector(".titulo__panel").textContent = data.titulo;
            document.querySelector(".descripcion__panel").textContent = data.descripcion;

            // Si hay portada, mostrarla
            const img = document.querySelector(".imagen__panel");
            if (data.portada) {
                const nombreArchivo = data.portada.split("\\").pop();
                img.src = `http://localhost:8080/uploads/${nombreArchivo}`;
            }

            // 3. Mostrar capítulos
            const contenedorCapitulos = document.querySelector(".capitulo__contenedor");
            contenedorCapitulos.innerHTML = ""; // Limpiar si ya hay algo

            data.capitulos.forEach(capitulo => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <div>
                        <h3>${capitulo.titulo}</h3>
                        <p>Estado: ${capitulo.publicado ? "Publicado" : "Borrador"} - ${capitulo.fechaPublicado}</p>
                    </div>
                    <div>
                        <a href="#"><img src="Imagenes/editar.png" alt=""></a>
                        <a href="#"><img src="Imagenes/borrar.png" alt=""></a>
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

document.addEventListener("DOMContentLoaded", function () {
    const usuarioId = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!usuarioId || !token) {
        console.warn("⚠️ Usuario no autenticado");
        return;
    }

    fetch(`http://localhost:8080/progreso/${usuarioId}`, {
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
                img.src = `http://localhost:8080/uploads/${nombreArchivo}`;
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

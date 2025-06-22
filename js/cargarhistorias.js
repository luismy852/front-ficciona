fetch("https://api.ficciona.co/historia/" + localStorage.getItem("idUsuario"))
    .then(response => response.json())
    .then(data => {
        const contenedor = document.getElementById("contenedorHistorias");

        data.forEach(historia => {
            // Crear el contenedor de la tarjeta
            const div = document.createElement("div");
            div.classList.add("historia__card"); // <--- aquí el cambio

            // Crear la imagen
            const img = document.createElement("img");
            img.classList.add("imagen__historia");

            if (historia.portada) {
                const nombreArchivo = historia.portada.split("\\").pop();
                img.src = "https://api.ficciona.co/uploads/" + nombreArchivo;
            } else {
                img.src = "Imagenes/portada.png";
            }

            img.alt = historia.titulo || "Portada";

            // Contenido de texto
            const contenido = document.createElement("div");

            const h3 = document.createElement("h3");
            h3.classList.add("titulo__historia");
            h3.textContent = historia.titulo;

            const p = document.createElement("p");
            p.classList.add("descripcion__historia");
            p.textContent = historia.descripcion;

            // Botones
            const ver = document.createElement("a");
            ver.classList.add("boton1");
            ver.href = "#";
            ver.textContent = "Ver";

            const editar = document.createElement("a");
            editar.classList.add("boton2");
            editar.href = `panelhistoria.html?id=${historia.id}`;
            editar.textContent = "Escribir";

            const eliminar = document.createElement("a");
            eliminar.classList.add("boton3");
            eliminar.href = "#";
            eliminar.textContent = "Eliminar";

            // Añadir contenido
            contenido.append(h3, p, ver, editar, eliminar);
            div.append(img, contenido);
            contenedor.appendChild(div);
        });
    })
    .catch(error => {
        console.error("Error al cargar las historias:", error);
    });

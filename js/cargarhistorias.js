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


fetch(API_URL + "/historia/" + localStorage.getItem("idUsuario"))
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
                console.log(data)
                const nombreArchivo = historia.portada.split("\\").pop();
                img.src = API_URL + "/uploads/" + historia.portada;
                console.log("Imagen cargada:", img.src);

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

import { API_URL } from "./config.js";

const token = localStorage.getItem("token");


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
      window.location.href = "index.html"; // Redirige a index.html
    });
  }
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
            contenido.classList.add("card__contenido");

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
            eliminar.addEventListener("click", (e) => {
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro que deseas eliminar esta historia?\n\n⚠️ Esto solo la hará privada y no será visible para otros hasta que publiques un nuevo capítulo.");

    if (confirmacion) {
        fetch(`${API_URL}/historia/publicado/${historia.id}`, {
            method: "PATCH",
                   headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                alert("✅ La historia ahora es privada.");
                location.reload(); // o puedes eliminar visualmente la tarjeta si no quieres recargar
            } else {
                alert("❌ No se pudo hacer privada la historia.");
            }
        })
        .catch(error => {
            console.error("Error al despublicar:", error);
            alert("❌ Ocurrió un error.");
        });
    }
});


            // Añadir contenido
            contenido.append(h3, p, ver, editar, eliminar);
            div.append(img, contenido);
            contenedor.appendChild(div);
        });
    })
    .catch(error => {
        console.error("Error al cargar las historias:", error);
    });


document.addEventListener("DOMContentLoaded", async function () {
    // Lógica para el botón de reto
    setTimeout(async () => {
        try {
            const res = await fetch(API_URL + "/historia/reto");
            const data = await res.json();
            // Si la respuesta tiene id y nombreReto, actualiza el href y el h1
            if (data && data.id && data.nombreReto) {
                const botonReto = document.querySelector(".boton__reto");
                if (botonReto) {
                    botonReto.setAttribute("href", `crearreto.html?id=${data.id}`);
                }
                const h1Reto = document.querySelector(".titulo__reto");
                if (h1Reto) {
                    h1Reto.textContent += ` ${data.nombreReto}`;
                }
            }
        } catch (e) {
            // Silenciar error, no hay reto disponible
        }
    }, 0);
});

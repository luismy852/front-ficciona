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
            console.log(data);
            // 2. Rellenar la información de la historia
            document.querySelector(".titulo__panel").textContent = data.titulo;
            document.querySelector(".descripcion__panel").textContent = data.descripcion;
            document.querySelector(".autor").textContent = data.autor;
            document.querySelector(".autor").href = `perfil.html?id=${data.idAutor}`;
               // Cambiar el <title> de la página
            document.title = data.titulo;


            // Si hay portada, mostrarla
            const img = document.querySelector(".imagen__panel");
            if (data.portada) {
                const nombreArchivo = data.portada.split("\\").pop();
                img.src = API_URL + `/uploads/${nombreArchivo}`;
                            img.onerror = function () {
    this.onerror = null;
    this.src = "/Imagenes/predefinido.png";
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

// Función para establecer el estado inicial del corazón según si ya votó o no
async function setEstadoCorazon() {
    const corazonImg = document.querySelector(".corazon");
    const idUsuario = localStorage.getItem("idUsuario");
    if (!corazonImg || !idUsuario || !idHistoria) return;
    try {
        const res = await fetch(`${API_URL}/historia/voto/${idHistoria}/${idUsuario}`, {
            method: "GET"
        });
        const yaVoto = await res.json();
        if (yaVoto === true) {
            corazonImg.src = "Imagenes/corazon.png";
        } else {
            corazonImg.src = "Imagenes/me-gusta.png";
        }
    } catch (e) {
        corazonImg.src = "Imagenes/me-gusta.png";
    }
}

setEstadoCorazon();

// Cambiar imagen de corazón al hacer click (toggle) y hacer petición POST al dar "me gusta"
const corazonImg = document.querySelector(".corazon");
if (corazonImg) {
    corazonImg.addEventListener("click", async function () {
        const idUsuario = localStorage.getItem("idUsuario");
        const token = localStorage.getItem("token");
        if (this.src.includes("me-gusta.png")) {
            if (!token) {
                alert("Debes tener una cuenta para votar");
                return;
            }
            if (idUsuario && idHistoria) {
                try {
                    const res = await fetch(API_URL + "/historia/voto", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        },
                        body: JSON.stringify({
                            historia: { id: idHistoria },
                            usuario: { id: idUsuario }
                        })
                    });
                    if (res.status === 400) {
                        alert("Debes verificar tu correo electrónico para votar.");
                        return;
                    }
                } catch (e) {
                    console.error("Error al registrar el voto:", e);
                }
            }
            this.src = "Imagenes/corazon.png";
        } else {
            // Si está en corazon.png, eliminar el voto
            if (!token) {
                alert("Debes tener una cuenta para quitar el voto");
                return;
            }
            if (idUsuario && idHistoria) {
                try {
                    await fetch(`${API_URL}/historia/voto/${idUsuario}/${idHistoria}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": token
                        }
                    });
                } catch (e) {
                    console.error("Error al eliminar el voto:", e);
                }
            }
            this.src = "Imagenes/me-gusta.png";
        }
    });
}




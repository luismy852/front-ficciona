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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recuperacionForm");
    const claveInput = document.getElementById("password");
    const repetirClaveInput = document.getElementById("passwordTwo");
    const mensaje = document.getElementById("errorMensaje");

    if (form && claveInput && repetirClaveInput && mensaje) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const clave = claveInput.value.trim();
            const repetirClave = repetirClaveInput.value.trim();

            if (clave !== repetirClave) {
                mensaje.style.color = "red";
                mensaje.textContent = "Las contraseñas no coinciden.";
                return;
            }

            // Obtener token y idUsuario de la URL
            const params = new URLSearchParams(window.location.search);
            const tokenUrl = params.get("codigo");
            const idUsuario = params.get("id");

            if (!tokenUrl || !idUsuario) {
                mensaje.style.color = "red";
                mensaje.textContent = "Faltan datos para cambiar la contraseña.";
                return;
            }

            try {
                const res = await fetch(API_URL + "/recuperar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idUsuario: parseInt(idUsuario),
                        token: tokenUrl,
                        clave: clave,
                        repetirClave: repetirClave
                    })
                });

                if (res.ok) {
                    mensaje.style.color = "green";
                    mensaje.textContent = "Contraseña cambiada correctamente. Ya puedes iniciar sesión.";
                } else {
                    mensaje.style.color = "red";
                    mensaje.textContent = "No se pudo cambiar la contraseña. Intenta de nuevo.";
                }
            } catch (err) {
                mensaje.style.color = "red";
                mensaje.textContent = "Ocurrió un error al cambiar la contraseña.";
            }
        });
    }
});



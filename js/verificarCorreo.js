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

document.addEventListener("DOMContentLoaded", async function () {
    // Verificación de correo
    const verificandoDiv = document.getElementById("verificandoDiv");
    const exitoDiv = document.getElementById("exitoDiv");
    const errorDiv = document.getElementById("errorDiv");

    if (verificandoDiv && exitoDiv && errorDiv) {
        verificandoDiv.style.display = "flex";
        exitoDiv.style.display = "none";
        errorDiv.style.display = "none";

        const params = new URLSearchParams(window.location.search);
        const codigo = params.get("codigo");
        const id = params.get("id");

        if (!codigo || !id) {
            verificandoDiv.style.display = "none";
            errorDiv.style.display = "flex";
            return;
        }

        try {
            const res = await fetch(API_URL + `/verificar/${codigo}/${id}`);
            if (res.ok) {
                verificandoDiv.style.display = "none";
                exitoDiv.style.display = "flex";
            } else {
                verificandoDiv.style.display = "none";
                errorDiv.style.display = "flex";
            }
        } catch (e) {
            verificandoDiv.style.display = "none";
            errorDiv.style.display = "flex";
        }
    }
});



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
    const form = document.getElementById("creacionNueva");
    const imagenInput = document.getElementById("imagen");
    const preview = document.getElementById("preview");

    // Mostrar vista previa de imagen
    imagenInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = "none";
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const descripcion = document.getElementById("descripcion").value;
        const genero = document.getElementById("categoria").value;
        const imagen = imagenInput.files[0];

        const token = localStorage.getItem("token");
        const idUsuario = localStorage.getItem("idUsuario");

        const formData = new FormData();
        formData.append("file", imagen);

        // ⚠️ Aquí armamos el JSON como texto plano
        const jsonData = {
            usuario: { id: parseInt(idUsuario) }, // puedes reemplazar 1 por el ID real
            titulo: titulo,
            descripcion: descripcion,
            genero: genero,
            publicado: false
        };
        console.log(token);

        console.log("Datos JSON:", jsonData); // Para depuración

        formData.append("json", JSON.stringify(jsonData));

        fetch(API_URL + "/historia/crear", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    alert("Historia creada exitosamente");
                    form.reset();
                    preview.style.display = "none";
                    window.location.href = "panel.html"
                } else {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error al crear el capítulo.");
            });
    });
});

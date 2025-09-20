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
      window.location.href = "index.html"; // Redirige a index.html
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("creacionNueva");
    const imagenInput = document.getElementById("imagen");
    const preview = document.getElementById("preview");

// Validar proporción 2:3 y mostrar vista previa si es válida
imagenInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        // Validar tamaño menor a 5MB
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
            alert("La imagen debe pesar menos de 5MB.");
            imagenInput.value = ""; // limpia selección
            preview.style.display = "none";
            return;
        }

        const img = new Image();
        img.onload = function () {
            const aspectRatio = this.width / this.height;
            const expected = 2 / 3;

            if (Math.abs(aspectRatio - expected) > 0.05) {
                alert("La imagen debe tener una proporción de 2:3 (por ejemplo, 800x1200 px)");
                imagenInput.value = ""; // limpia selección
                preview.style.display = "none";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        };

        img.src = URL.createObjectURL(file);
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

        // Obtener id del reto de la URL
        const params = new URLSearchParams(window.location.search);
        const idReto = params.get("id");

        if (!idReto) {
            alert("Hubo un problema al asociar la historia al reto.");
            window.location.href = "panel.html";
            return;
        }

        const jsonData = {
            usuario: { id: parseInt(idUsuario) },
            titulo: titulo,
            descripcion: descripcion,
            genero: genero,
            publicado: false,
            reto: { id: idReto }
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
                if (response.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("idUsuario");
                    alert("La sesión ha caducado. Debes volver a iniciar sesión.");
                    window.location.href = "login.html";
                    return;
                }
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

document.addEventListener("DOMContentLoaded", async function () {
    // Obtener datos del reto y actualizar título y descripción
    try {
        const res = await fetch(API_URL + "/historia/retocompleto");
        const data = await res.json();
        if (data && data.nombreReto && data.descripcion) {
            const tituloReto = document.querySelector(".crear__reto__titulo");
            const descripcionReto = document.getElementById("descripcionReto");
            if (tituloReto) tituloReto.textContent = data.nombreReto;
            if (descripcionReto) descripcionReto.textContent = data.descripcion;
        }
    } catch (e) {
        // Silenciar error si no hay reto
    }
});

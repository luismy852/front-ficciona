import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const historiaId = params.get("id");

    if (!historiaId) {
        alert("❌ ID de historia no encontrado en la URL.");
        return;
    }

    fetch(API_URL + `/historia/porid/${historiaId}`)
        .then(res => {
            if (!res.ok) throw new Error("No se pudo obtener la historia.");
            return res.json();
        })
        .then(data => {
            // 📝 Rellenar campos del formulario
            document.getElementById("titulo").value = data.titulo;
            document.getElementById("descripcion").value = data.descripcion;
            document.getElementById("categoria").value = data.genero;

            // 🖼️ Mostrar portada si existe
            if (data.portada) {
                const rutaCompleta = data.portada.startsWith("/uploads/")
    ? `${API_URL}${data.portada}`
    : `${API_URL}/uploads/${data.portada}`;


                const preview = document.getElementById("preview");
                preview.src = rutaCompleta;
                preview.style.display = "block";
            }

            // Guardar el ID en el formulario si necesitas usarlo en el envío
            document.getElementById("creacionNueva").dataset.historiaId = data.id;
        })
        .catch(err => {
            console.error("❌ Error al cargar historia:", err.message);
            alert("No se pudo cargar la historia.");
        });
});

const form = document.getElementById("creacionNueva");
const imagenInput = document.getElementById("imagen");

imagenInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById("preview");
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});


form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const genero = document.getElementById("categoria").value;
    const imagen = imagenInput.files[0];
    const historiaId = new URLSearchParams(window.location.search).get("id");
            const token = localStorage.getItem("token");

    const jsonData = {
        id: parseInt(historiaId),
        titulo: titulo,
        descripcion: descripcion,
        genero: genero,
        publicado: true // o false, según tu lógica
    };

    const formData = new FormData();

    if (imagen) {
        formData.append("file", imagen);
    } else {
        // Enviar un archivo vacío para evitar error en el backend si esperas "file"
        formData.append("file", new Blob());
    }

    formData.append("json", JSON.stringify(jsonData));

    fetch(API_URL + "/historia/actualizar", {
        method: "POST",
         headers: {
        Authorization: `${token}`
    },
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo actualizar");
            return res.text();
        })
        .then(() => {
            alert("✅ Historia actualizada correctamente.");
            window.location.href = `panelhistoria.html?id=${historiaId}`;
        })
        .catch(err => {
            console.error("❌ Error al actualizar:", err.message);
            alert("❌ Error al actualizar la historia.");
        });
});

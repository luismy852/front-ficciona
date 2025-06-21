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

        fetch("http://localhost:8080/historia/crear", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    alert("Capítulo creado exitosamente");
                    form.reset();
                    preview.style.display = "none";
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

import { API_URL } from "./config.js";

tinymce.init({
    selector: '#editor',
    license_key: 'gpl|<your-license-key>',
    language: 'es_MX',
    branding: false,
    menubar: false,
    statusbar: false
});

const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const contenido = tinymce.activeEditor.getContent();

    // Aquí debes tener el ID de la historia (puedes tomarlo de la URL si vienes de editar.html?id=2)
    const params = new URLSearchParams(window.location.search);
    const historiaId = params.get("id"); // esto te da el ?id=2

    const capituloData = {
        historia: {
            id: parseInt(historiaId)
        },
        titulo: titulo,
        publicado: true,
        contenido: contenido
    };

    fetch(API_URL + "/capitulo/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            , "Authorization": localStorage.getItem("token") // Asegúrate de que el token esté en localStorage
        },
        body: JSON.stringify(capituloData)
    })
        .then(response => {
            if (response.status === 403) {
                // Si el token es inválido o expiró
                localStorage.removeItem("token");
                window.location.href = "index.html";
                return;
            }
            if (response.ok) {
                alert("Capítulo creado con éxito");
                window.location.href = `panelhistoria.html?id=${historiaId}`; // Redirigir a la página de la historia
            } else {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
        })
        .catch(error => {
            console.error("Error al crear capítulo:", error);
            alert("Error al crear capítulo");
        });
});



// Variables globales para guardar el contenido
let contenidoCapitulo = "";
let tituloCapitulo = "";
let editorInstancia = null;

// 1. Obtener ID del capítulo desde la URL
const params = new URLSearchParams(window.location.search);
const capituloId = params.get("id");

// 2. Iniciar el editor primero
tinymce.init({
    selector: '#editor',
    license_key: 'gpl|<your-license-key>',
    language: 'es_MX',
    branding: false,
    menubar: false,
    statusbar: false,
    setup: function (editor) {
        editorInstancia = editor;

        editor.on('init', function () {
            if (contenidoCapitulo) {
                editor.setContent(contenidoCapitulo); // si ya llegó la data
            }
        });
    }
});

// 3. Obtener los datos del capítulo
if (capituloId) {
    fetch(`http://localhost:8080/capitulo/${capituloId}`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener el capítulo");
            return response.json();
        })
        .then(data => {
            contenidoCapitulo = data.contenido;
            tituloCapitulo = data.titulo;

            document.getElementById("titulo").value = tituloCapitulo;

            // Si TinyMCE ya está inicializado, ponemos el contenido
            if (editorInstancia) {
                editorInstancia.setContent(contenidoCapitulo);
            }
        })
        .catch(error => {
            console.error("❌ Error al cargar el capítulo:", error);
        });
} else {
    console.warn("⚠️ No se encontró ID de capítulo en la URL");
}


document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que se recargue la página

    const params = new URLSearchParams(window.location.search);
    const capituloId = params.get("id");
    const historiaId = params.get("historia"); // 👈 obtenemos el ID de la historia


    const titulo = document.getElementById("titulo").value;
    const contenido = tinymce.get("editor").getContent();

    const datos = {
        id: parseInt(capituloId),
        titulo: titulo,
        contenido: contenido
    };

    fetch("http://localhost:8080/capitulo/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al actualizar el capítulo");
            }
            alert("✅ Capítulo actualizado con éxito");
            window.location.href = `http://127.0.0.1:5500/panelhistoria.html?id=${historiaId}`;

        })
        .catch(err => {
            console.error("❌ Error en la actualización:", err.message);
            alert("⚠️ Hubo un error al actualizar el capítulo");
        });
});

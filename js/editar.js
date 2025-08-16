import { API_URL } from "./config.js";

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


// 3. Obtener los datos del capítulo
if (capituloId) {
    fetch(API_URL + `/capitulo/${capituloId}`)
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

// Modal HTML (insertar al inicio del archivo)
const modalHtml = `
<div id="modal403" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
  <div style="background:#fff; padding:2em; border-radius:8px; max-width:500px; width:90%; box-shadow:0 2px 10px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:1em;">
    <h2>Sesión expirada</h2>
    <label for="modalTextarea">Puedes copiar el contenido antes de iniciar sesión:</label>
    <textarea id="modalTextarea" readonly style="width:100%; height:150px; resize:none;"></textarea>
    <div style="display:flex; gap:1em; justify-content:flex-end;">
      <button id="modalCopyBtn">Copiar contenido</button>
      <button id="modalAcceptBtn">Aceptar</button>
    </div>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHtml);

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

    fetch(API_URL + "/capitulo/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(res => {
            if (res.status === 403) {
                // Mostrar modal personalizado
                const contenido = tinymce.get("editor").getContent({ format: 'text' });
                document.getElementById("modalTextarea").value = contenido;
                document.getElementById("modal403").style.display = "flex";
                // Botón copiar
                document.getElementById("modalCopyBtn").onclick = () => {
                    navigator.clipboard.writeText(contenido)
                        .then(() => alert("Contenido copiado al portapapeles"))
                        .catch(() => alert("No se pudo copiar el contenido"));
                };
                // Botón aceptar
                document.getElementById("modalAcceptBtn").onclick = () => {
                    document.getElementById("modal403").style.display = "none";
                    localStorage.removeItem("token");
                    localStorage.removeItem("idUsuario");
                    window.location.href = "index.html";
                };
                return;
            }
            if (!res.ok) {
                throw new Error("Error al actualizar el capítulo");
            }
            alert("✅ Capítulo actualizado con éxito");
            window.location.href = `panelhistoria.html?id=${historiaId}`;
        })
        .catch(err => {
            console.error("❌ Error en la actualización:", err.message);
            alert("⚠️ Hubo un error al actualizar el capítulo");
        });
});

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
                // Mostrar modal personalizado
                const contenido = tinymce.activeEditor.getContent({ format: 'text' });
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
                    window.location.href = "index.html";
                };
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



import { API_URL } from "./config.js";

const params = new URLSearchParams(window.location.search);
const capituloId = params.get("capitulo");
const historiaId = params.get("id");

let permitirRegistrarProgreso = false;
let progresoGuardado = 0;
let scrollTimeout = null;

// 👉 1. Cargar el capítulo
fetch(API_URL + `/capitulo/${capituloId}`)
    .then(res => res.json())
    .then(data => {
        console.log("📘 Capítulo cargado:", data);
        document.getElementById("tituloHistoria").textContent = data.tituloHistoria;
        document.getElementById("tituloCapitulo").textContent = data.titulo;
        document.getElementById("contenidoCapitulo").innerHTML = data.contenido;

        // Placeholder para siguiente capítulo
        document.getElementById("linkSiguiente").href = `leer.html?id=${historiaId}&capitulo=${parseInt(capituloId) + 1}`;

        // 👉 Cargar progreso después de que el contenido ya se insertó
        const usuarioId = localStorage.getItem("idUsuario");

        if (usuarioId && historiaId) {
            fetch(`${API_URL}/progreso/${usuarioId}/${historiaId}`)
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo obtener el progreso");
                    return res.json();
                })
                .then(progresoData => {
                    const progreso = progresoData.progreso;
                    const capituloGuardado = progresoData.capituloId;

                    // 👇 Solo hacer scroll si el capítulo guardado es el mismo que el actual
                    if (parseInt(capituloGuardado) === parseInt(capituloId)) {
                        const scrollMax = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        const posicionScroll = Math.floor((progreso / 100) * scrollMax);

                        console.log(`📜 Aplicando scroll al ${progreso}% (${posicionScroll}px)`);

                        setTimeout(() => {
                            window.scrollTo({ top: posicionScroll, behavior: "smooth" });
                        }, 200); // Espera corta por si el contenido aún se está renderizando
                    } else {
                        console.log("📌 Progreso es de otro capítulo. No se aplica scroll.");
                    }
                })
                .catch(err => {
                    console.warn("⚠️ No se pudo recuperar el progreso:", err.message);
                });
        }
    })
    .catch(err => console.error("❌ Error al cargar capítulo:", err));




// Controla si se puede enviar el progreso (ej. cada 5%)
let ultimoProgresoEnviado = 0;
const umbral = 5; // Solo se enviará si avanza al menos este % desde el último guardado

// Función para obtener parámetro de la URL
function obtenerParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

// Escuchar el scroll para registrar progreso
document.addEventListener("scroll", () => {
    const usuarioId = localStorage.getItem("idUsuario");
    const historiaId = obtenerParametroURL("id");
    const capituloId = obtenerParametroURL("capitulo");

    console.log(`📝 Registrando progreso: usuarioId=${usuarioId}, historiaId=${historiaId}, capituloId=${capituloId}`);

    // Validar que estén los datos
    if (!usuarioId || !historiaId || !capituloId) return;

    // Calcular progreso
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progreso = Math.floor((scrollTop / scrollHeight) * 100);

    // Solo enviar si el progreso aumentó al menos 5%
    if (progreso - ultimoProgresoEnviado >= umbral) {
        ultimoProgresoEnviado = progreso;

        // Armar el body del POST
        const datos = {
            usuarioId: parseInt(usuarioId),
            historiaId: parseInt(historiaId),
            capituloId: parseInt(capituloId),
            progreso: progreso
        };

        // Enviar al backend
        fetch(API_URL + '/progreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(msg => { throw new Error(msg || 'Error al guardar progreso'); });
                }
                console.log(`✅ Progreso (${progreso}%) guardado`);
            })
            .catch(error => {
                console.error('❌ Error al guardar progreso:', error.message);
            });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const historiaId = params.get("id");
    const capituloActualId = parseInt(params.get("capitulo"));

    if (!historiaId || isNaN(capituloActualId)) return;

    // Obtener lista de IDs ordenados
    fetch(`${API_URL}/capitulo/lista/${historiaId}`)
        .then(res => res.json())
        .then(listaIds => {
            console.log("🧾 Lista de capítulos:", listaIds);
            const indiceActual = listaIds.indexOf(capituloActualId);

            if (indiceActual !== -1 && indiceActual < listaIds.length - 1) {
                const siguienteId = listaIds[indiceActual + 1];

                const enlace = document.getElementById("linkSiguiente");
                enlace.href = `capitulo.html?id=${historiaId}&capitulo=${siguienteId}`;
                enlace.textContent = "Siguiente capítulo ➡️";
            } else {
                // Si es el último capítulo
                const enlace = document.getElementById("linkSiguiente");
                enlace.href = "#";
                enlace.textContent = "📘 Fin de la historia";
                enlace.style.pointerEvents = "none";
                enlace.style.opacity = "0.6";
            }
        })
        .catch(err => {
            console.error("❌ Error al obtener lista de capítulos:", err);
        });
});

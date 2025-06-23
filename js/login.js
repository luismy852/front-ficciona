import { API_URL } from "./config.js";

document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que se recargue la página

    const login = document.getElementById("usuario").value;
    const clave = document.getElementById("password").value;

    const datos = {
        login: login,
        clave: clave
    };

    try {
        const respuesta = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const resultado = await respuesta.json();

        // Puedes guardar el token e id en localStorage para futuras peticiones
        localStorage.setItem("token", resultado.jwTtoken);
        localStorage.setItem("idUsuario", resultado.id);

        // Redireccionar o mostrar mensaje de éxito
        alert("¡Inicio de sesión exitoso!");
        // window.location.href = "/pagina-principal.html";
        window.location.href = "index.html";


    } catch (error) {
        document.getElementById("errorMensaje").textContent = error.message;
    }
});

import { API_URL } from "./config.js";

document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;
    let repetirPassword = document.getElementById("repetirPassword").value;
    let errorMensaje = document.getElementById("errorMensaje");

    if (password !== repetirPassword) {
        errorMensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    let datos = {
        correo: email,
        usuario: usuario,
        clave: password
    };

    try {
        let respuesta = await fetch(API_URL + "/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        let resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("Registro exitoso");
            this.reset();
            errorMensaje.textContent = "";
        } else {
            errorMensaje.textContent = resultado.mensaje || "Error en el registro";
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        errorMensaje.textContent = "Error al conectar con el servidor.";
    }
});

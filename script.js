document.addEventListener("DOMContentLoaded", () => {
    iniciarReloj();
    initCanvas(); // Mantiene la inicialización de tu mini juego
    inicializarFAQ();
    inicializarModoOscuro();
    inicializarContador();
    inicializarFormulario();
});

// ==========================================
// FUNCIONES EXISTENTES
// ==========================================

// Reloj Digital Dinámico
function iniciarReloj() {
    setInterval(() => {
        const ahora = new Date();
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        const segundos = String(ahora.getSeconds()).padStart(2, '0');
        
        const relojElem = document.getElementById("reloj");
        if (relojElem) {
            relojElem.textContent = `${horas}:${minutos}:${segundos}`;
        }
    }, 1000);
}

// 1. Mostrar información del Plan Dinámicamente
function mostrarInformacion() {
    const mensajeH2 = document.getElementById("mensaje");
    if (mensajeH2) {
        mensajeH2.textContent = "🔥 ¡Plan IPTV Anual en Promoción Especial de $35.00 dólares por tiempo limitado! 🔥";
    }
}

// 2. Cambiar Nombre
function actualizarTitulo() {
    const titulo = document.querySelector(".titulo-principal");
    if (titulo) {
        titulo.textContent = "JR TECH - Tu Entretenimiento Premium";
    }
}

// ==========================================
// NUEVAS FUNCIONALIDADES REQUERIDAS
// ==========================================

// FUNCIONALIDAD 1: FAQ Desplegable (Usa document.querySelectorAll y classList.toggle)
function inicializarFAQ() {
    const preguntas = document.querySelectorAll("#faq article");

    preguntas.forEach(articulo => {
        articulo.style.cursor = "pointer";
        articulo.addEventListener("click", () => {
            articulo.classList.toggle("faq-abierto");
            const respuesta = articulo.querySelector("p");
            if (respuesta) {
                respuesta.style.display = articulo.classList.contains("faq-abierto") ? "block" : "none";
            }
        });
    });
}

// FUNCIONALIDAD 2: Modo Oscuro (Usa document.getElementById y classList.toggle)
function cambiarColor() {
    document.body.classList.toggle("dark-mode");
}

function inicializarModoOscuro() {
    // Escucha eventos si existe un botón específico para el tema
    const btnOscuro = document.getElementById("btnModoOscuro");
    if (btnOscuro) {
        btnOscuro.addEventListener("click", cambiarColor);
    }
}

// FUNCIONALIDAD 3: Contador de Interés (Usa document.getElementById y classList)
let clics = 0;
function sumarClick() {
    clics++;
    const contador = document.getElementById("contador");
    if (contador) {
        contador.textContent = clics;
        contador.classList.add("activo");
        setTimeout(() => contador.classList.remove("activo"), 300);
    }
}

function inicializarContador() {
    const btnDemo = document.querySelector("button[onclick='sumarClick()']");
    if (btnDemo) {
        btnDemo.addEventListener("click", sumarClick);
    }
}

// PARTE 12: Validación del Formulario de Contacto
function inicializarFormulario() {
    const formContacto = document.getElementById("formContacto");

    if (formContacto) {
        formContacto.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita que la página se recargue

            const nombre = document.getElementById("nombreUsuario").value.trim();
            const apellido = document.getElementById("apellidoUsuario").value.trim();
            const correo = document.getElementById("correoUsuario").value.trim();

            let mensajeRespuesta = document.getElementById("mensajeFormulario");
            if (!mensajeRespuesta) {
                mensajeRespuesta = document.createElement("p");
                mensajeRespuesta.id = "mensajeFormulario";
                mensajeRespuesta.style.marginTop = "15px";
                mensajeRespuesta.style.fontWeight = "bold";
                mensajeRespuesta.style.textAlign = "center";
                formContacto.appendChild(mensajeRespuesta);
            }

            // Validación de campos obligatorios
            if (nombre === "" || apellido === "" || correo === "") {
                mensajeRespuesta.style.color = "#dc2626";
                mensajeRespuesta.textContent = "❌ Por favor, complete todos los campos obligatorios.";
                return;
            }

            // Expresión regular para validar correo electrónico
            const expRegCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!expRegCorreo.test(correo)) {
                mensajeRespuesta.style.color = "#dc2626";
                mensajeRespuesta.textContent = "❌ Por favor, ingrese un correo electrónico válido.";
                return;
            }

            // Formulario enviado con éxito
            mensajeRespuesta.style.color = "#16a34a";
            mensajeRespuesta.textContent = `¡Gracias, ${nombre}! Tu solicitud ha sido enviada con éxito.`;

            formContacto.reset();
        });
    }
}

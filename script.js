document.addEventListener("DOMContentLoaded", () => {
    iniciarReloj();
    initCanvas();
    inicializarEventos();
});

function inicializarEventos() {
    // Eventos DOM para botones principales
    const btnInfoPlan = document.getElementById("btnInfoPlan");
    if (btnInfoPlan) btnInfoPlan.addEventListener("click", mostrarInformacion);

    const btnActualizarTitulo = document.getElementById("btnActualizarTitulo");
    if (btnActualizarTitulo) btnActualizarTitulo.addEventListener("click", actualizarTitulo);

    const btnCambiarTema = document.getElementById("btnCambiarTema");
    if (btnCambiarTema) btnCambiarTema.addEventListener("click", cambiarColor);

    const btnSumarClick = document.getElementById("btnSumarClick");
    if (btnSumarClick) btnSumarClick.addEventListener("click", sumarClick);

    const mesesPlan = document.getElementById("mesesPlan");
    if (mesesPlan) mesesPlan.addEventListener("change", calcularPresupuesto);

    const btnValidarCelular = document.getElementById("btnValidarCelular");
    if (btnValidarCelular) btnValidarCelular.addEventListener("click", validarCampo);

    // Evento Formulario con e.preventDefault()
    const formContacto = document.getElementById("formContacto");
    if (formContacto) formContacto.addEventListener("submit", validarFormularioCompleto);

    // Funcionalidad FAQ (Acordeón con classList.toggle)
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle("active");
        });
    });
}

// 1. Reloj Digital Dinámico
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

// 2. Funcionalidad 1: Mensaje Dinámico
function mostrarInformacion() {
    const mensajeH2 = document.getElementById("mensaje");
    if (mensajeH2) {
        mensajeH2.textContent = "🔥 ¡Plan IPTV Anual en Promoción Especial de $35.00 dólares por tiempo limitado! 🔥";
    }
}

// 3. Funcionalidad 2: Cambio de Contenido
function actualizarTitulo() {
    const titulo = document.querySelector(".titulo-principal");
    if (titulo) {
        titulo.textContent = "JR TECH - Tu Entretenimiento Premium";
    }
}

// 4. Funcionalidad 3: Modo Oscuro (Uso de classList.toggle)
function cambiarColor() {
    document.body.classList.toggle("dark-mode");
}

// 5. Cotizador Express
function calcularPresupuesto() {
    const selector = document.getElementById("mesesPlan");
    const resultado = document.getElementById("resultadoCotizacion");
    const meses = parseInt(selector.value);
    
    const preciosPlanes = { 0: 0, 1: 4.00, 3: 10.80, 6: 19.00, 12: 35.00 };
    const total = preciosPlanes[meses] || 0;
    resultado.textContent = `Total a pagar: $${total.toFixed(2)}`;
}

// 6. Contador Interactivo
let clickCount = 0;
function sumarClick() {
    clickCount++;
    const contador = document.getElementById("contador");
    if (contador) contador.textContent = clickCount;
}

// 7. Validación rápida de Celular
function validarCampo() {
    const campo = document.getElementById("campoValidacion").value.trim();
    const regexEcuador = /^09\d{8}$/; 

    if (regexEcuador.test(campo)) {
        alert("✅ Número de celular de Ecuador válido. Un asesor de JR TECH se contactará con usted.");
    } else {
        alert("❌ Por favor, ingrese un número de celular válido de Ecuador (10 dígitos e iniciado con 09).");
    }
}

// 8. Funcionalidad 4: Validación de Formulario Completo
function validarFormularioCompleto(e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const correo = document.getElementById("correoUsuario").value.trim();
    const mensajeForm = document.getElementById("mensajeFormulario");

    if (nombre === "" || correo === "") {
        mensajeForm.style.color = "#dc2626";
        mensajeForm.textContent = "⚠️ Por favor complete todos los campos obligatorios (Nombre y Correo).";
    } else {
        mensajeForm.style.color = "#16a34a";
        mensajeForm.textContent = "¡Formulario enviado correctamente! Nos pondremos en contacto pronto.";
        document.getElementById("formContacto").reset();
    }
}

// ==========================================
// LÓGICA DEL MINI VIDEOJUEGO (CANVAS)
// ==========================================

let canvas, ctx;
let gameLoopId = null;
let gameActive = false;

let score = 0;
let level = 1;
let lives = 3;

const keys = { left: false, right: false };

const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 6,
    color: '#38bdf8'
};

let bullets = [];
let asteroids = [];
let stars = [];
let lastShot = 0;

function initCanvas() {
    canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 15;

    stars = [];
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
    });

    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        player.x = Math.max(0, Math.min(canvas.width - player.width, mouseX - player.width / 2));
    });

    canvas.addEventListener("touchmove", (e) => {
        if (!gameActive) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        player.x = Math.max(0, Math.min(canvas.width - player.width, touchX - player.width / 2));
    }, { passive: false });

    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");

    if (btnLeft && btnRight) {
        btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); keys.left = true; }, { passive: false });
        btnLeft.addEventListener("touchend", (e) => { e.preventDefault(); keys.left = false; }, { passive: false });
        btnLeft.addEventListener("mousedown", () => { keys.left = true; });
        btnLeft.addEventListener("mouseup", () => { keys.left = false; });

        btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); keys.right = true; }, { passive: false });
        btnRight.addEventListener("touchend", (e) => { e.preventDefault(); keys.right = false; }, { passive: false });
        btnRight.addEventListener("mousedown", () => { keys.right = true; });
        btnRight.addEventListener("mouseup", () => { keys.right = false; });
    }

    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.addEventListener("click", startGame);

    const restartBtnOverlay = document.getElementById("restartBtnOverlay");
    if (restartBtnOverlay) restartBtnOverlay.addEventListener("click", startGame);

    const btnRestartGame = document.getElementById("btnRestartGame");
    if (btnRestartGame) btnRestartGame.addEventListener("click", startGame);
}

function startGame() {
    if (!canvas) initCanvas();

    score = 0;
    level = 1;
    lives = 3;
    bullets = [];
    asteroids = [];
    gameActive = true;

    player.x = canvas.width / 2 - player.width / 2;

    actualizarHUD();

    document.getElementById("gameOverlay").classList.add("hidden");
    document.getElementById("gameOverOverlay").classList.add("hidden");

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function disparar() {
    const ahora = Date.now();
    if (ahora - lastShot > 180) { 
        bullets.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 12,
            speed: 9,
            color: '#facc15'
        });
        lastShot = ahora;
    }
}

function crearAsteroide() {
    const size = Math.random() * 25 + 20;
    asteroids.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: (Math.random() * 2 + 1.5) + (level * 0.4),
        color: '#94a3b8'
    });
}

function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
        ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;

    disparar();

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height - 8);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= b.speed;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);

        if (b.y < -10) bullets.splice(i, 1);
    }

    if (Math.random() < 0.03 + (level * 0.005)) {
        crearAsteroide();
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const ast = asteroids[i];
        ast.y += ast.speed;

        ctx.fillStyle = ast.color;
        ctx.beginPath();
        ctx.arc(ast.x + ast.size / 2, ast.y + ast.size / 2, ast.size / 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (
                b.x < ast.x + ast.size &&
                b.x + b.width > ast.x &&
                b.y < ast.y + ast.size &&
                b.y + b.height > ast.y
            ) {
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;

                if (score % 100 === 0) level++;
                actualizarHUD();
                break;
            }
        }

        if (
            player.x < ast.x + ast.size &&
            player.x + player.width > ast.x &&
            player.y < ast.y + ast.size &&
            player.y + player.height > ast.y
        ) {
            asteroids.splice(i, 1);
            lives--;
            actualizarHUD();

            if (lives <= 0) {
                gameOver();
                return;
            }
        }

        if (ast.y > canvas.height + 30) {
            asteroids.splice(i, 1);
        }
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

function actualizarHUD() {
    const scoreElem = document.getElementById("scoreDisplay");
    const levelElem = document.getElementById("levelDisplay");
    const livesElem = document.getElementById("livesDisplay");

    if (scoreElem) scoreElem.textContent = score;
    if (levelElem) levelElem.textContent = level;
    if (livesElem) livesElem.textContent = "❤️".repeat(Math.max(0, lives));
}

function gameOver() {
    gameActive = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);

    const gameOverOverlay = document.getElementById("gameOverOverlay");
    const goSub = document.getElementById("goSub");

    if (goSub) goSub.textContent = `Lograste alcanzar ${score} puntos en el Nivel ${level}.`;
    if (gameOverOverlay) gameOverOverlay.classList.remove("hidden");
}

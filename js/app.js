// Estado inicial da pintura
let corSelecionada = "#e74c3c";
let numeroSelecionado = "1";
let modoAtual = "balde"; // 'balde' ou 'pincel'
let pintando = false;

// Elementos da interface
const botoesCor = document.querySelectorAll(".item-cor");
const partesSvg = document.querySelectorAll(".parte-pintavel");
const btnBalde = document.getElementById("btn-modo-balde");
const btnPincel = document.getElementById("btn-modo-pincel");
const btnLimpar = document.getElementById("btn-limpar");
const canvas = document.getElementById("camada-pincel");
const ctx = canvas ? canvas.getContext("2d") : null;

// 1. SELEÇÃO DE COR NA PALETA
botoesCor.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesCor.forEach(b => b.classList.remove("ativa"));
        botao.classList.add("ativa");
        corSelecionada = botao.getAttribute("data-hex");
        numeroSelecionado = botao.getAttribute("data-numero");
    });
});

// 2. MODO BALDE: PINTAR POR NÚMERO
partesSvg.forEach(parte => {
    parte.addEventListener("click", () => {
        if (modoAtual !== "balde") return;

        const numeroParte = parte.getAttribute("data-numero");
        // Verifica se o número da cor escolhida coincide com o número da peça
        if (numeroParte === numeroSelecionado) {
            parte.setAttribute("fill", corSelecionada);
        } else {
            alert(`Atenção: Esta área é para o número ${numeroParte}!`);
        }
    });
});

// 3. ALTERNÂNCIA DE MODOS (BALDE vs PINCEL)
if (btnBalde && btnPincel) {
    btnBalde.addEventListener("click", () => {
        modoAtual = "balde";
        btnBalde.classList.add("ativo");
        btnPincel.classList.remove("ativo");
        if (canvas) canvas.style.pointerEvents = "none";
    });

    btnPincel.addEventListener("click", () => {
        modoAtual = "pincel";
        btnPincel.classList.add("ativo");
        btnBalde.classList.remove("ativo");
        if (canvas) canvas.style.pointerEvents = "auto";
    });
}

// 4. MODO PINCEL LIVRE NO CANVAS
if (canvas && ctx) {
    canvas.style.pointerEvents = "none"; // Começa com o balde ativo

    canvas.addEventListener("mousedown", (e) => {
        if (modoAtual !== "pincel") return;
        pintando = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!pintando || modoAtual !== "pincel") return;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.strokeStyle = corSelecionada;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    });

    window.addEventListener("mouseup", () => {
        pintando = false;
    });
}

// 5. BOTÃO LIMPAR
if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        // Limpa as cores do SVG
        partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
        // Limpa os traços do Canvas
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
}

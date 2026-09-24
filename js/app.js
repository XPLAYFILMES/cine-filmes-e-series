// 1. IDENTIFICAÇÃO DO DESENHO E ESTADO INICIAL
const parametrosUrl = new URLSearchParams(window.location.search);
const idDesenhoAtual = parametrosUrl.get("id") || "desenho_1";

let corSelecionada = "#e74c3c";
let numeroSelecionado = "1";
let modoAtual = "balde"; // 'balde' ou 'pincel'
let pintando = false;

// 2. ELEMENTOS DA INTERFACE
const botoesCor = document.querySelectorAll(".item-cor");
const partesSvg = document.querySelectorAll(".parte-pintavel");
const btnBalde = document.getElementById("btn-modo-balde");
const btnPincel = document.getElementById("btn-modo-pincel");
const btnLimpar = document.getElementById("btn-limpar");
const btnSalvar = document.getElementById("btn-salvar");
const canvas = document.getElementById("camada-pincel");
const ctx = canvas ? canvas.getContext("2d") : null;

// 3. FUNÇÕES DE PROGRESSO (LOCALSTORAGE)
function salvarProgressoAutomatico() {
    let partesPintadas = 0;
    const estadoCores = {};

    partesSvg.forEach((parte, index) => {
        const cor = parte.getAttribute("fill");
        if (cor && cor.toLowerCase() !== "#ffffff") {
            partesPintadas++;
            estadoCores[index] = cor;
        }
    });

    const totalPartes = partesSvg.length;
    const porcentagem = totalPartes > 0 ? Math.round((partesPintadas / totalPartes) * 100) : 0;

    const dados = {
        porcentagem: porcentagem,
        cores: estadoCores
    };

    localStorage.setItem(`progresso_${idDesenhoAtual}`, JSON.stringify(dados));
}

function restaurarPinturaSalva() {
    const dadosSalvos = localStorage.getItem(`progresso_${idDesenhoAtual}`);
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            partesSvg.forEach((parte, index) => {
                if (dados.cores && dados.cores[index]) {
                    parte.setAttribute("fill", dados.cores[index]);
                }
            });
        } catch (e) {
            console.error("Erro ao carregar progresso salvo:", e);
        }
    }
}

// Executar restauração logo ao abrir
restaurarPinturaSalva();

// 4. SELEÇÃO DE COR NA PALETA
botoesCor.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesCor.forEach(b => b.classList.remove("ativa"));
        botao.classList.add("ativa");
        corSelecionada = botao.getAttribute("data-hex");
        numeroSelecionado = botao.getAttribute("data-numero");
    });
});

// 5. MODO BALDE: PINTAR POR NÚMERO
partesSvg.forEach(parte => {
    parte.addEventListener("click", () => {
        if (modoAtual !== "balde") return;

        const numeroParte = parte.getAttribute("data-numero");
        if (numeroParte === numeroSelecionado) {
            parte.setAttribute("fill", corSelecionada);
            salvarProgressoAutomatico();
        } else {
            alert(`Atenção: Esta área corresponde ao número ${numeroParte}!`);
        }
    });
});

// 6. ALTERNÂNCIA DE MODOS (BALDE vs PINCEL)
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

// 7. PINCEL LIVRE NO CANVAS
if (canvas && ctx) {
    canvas.style.pointerEvents = "none";

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

// 8. BOTÃO LIMPAR
if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        localStorage.removeItem(`progresso_${idDesenhoAtual}`);
    });
}

// 9. BOTÃO GUARDAR IMAGEM
if (btnSalvar) {
    btnSalvar.addEventListener("click", () => {
        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = 300;
        canvasFinal.height = 300;
        const contextoFinal = canvasFinal.getContext("2d");

        contextoFinal.fillStyle = "#ffffff";
        contextoFinal.fillRect(0, 0, 300, 300);

        const svgElemento = document.getElementById("desenho-svg");
        const svgString = new XMLSerializer().serializeToString(svgElemento);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const urlSvg = URL.createObjectURL(svgBlob);

        const imgSvg = new Image();
        imgSvg.onload = () => {
            contextoFinal.drawImage(imgSvg, 0, 0);

            if (canvas) {
                contextoFinal.drawImage(canvas, 0, 0);
            }

            const linkDownload = document.createElement("a");
            linkDownload.download = `arte-${idDesenhoAtual}.png`;
            linkDownload.href = canvasFinal.toDataURL("image/png");
            linkDownload.click();

            URL.revokeObjectURL(urlSvg);
        };

        imgSvg.src = urlSvg;
    });
}

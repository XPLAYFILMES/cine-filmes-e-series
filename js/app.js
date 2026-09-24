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
localStorage.removeItem(`progresso_${idDesenhoAtual}`);
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

// Identificador do desenho aberto vindo da URL (ex: ?id=desenho_1)
const parametrosUrl = new URLSearchParams(window.location.search);
const idDesenhoAtual = parametrosUrl.get("id") || "desenho_1";

// Função para calcular e gravar o progresso no localStorage
function salvarProgressoAutomatico() {
    let partesPintadas = 0;
    const estadoCores = {};

    partesSvg.forEach((parte, index) => {
        const cor = parte.getAttribute("fill");
        if (cor && cor !== "#ffffff") {
            partesPintadas++;
            estadoCores[index] = cor;
        }
    });

    const totalPartes = partesSvg.length;
    const porcentagem = Math.round((partesPintadas / totalPartes) * 100);

    const dados = {
        porcentagem: porcentagem,
        cores: estadoCores
    };

    localStorage.setItem(`progresso_${idDesenhoAtual}`, JSON.stringify(dados));
}

// Função para restaurar o que já foi pintado anteriormente
function restaurarPinturaSalva() {
    const dadosSalvos = localStorage.getItem(`progresso_${idDesenhoAtual}`);
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        partesSvg.forEach((parte, index) => {
            if (dados.cores && dados.cores[index]) {
                parte.setAttribute("fill", dados.cores[index]);
            }
        });
    }
}

// Executa restauração ao abrir a página
restaurarPinturaSalva();

// 2. MODO BALDE ATUALIZADO COM SALVAMENTO
partesSvg.forEach(parte => {
    parte.addEventListener("click", () => {
        if (modoAtual !== "balde") return;

        const numeroParte = parte.getAttribute("data-numero");
        if (numeroParte === numeroSelecionado) {
            parte.setAttribute("fill", corSelecionada);
            salvarProgressoAutomatico(); // Salva na hora!
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
// 6. BOTÃO GUARDAR / DESCARREGAR ARTE
const btnSalvar = document.getElementById("btn-salvar");

if (btnSalvar) {
    btnSalvar.addEventListener("click", () => {
        // Criar um elemento canvas temporário para fundir o SVG e a pintura livre
        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = 300;
        canvasFinal.height = 300;
        const contextoFinal = canvasFinal.getContext("2d");

        // Fundo branco na imagem descarregada
        contextoFinal.fillStyle = "#ffffff";
        contextoFinal.fillRect(0, 0, 300, 300);

        // Converter o SVG pintado numa imagem
        const svgElemento = document.getElementById("desenho-svg");
        const svgString = new XMLSerializer().serializeToString(svgElemento);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const urlSvg = URL.createObjectURL(svgBlob);

        const imgSvg = new Image();
        imgSvg.onload = () => {
            // Desenha o SVG colorido
            contextoFinal.drawImage(imgSvg, 0, 0);

            // Se existirem rabiscos no canvas do pincel, sobrepõe-os
            if (canvas) {
                contextoFinal.drawImage(canvas, 0, 0);
            }

            // Cria o link de descarga automática
            const linkDownload = document.createElement("a");
            linkDownload.download = "minha-arte-colorida.png";
            linkDownload.href = canvasFinal.toDataURL("image/png");
            linkDownload.click();

            // Libertar memória do objeto URL
            URL.revokeObjectURL(urlSvg);
        };

        imgSvg.src = urlSvg;
    });
}

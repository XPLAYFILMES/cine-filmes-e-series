document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE DESENHOS SVG DINÂMICOS
    // ========================================================
    const catalogoSVG = {
        desenho_1: {
            titulo: "Estrela Mágica",
            viewBox: "0 0 300 300",
            svg: `
                <polygon class="parte-pintavel" data-numero="1" points="150,25 179,111 269,111 197,165 224,251 150,200 76,251 103,165 31,111 121,111" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round" />
                <circle class="parte-pintavel" data-numero="2" cx="70" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4" />
                <circle class="parte-pintavel" data-numero="3" cx="230" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4" />
                <text x="150" y="155" font-family="Arial" font-size="20" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="70" y="77" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">2</text>
                <text x="230" y="77" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">3</text>
            `
        },
        desenho_2: {
            titulo: "Foguetão Espacial",
            viewBox: "0 0 300 300",
            svg: `
                <!-- Corpo Principal do Foguete -->
                <path class="parte-pintavel" data-numero="1" d="M150,30 C180,90 190,180 190,210 L110,210 C110,180 120,90 150,30 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <!-- Asa Esquerda -->
                <path class="parte-pintavel" data-numero="2" d="M110,160 L60,210 L110,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <!-- Asa Direita -->
                <path class="parte-pintavel" data-numero="2" d="M190,160 L240,210 L190,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <!-- Janela / Escotilha -->
                <circle class="parte-pintavel" data-numero="3" cx="150" cy="120" r="22" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <!-- Fogo / Propulsão -->
                <polygon class="parte-pintavel" data-numero="4" points="130,215 150,270 170,215" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <text x="150" y="175" font-family="Arial" font-size="20" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="90" y="200" font-family="Arial" font-size="16" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">2</text>
                <text x="210" y="200" font-family="Arial" font-size="16" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">2</text>
                <text x="150" y="127" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">3</text>
                <text x="150" y="245" font-family="Arial" font-size="16" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">4</text>
            `
        },
        desenho_3: {
            titulo: "Flor Geométrica",
            viewBox: "0 0 300 300",
            svg: `
                <!-- Pétala Cima -->
                <ellipse class="parte-pintavel" data-numero="1" cx="150" cy="90" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <!-- Pétala Baixo -->
                <ellipse class="parte-pintavel" data-numero="1" cx="150" cy="210" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <!-- Pétala Esquerda -->
                <ellipse class="parte-pintavel" data-numero="1" cx="90" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <!-- Pétala Direita -->
                <ellipse class="parte-pintavel" data-numero="1" cx="210" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <!-- Miolo Central -->
                <circle class="parte-pintavel" data-numero="2" cx="150" cy="150" r="32" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <text x="150" y="95" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="150" y="215" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="90" y="155" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="210" y="155" font-family="Arial" font-size="18" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">1</text>
                <text x="150" y="157" font-family="Arial" font-size="20" font-weight="bold" fill="#666666" text-anchor="middle" pointer-events="none">2</text>
            `
        }
    };

    // ========================================================
    // 2. INJEÇÃO DO DESENHO ESCOLHIDO PELA URL
    // ========================================================
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idDesenhoAtual = parametrosUrl.get("id") || "desenho_1";
    const desenhoDados = catalogoSVG[idDesenhoAtual] || catalogoSVG["desenho_1"];

    const svgElemento = document.getElementById("desenho-svg");
    if (svgElemento) {
        svgElemento.setAttribute("viewBox", desenhoDados.viewBox);
        svgElemento.innerHTML = desenhoDados.svg;
    }

    // ========================================================
    // 3. ESTADOS E SELEÇÃO DE ELEMENTOS DA PRANCHETA
    // ========================================================
    let corSelecionada = "#e74c3c";
    let numeroSelecionado = "1";
    let modoAtual = "balde";
    let pintando = false;

    const botoesCor = document.querySelectorAll(".item-cor");
    const partesSvg = document.querySelectorAll(".parte-pintavel");
    const btnBalde = document.getElementById("btn-modo-balde");
    const btnPincel = document.getElementById("btn-modo-pincel");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnSalvar = document.getElementById("btn-salvar");
    const canvas = document.getElementById("camada-pincel");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const barraAtiva = document.getElementById("barra-progresso-ativa");
    const textoAtivo = document.getElementById("texto-progresso-ativo");
    const avisoParabens = document.getElementById("aviso-parabens");

    // ========================================================
    // 4. ATUALIZAÇÃO VISUAL DA BARRA E NOTIFICAÇÃO
    // ========================================================
    function atualizarBarraVisual(porcentagem, concluido) {
        if (barraAtiva) barraAtiva.style.width = `${porcentagem}%`;
        if (textoAtivo) textoAtivo.innerText = `${porcentagem}% Concluído`;
        if (avisoParabens) avisoParabens.style.display = concluido ? "block" : "none";
    }

    // ========================================================
    // 5. SALVAMENTO AUTOMÁTICO NO NAVEGADOR
    // ========================================================
    function salvarProgressoAutomatico() {
        let partesPintadas = 0;
        const estadoCores = {};

        partesSvg.forEach((parte, index) => {
            const cor = parte.getAttribute("fill");
            if (cor && cor.toLowerCase() !== "#ffffff" && cor.toLowerCase() !== "#fff" && cor !== "rgb(255, 255, 255)") {
                partesPintadas++;
                estadoCores[index] = cor;
            }
        });

        const totalPartes = partesSvg.length;
        const porcentagem = totalPartes > 0 ? Math.round((partesPintadas / totalPartes) * 100) : 0;
        const concluido = (partesPintadas === totalPartes && totalPartes > 0);

        atualizarBarraVisual(porcentagem, concluido);

        localStorage.setItem(`progresso_${idDesenhoAtual}`, JSON.stringify({
            porcentagem: porcentagem,
            cores: estadoCores
        }));
    }

    // ========================================================
    // 6. RESTAURAÇÃO DE PINTURA ANTERIOR
    // ========================================================
    function restaurarPinturaSalva() {
        const dadosSalvos = localStorage.getItem(`progresso_${idDesenhoAtual}`);
        if (!dadosSalvos) return;

        try {
            const dados = JSON.parse(dadosSalvos);
            if (dados.cores) {
                Object.keys(dados.cores).forEach(index => {
                    const idx = parseInt(index, 10);
                    if (partesSvg[idx]) {
                        partesSvg[idx].setAttribute("fill", dados.cores[idx]);
                    }
                });
            }
            const pct = dados.porcentagem || 0;
            atualizarBarraVisual(pct, pct === 100);
        } catch (e) {
            console.error("Erro ao restaurar progresso:", e);
        }
    }

    restaurarPinturaSalva();

    // ========================================================
    // 7. SELEÇÃO DE CORES DA PALETA
    // ========================================================
    botoesCor.forEach(botao => {
        botao.addEventListener("click", () => {
            botoesCor.forEach(b => b.classList.remove("ativa"));
            botao.classList.add("ativa");
            corSelecionada = botao.getAttribute("data-hex");
            numeroSelecionado = botao.getAttribute("data-numero");
        });
    });

    // ========================================================
    // 8. PINTURA POR NÚMEROS (MODO BALDE)
    // ========================================================
    partesSvg.forEach(parte => {
        parte.addEventListener("click", () => {
            if (modoAtual !== "balde") return;

            const numeroParte = parte.getAttribute("data-numero");
            if (numeroParte === numeroSelecionado) {
                parte.setAttribute("fill", corSelecionada);
                salvarProgressoAutomatico();
            } else {
                alert(`Atenção: Esta área é para a cor de número ${numeroParte}!`);
            }
        });
    });

    // ========================================================
    // 9. ALTERNÂNCIA DE FERRAMENTAS (BALDE / PINCEL)
    // ========================================================
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

    // ========================================================
    // 10. PINCEL LIVRE NO CANVAS
    // ========================================================
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

    // ========================================================
    // 11. BOTÃO LIMPAR E BOTÃO SALVAR PNG
    // ========================================================
    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem(`progresso_${idDesenhoAtual}`);
            atualizarBarraVisual(0, false);
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            const canvasFinal = document.createElement("canvas");
            canvasFinal.width = 300;
            canvasFinal.height = 300;
            const contextoFinal = canvasFinal.getContext("2d");

            contextoFinal.fillStyle = "#ffffff";
            contextoFinal.fillRect(0, 0, 300, 300);

            const svgString = new XMLSerializer().serializeToString(svgElemento);
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const urlSvg = URL.createObjectURL(svgBlob);

            const imgSvg = new Image();
            imgSvg.onload = () => {
                contextoFinal.drawImage(imgSvg, 0, 0);
                if (canvas) contextoFinal.drawImage(canvas, 0, 0);

                const linkDownload = document.createElement("a");
                linkDownload.download = `${idDesenhoAtual}-colorido.png`;
                linkDownload.href = canvasFinal.toDataURL("image/png");
                linkDownload.click();

                URL.revokeObjectURL(urlSvg);
            };
            imgSvg.src = urlSvg;
        });
    }
});

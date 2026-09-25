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
                <path class="parte-pintavel" data-numero="1" d="M150,30 C180,90 190,180 190,210 L110,210 C110,180 120,90 150,30 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <path class="parte-pintavel" data-numero="2" d="M110,160 L60,210 L110,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <path class="parte-pintavel" data-numero="2" d="M190,160 L240,210 L190,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4" stroke-linejoin="round"/>
                <circle class="parte-pintavel" data-numero="3" cx="150" cy="120" r="22" fill="#ffffff" stroke="#333333" stroke-width="4"/>
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
                <ellipse class="parte-pintavel" data-numero="1" cx="150" cy="90" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="1" cx="150" cy="210" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="1" cx="90" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="1" cx="210" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
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
    // 2. SISTEMA DE ÁUDIO WEB (COM DESBLOQUEIO DE AUTOPLAY)
    // ========================================================
    let audioCtx = null;

    function obterAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Desbloquear áudio logo no primeiro clique do usuário em qualquer lugar
    function desbloquearAudioInicial() {
        obterAudioContext();
        window.removeEventListener("click", desbloquearAudioInicial);
        window.removeEventListener("touchstart", desbloquearAudioInicial);
    }
    window.addEventListener("click", desbloquearAudioInicial);
    window.addEventListener("touchstart", desbloquearAudioInicial);

    // Efeito: Acerto de número (Gota de tinta pop)
    function tocarSomAcerto() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const osc = ctxA.createOscillator();
            const gain = ctxA.createGain();

            osc.type = "sine";
            const agora = ctxA.currentTime;
            osc.frequency.setValueAtTime(450, agora);
            osc.frequency.exponentialRampToValueAtTime(800, agora + 0.1);

            gain.gain.setValueAtTime(0.4, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.12);

            osc.connect(gain);
            gain.connect(ctxA.destination);
            osc.start(agora);
            osc.stop(agora + 0.12);
        } catch (e) {
            console.warn("Erro ao tocar som de acerto:", e);
        }
    }

    // Efeito: Erro de número (Aviso sutil)
    function tocarSomErro() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const osc = ctxA.createOscillator();
            const gain = ctxA.createGain();

            osc.type = "sawtooth";
            const agora = ctxA.currentTime;
            osc.frequency.setValueAtTime(180, agora);
            osc.frequency.linearRampToValueAtTime(130, agora + 0.15);

            gain.gain.setValueAtTime(0.2, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.15);

            osc.connect(gain);
            gain.connect(ctxA.destination);
            osc.start(agora);
            osc.stop(agora + 0.15);
        } catch (e) {
            console.warn("Erro ao tocar som de erro:", e);
        }
    }

    // Efeito: Fanfarra de Conclusão 100%
    function tocarSomVitoria() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;
            const escala = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

            escala.forEach((freq, idx) => {
                const osc = ctxA.createOscillator();
                const gain = ctxA.createGain();
                const tempo = agora + (idx * 0.12);

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, tempo);

                gain.gain.setValueAtTime(0.25, tempo);
                gain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.28);

                osc.connect(gain);
                gain.connect(ctxA.destination);
                osc.start(tempo);
                osc.stop(tempo + 0.28);
            });
        } catch (e) {
            console.warn("Erro ao tocar vitória:", e);
        }
    }

    function dispararConfetes() {
        if (typeof confetti === "function") {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }

    // ========================================================
    // 3. INJEÇÃO DO DESENHO PELA URL
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
    // 4. ELEMENTOS E ESTADO
    // ========================================================
    let corSelecionada = "#e74c3c";
    let numeroSelecionado = "1";
    let modoAtual = "balde";
    let pintando = false;
    let jaDisparouVitoria = false;

    const botoesCor = document.querySelectorAll(".item-cor");
    const partesSvg = document.querySelectorAll(".parte-pintavel");
    const btnBalde = document.getElementById("btn-modo-balde");
    const btnPincel = document.getElementById("btn-modo-pincel");
    const btnTelaCheia = document.getElementById("btn-tela-cheia");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnSalvar = document.getElementById("btn-salvar");
    const canvas = document.getElementById("camada-pincel");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const barraAtiva = document.getElementById("barra-progresso-ativa");
    const textoAtivo = document.getElementById("texto-progresso-ativo");
    const avisoParabens = document.getElementById("aviso-parabens");

    // ========================================================
    // 5. ATUALIZAR BARRA E SUCESSO
    // ========================================================
    function atualizarBarraVisual(porcentagem, concluido) {
        if (barraAtiva) barraAtiva.style.width = `${porcentagem}%`;
        if (textoAtivo) textoAtivo.innerText = `${porcentagem}% Concluído`;
        if (avisoParabens) avisoParabens.style.display = concluido ? "block" : "none";

        if (concluido && !jaDisparouVitoria) {
            jaDisparouVitoria = true;
            tocarSomVitoria();
            dispararConfetes();
        }
    }

    // ========================================================
    // 6. SALVAR PROGRESSO AUTOMÁTICO
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
    // 7. RESTAURAR PINTURA SALVA
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
            if (pct === 100) jaDisparouVitoria = true;
        } catch (e) {
            console.error("Erro ao restaurar pintura:", e);
        }
    }

    restaurarPinturaSalva();

    // ========================================================
    // 8. PALETA DE CORES
    // ========================================================
    botoesCor.forEach(botao => {
        botao.addEventListener("click", () => {
            obterAudioContext(); // Garante o áudio ativo
            botoesCor.forEach(b => b.classList.remove("ativa"));
            botao.classList.add("ativa");
            corSelecionada = botao.getAttribute("data-hex");
            numeroSelecionado = botao.getAttribute("data-numero");
        });
    });

    // ========================================================
    // 9. CLIQUE NAS PARTES DO DESENHO (PINTURA POR NÚMERO)
    // ========================================================
    partesSvg.forEach(parte => {
        parte.addEventListener("click", () => {
            if (modoAtual !== "balde") return;
            obterAudioContext();

            const numeroParte = parte.getAttribute("data-numero");
            if (numeroParte === numeroSelecionado) {
                parte.setAttribute("fill", corSelecionada);
                tocarSomAcerto();
                salvarProgressoAutomatico();
            } else {
                tocarSomErro();
                // Efeito visual sutil de erro (pisca borda vermelha) sem interromper a tela com alert
                parte.style.stroke = "#ef4444";
                parte.style.strokeWidth = "6";
                setTimeout(() => {
                    parte.style.stroke = "#333333";
                    parte.style.strokeWidth = "4";
                }, 350);
            }
        });
    });

    // ========================================================
    // 10. MODOS E BOTÃO DE TELA CHEIA (CROSS-BROWSER)
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

    // Tela Cheia universal com suporte a webkit/iPhone/Android/Desktop
    if (btnTelaCheia) {
        btnTelaCheia.addEventListener("click", () => {
            obterAudioContext();

            const estaCheia = document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.mozFullScreenElement || 
                              document.msFullscreenElement;

            if (!estaCheia) {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(err => console.log(err));
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
                btnTelaCheia.innerText = "⛶ Sair Tela";
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(err => console.log(err));
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                btnTelaCheia.innerText = "⛶ Tela Cheia";
            }
        });

        // Atualizar o texto do botão se o usuário sair pelo teclado (ESC)
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                btnTelaCheia.innerText = "⛶ Tela Cheia";
            }
        });
    }

    // ========================================================
    // 11. PINCEL LIVRE NO CANVAS
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

        // Suporte para toque no celular (Touch events)
        canvas.addEventListener("touchstart", (e) => {
            if (modoAtual !== "pincel") return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            pintando = true;
            ctx.beginPath();
            ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
            e.preventDefault();
        });

        canvas.addEventListener("touchmove", (e) => {
            if (!pintando || modoAtual !== "pincel") return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.strokeStyle = corSelecionada;
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
            e.preventDefault();
        });

        window.addEventListener("touchend", () => {
            pintando = false;
        });
    }

    // ========================================================
    // 12. BOTÃO LIMPAR E BOTÃO SALVAR PNG
    // ========================================================
    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem(`progresso_${idDesenhoAtual}`);
            jaDisparouVitoria = false;
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

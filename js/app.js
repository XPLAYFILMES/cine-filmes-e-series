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
    // 2. SISTEMA DE ÁUDIO WEB OTIMIZADO E SONS SINTETIZADOS
    // ========================================================
    let audioCtx = null;

    function obterAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const desbloquearAudio = () => {
        obterAudioContext();
        window.removeEventListener("pointerdown", desbloquearAudio);
    };
    window.addEventListener("pointerdown", desbloquearAudio);

    function tocarSomAcerto() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;
            const osc = ctxA.createOscillator();
            const gain = ctxA.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(340, agora);
            osc.frequency.exponentialRampToValueAtTime(900, agora + 0.08);

            gain.gain.setValueAtTime(0.4, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.1);

            osc.connect(gain);
            gain.connect(ctxA.destination);
            osc.start(agora);
            osc.stop(agora + 0.1);
        } catch (e) {}
    }

    function tocarSomCorFinalizada() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;

            [659.25, 880.00].forEach((freq, idx) => {
                const osc = ctxA.createOscillator();
                const gain = ctxA.createGain();
                const t = agora + (idx * 0.09);

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

                osc.connect(gain);
                gain.connect(ctxA.destination);
                osc.start(t);
                osc.stop(t + 0.25);
            });
        } catch (e) {}
    }

    function tocarSomErro() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;
            const osc = ctxA.createOscillator();
            const gain = ctxA.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(200, agora);
            osc.frequency.linearRampToValueAtTime(140, agora + 0.14);

            gain.gain.setValueAtTime(0.2, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.14);

            osc.connect(gain);
            gain.connect(ctxA.destination);
            osc.start(agora);
            osc.stop(agora + 0.14);
        } catch (e) {}
    }

    function tocarSomVitoria() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;
            const notas = [523.25, 659.25, 783.99, 1046.50, 1318.51];

            notas.forEach((freq, idx) => {
                const osc = ctxA.createOscillator();
                const gain = ctxA.createGain();
                const tempo = agora + (idx * 0.11);

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, tempo);

                gain.gain.setValueAtTime(0.25, tempo);
                gain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.35);

                osc.connect(gain);
                gain.connect(ctxA.destination);
                osc.start(tempo);
                osc.stop(tempo + 0.35);
            });
        } catch (e) {}
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
    // 3. INJEÇÃO DO DESENHO ESCOLHIDO PELA URL
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
    // 4. ELEMENTOS DO DOM E ESTADOS INICIAIS
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
    // 5. INSERÇÃO DOS BADGES CONTADORES NA PALETA
    // ========================================================
    botoesCor.forEach(botao => {
        let badge = botao.querySelector(".badge-contador");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "badge-contador";
            badge.innerText = "0";
            botao.appendChild(badge);
        }
    });

    // ========================================================
    // 6. GESTÃO DE CORES CONCLUÍDAS E SELEÇÃO AUTOMÁTICA
    // ========================================================
    function atualizarStatusDasCores() {
        const contagemTotal = {};
        const contagemConcluidas = {};

        partesSvg.forEach(parte => {
            const num = parte.getAttribute("data-numero");
            const cor = parte.getAttribute("fill");
            const pintado = (cor && cor.toLowerCase() !== "#ffffff" && cor.toLowerCase() !== "#fff" && cor !== "rgb(255, 255, 255)");

            contagemTotal[num] = (contagemTotal[num] || 0) + 1;
            if (pintado) {
                contagemConcluidas[num] = (contagemConcluidas[num] || 0) + 1;
            }
        });

        let corAtualFinalizada = false;

        botoesCor.forEach(botao => {
            const num = botao.getAttribute("data-numero");
            const total = contagemTotal[num] || 0;
            const prontas = contagemConcluidas[num] || 0;
            const restantes = total - prontas;

            const badge = botao.querySelector(".badge-contador");

            if (total === 0) {
                botao.style.display = "none";
                return;
            }

            botao.style.display = "flex";

            if (badge) {
                badge.innerText = restantes;
            }

            if (restantes <= 0) {
                botao.classList.add("concluida");
                botao.setAttribute("title", `Número ${num} concluído!`);
                if (num === numeroSelecionado) {
                    corAtualFinalizada = true;
                }
            } else {
                botao.classList.remove("concluida");
                botao.removeAttribute("title");
            }
        });

        if (corAtualFinalizada) {
            tocarSomCorFinalizada();
            selecionarProximaCorDisponivel();
        }

        destacarAreasPendentes();
    }

    function selecionarProximaCorDisponivel() {
        let selecionou = false;
        botoesCor.forEach(botao => {
            if (!selecionou && !botao.classList.contains("concluida") && botao.style.display !== "none") {
                botoesCor.forEach(b => b.classList.remove("ativa"));
                botao.classList.add("ativa");
                corSelecionada = botao.getAttribute("data-hex");
                numeroSelecionado = botao.getAttribute("data-numero");
                selecionou = true;
            }
        });
    }

    // ========================================================
    // 7. DESTAQUE PULSANTE (GLOW) NAS ÁREAS PENDENTES
    // ========================================================
    function destacarAreasPendentes() {
        partesSvg.forEach(parte => {
            const num = parte.getAttribute("data-numero");
            const cor = parte.getAttribute("fill");
            const pintado = (cor && cor.toLowerCase() !== "#ffffff" && cor.toLowerCase() !== "#fff" && cor !== "rgb(255, 255, 255)");

            if (!pintado && num === numeroSelecionado && modoAtual === "balde") {
                parte.classList.add("parte-pendente-ativa");
            } else {
                parte.classList.remove("parte-pendente-ativa");
            }
        });
    }

    // ========================================================
    // 8. ATUALIZAR BARRA DE PROGRESSO E VITÓRIA GERAL
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
    // 9. SALVAR PROGRESSO AUTOMÁTICO NO NAVEGADOR
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
        atualizarStatusDasCores();

        localStorage.setItem(`progresso_${idDesenhoAtual}`, JSON.stringify({
            porcentagem: porcentagem,
            cores: estadoCores
        }));
    }

    // ========================================================
    // 10. RESTAURAR PINTURA SALVA ANTERIORMENTE
    // ========================================================
    function restaurarPinturaSalva() {
        const dadosSalvos = localStorage.getItem(`progresso_${idDesenhoAtual}`);
        if (!dadosSalvos) {
            atualizarStatusDasCores();
            return;
        }

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

        atualizarStatusDasCores();
    }

    restaurarPinturaSalva();

    // ========================================================
    // 11. EVENTOS DA PALETA DE CORES
    // ========================================================
    botoesCor.forEach(botao => {
        botao.addEventListener("click", () => {
            obterAudioContext();

            if (botao.classList.contains("concluida")) {
                tocarSomErro();
                return;
            }

            botoesCor.forEach(b => b.classList.remove("ativa"));
            botao.classList.add("ativa");
            corSelecionada = botao.getAttribute("data-hex");
            numeroSelecionado = botao.getAttribute("data-numero");

            destacarAreasPendentes();
        });
    });

    // ========================================================
    // 12. PINTURA POR NÚMEROS (MODO BALDE)
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
                parte.style.stroke = "#ef4444";
                parte.style.strokeWidth = "6";
                setTimeout(() => {
                    parte.style.stroke = "#333333";
                    parte.style.strokeWidth = "4";
                    destacarAreasPendentes();
                }, 300);
            }
        });
    });

    // ========================================================
    // 13. ALTERNÂNCIA DE FERRAMENTAS E TELA CHEIA
    // ========================================================
    if (btnBalde && btnPincel) {
        btnBalde.addEventListener("click", () => {
            modoAtual = "balde";
            btnBalde.classList.add("ativo");
            btnPincel.classList.remove("ativo");
            if (canvas) canvas.style.pointerEvents = "none";
            destacarAreasPendentes();
        });

        btnPincel.addEventListener("click", () => {
            modoAtual = "pincel";
            btnPincel.classList.add("ativo");
            btnBalde.classList.remove("ativo");
            if (canvas) canvas.style.pointerEvents = "auto";
            partesSvg.forEach(p => p.classList.remove("parte-pendente-ativa"));
        });
    }

    if (btnTelaCheia) {
        btnTelaCheia.addEventListener("click", () => {
            obterAudioContext();

            const estaCheia = document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.mozFullScreenElement || 
                              document.msFullscreenElement;

            if (!estaCheia) {
                const elem = document.documentElement;
                if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
                else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
                else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
                btnTelaCheia.innerText = "⛶ Sair Tela";
            } else {
                if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                btnTelaCheia.innerText = "⛶ Tela Cheia";
            }
        });

        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                btnTelaCheia.innerText = "⛶ Tela Cheia";
            }
        });
    }

    // ========================================================
    // 14. PINCEL LIVRE NO CANVAS (TOUCH + MOUSE)
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
    // 15. LIMPAR E SALVAR PNG
    // ========================================================
    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem(`progresso_${idDesenhoAtual}`);
            jaDisparouVitoria = false;
            atualizarBarraVisual(0, false);
            atualizarStatusDasCores();
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

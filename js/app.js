document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE DESENHOS SVG E METADADOS
    // ========================================================
    const catalogoSVG = {
        desenho_1: {
            titulo: "Estrela Mágica",
            viewBox: "0 0 300 300",
            cores: [
                { numero: "1", hex: "#e74c3c" },
                { numero: "2", hex: "#3498db" },
                { numero: "3", hex: "#f1c40f" }
            ],
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
            cores: [
                { numero: "1", hex: "#e74c3c" },
                { numero: "2", hex: "#3498db" },
                { numero: "3", hex: "#9b59b6" },
                { numero: "4", hex: "#f1c40f" }
            ],
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
            cores: [
                { numero: "1", hex: "#e74c3c" },
                { numero: "2", hex: "#f1c40f" }
            ],
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
    // 2. SISTEMA DE ÁUDIO WEB OTIMIZADO
    // ========================================================
    let audioCtx = null;

    function obterAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
        return audioCtx;
    }

    const desbloquear = () => {
        obterAudioContext();
        window.removeEventListener("pointerdown", desbloquear);
    };
    window.addEventListener("pointerdown", desbloquear);

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

    function tocarSomDica() {
        try {
            const ctxA = obterAudioContext();
            if (!ctxA) return;
            const agora = ctxA.currentTime;
            const osc = ctxA.createOscillator();
            const gain = ctxA.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, agora);
            osc.frequency.exponentialRampToValueAtTime(1200, agora + 0.15);
            gain.gain.setValueAtTime(0.25, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.2);
            osc.connect(gain);
            gain.connect(ctxA.destination);
            osc.start(agora);
            osc.stop(agora + 0.2);
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
            confetti({ particleCount: 150, spread: 85, origin: { y: 0.55 } });
        }
    }

    // ========================================================
    // 3. INJEÇÃO DO DESENHO PELA URL
    // ========================================================
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idDesenhoAtual = parametrosUrl.get("id") || "desenho_1";
    const desenhoDados = catalogoSVG[idDesenhoAtual] || catalogoSVG["desenho_1"];

    // Guarda o último desenho acessado para o banner "Continuar Pintando"
    localStorage.setItem("ultimo_desenho_aberto", idDesenhoAtual);

    const svgElemento = document.getElementById("desenho-svg");
    if (svgElemento) {
        svgElemento.setAttribute("viewBox", desenhoDados.viewBox);
        svgElemento.innerHTML = desenhoDados.svg;
    }

    // ========================================================
    // 4. CONFIGURAÇÃO DA PALETA DINÂMICA
    // ========================================================
    const botoesCor = document.querySelectorAll(".item-cor");
    botoesCor.forEach(botao => {
        const num = botao.getAttribute("data-numero");
        const corObj = desenhoDados.cores.find(c => c.numero === num);
        if (corObj) {
            botao.style.display = "flex";
            botao.style.backgroundColor = corObj.hex;
            botao.setAttribute("data-hex", corObj.hex);
            botao.innerText = corObj.numero;

            let badge = botao.querySelector(".badge-contador");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "badge-contador";
                badge.innerText = "0";
                botao.appendChild(badge);
            }
        } else {
            botao.style.display = "none";
        }
    });

    // ========================================================
    // 5. ELEMENTOS DO DOM, ESTADOS E HISTÓRICO DE DESFAZER
    // ========================================================
    let corSelecionada = desenhoDados.cores[0]?.hex || "#e74c3c";
    let numeroSelecionado = desenhoDados.cores[0]?.numero || "1";
    let modoAtual = "balde";
    let pintando = false;
    let jaEstavaConcluidoInicialmente = false;
    const historicoAcoes = []; // Pilha para a função Desfazer (Undo)

    const partesSvg = document.querySelectorAll(".parte-pintavel");
    const btnBalde = document.getElementById("btn-modo-balde");
    const btnPincel = document.getElementById("btn-modo-pincel");
    const btnDesfazer = document.getElementById("btn-desfazer");
    const btnDica = document.getElementById("btn-dica");
    const btnZoomIn = document.getElementById("btn-zoom-in");
    const btnZoomOut = document.getElementById("btn-zoom-out");
    const btnTelaCheia = document.getElementById("btn-tela-cheia");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnSalvar = document.getElementById("btn-salvar");
    const btnTema = document.getElementById("btn-tema-pintar");

    const pranchetaWrapper = document.getElementById("prancheta-wrapper");
    const containerPan = document.getElementById("container-pan");
    const canvas = document.getElementById("camada-pincel");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const barraAtiva = document.getElementById("barra-progresso-ativa");
    const textoAtivo = document.getElementById("texto-progresso-ativo");
    const modalConclusao = document.getElementById("modal-conclusao");
    const imgModalPreview = document.getElementById("img-modal-preview");
    const btnModalPng = document.getElementById("btn-modal-png");
    const btnModalImprimir = document.getElementById("btn-modal-imprimir");
    const btnModalFechar = document.getElementById("btn-modal-fechar");

    // ========================================================
    // 6. ZOOM E PANORÂMICA (ARRASTAR PRANCHETA)
    // ========================================================
    let escalaZoom = 1;
    let panX = 0, panY = 0;
    let arrastandoPrancheta = false;
    let inicioPanX = 0, inicioPanY = 0;

    function atualizarTransformacaoPrancheta() {
        if (pranchetaWrapper) {
            pranchetaWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${escalaZoom})`;
        }
    }

    if (btnZoomIn) {
        btnZoomIn.addEventListener("click", () => {
            if (escalaZoom < 2.5) {
                escalaZoom += 0.25;
                atualizarTransformacaoPrancheta();
            }
        });
    }

    if (btnZoomOut) {
        btnZoomOut.addEventListener("click", () => {
            if (escalaZoom > 0.8) {
                escalaZoom -= 0.25;
                if (escalaZoom === 1) { panX = 0; panY = 0; }
                atualizarTransformacaoPrancheta();
            }
        });
    }

    if (containerPan) {
        containerPan.addEventListener("mousedown", (e) => {
            if (e.target.classList.contains("parte-pintavel") || modoAtual === "pincel") return;
            arrastandoPrancheta = true;
            inicioPanX = e.clientX - panX;
            inicioPanY = e.clientY - panY;
        });

        window.addEventListener("mousemove", (e) => {
            if (!arrastandoPrancheta) return;
            panX = e.clientX - inicioPanX;
            panY = e.clientY - inicioPanY;
            atualizarTransformacaoPrancheta();
        });

        window.addEventListener("mouseup", () => {
            arrastandoPrancheta = false;
        });
    }

    // ========================================================
    // 7. LÂMPADA DE DICA MÁGICA (ENCONTRAR PEÇA PENDENTE)
    // ========================================================
    if (btnDica) {
        btnDica.addEventListener("click", () => {
            obterAudioContext();
            let pecaEncontrada = null;

            // Busca a primeira peça pendente do número ativo
            partesSvg.forEach(parte => {
                if (pecaEncontrada) return;
                const num = parte.getAttribute("data-numero");
                const cor = parte.getAttribute("fill");
                const pintado = (cor && cor.toLowerCase() !== "#ffffff" && cor.toLowerCase() !== "#fff" && cor !== "rgb(255, 255, 255)");
                if (!pintado && num === numeroSelecionado) {
                    pecaEncontrada = parte;
                }
            });

            if (pecaEncontrada) {
                tocarSomDica();
                pecaEncontrada.classList.add("destaque-dica");
                setTimeout(() => {
                    pecaEncontrada.classList.remove("destaque-dica");
                }, 2400);
            }
        });
    }

    // ========================================================
    // 8. FUNÇÃO DESFAZER (UNDO)
    // ========================================================
    function salvarEstadoCanvasParaUndo() {
        if (!canvas) return;
        historicoAcoes.push({
            tipo: "pincel",
            dados: ctx.getImageData(0, 0, canvas.width, canvas.height)
        });
    }

    if (btnDesfazer) {
        btnDesfazer.addEventListener("click", () => {
            if (historicoAcoes.length === 0) return;
            const ultimaAcao = historicoAcoes.pop();

            if (ultimaAcao.tipo === "balde") {
                ultimaAcao.elemento.setAttribute("fill", ultimaAcao.corAnterior);
                salvarProgressoAutomatico();
            } else if (ultimaAcao.tipo === "pincel" && ctx) {
                ctx.putImageData(ultimaAcao.dados, 0, 0);
            }
        });
    }

    // ========================================================
    // 9. GESTÃO DE CORES, CONTADORES E AUTO-SELEÇÃO
    // ========================================================
    function atualizarStatusDasCores(tocarSom = true) {
        const contagemTotal = {};
        const contagemConcluidas = {};

        partesSvg.forEach(parte => {
            const num = parte.getAttribute("data-numero");
            const cor = parte.getAttribute("fill");
            const pintado = (cor && cor.toLowerCase() !== "#ffffff" && cor.toLowerCase() !== "#fff" && cor !== "rgb(255, 255, 255)");

            contagemTotal[num] = (contagemTotal[num] || 0) + 1;
            if (pintado) contagemConcluidas[num] = (contagemConcluidas[num] || 0) + 1;
        });

        let corAtualFinalizada = false;

        botoesCor.forEach(botao => {
            if (botao.style.display === "none") return;
            const num = botao.getAttribute("data-numero");
            const total = contagemTotal[num] || 0;
            const prontas = contagemConcluidas[num] || 0;
            const restantes = total - prontas;

            const badge = botao.querySelector(".badge-contador");
            if (badge) badge.innerText = restantes;

            if (restantes <= 0 && total > 0) {
                botao.classList.add("concluida");
                if (num === numeroSelecionado) corAtualFinalizada = true;
            } else {
                botao.classList.remove("concluida");
            }
        });

        if (corAtualFinalizada) {
            if (tocarSom) tocarSomCorFinalizada();
            selecionarProximaCorDisponivel();
        }

        destacarAreasPendentes();
    }

    function selecionarProximaCorDisponivel() {
        let selecionou = false;
        botoesCor.forEach(botao => {
            if (!selecionou && botao.style.display !== "none" && !botao.classList.contains("concluida")) {
                botoesCor.forEach(b => b.classList.remove("ativa"));
                botao.classList.add("ativa");
                corSelecionada = botao.getAttribute("data-hex");
                numeroSelecionado = botao.getAttribute("data-numero");
                selecionou = true;
            }
        });
    }

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
    // 10. ATUALIZAR BARRA E MODAL DE CONCLUSÃO 100%
    // ========================================================
    function abrirModalVitoria() {
        gerarDataURLFinal((dataUrl) => {
            if (imgModalPreview) imgModalPreview.src = dataUrl;
            if (modalConclusao) modalConclusao.style.display = "flex";
        });
    }

    function atualizarBarraVisual(porcentagem, concluido, emitirComemoracao = true) {
        if (barraAtiva) barraAtiva.style.width = `${porcentagem}%`;
        if (textoAtivo) textoAtivo.innerText = `${porcentagem}% Concluído`;

        if (concluido && emitirComemoracao && !jaEstavaConcluidoInicialmente) {
            jaEstavaConcluidoInicialmente = true;
            tocarSomVitoria();
            dispararConfetes();
            setTimeout(abrirModalVitoria, 800);
        }
    }

    // ========================================================
    // 11. SALVAMENTO AUTOMÁTICO E RESTAURAÇÃO
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

        atualizarBarraVisual(porcentagem, concluido, true);
        atualizarStatusDasCores(true);

        localStorage.setItem(`progresso_${idDesenhoAtual}`, JSON.stringify({
            porcentagem: porcentagem,
            cores: estadoCores
        }));
    }

    function restaurarPinturaSalva() {
        const dadosSalvos = localStorage.getItem(`progresso_${idDesenhoAtual}`);
        if (!dadosSalvos) {
            atualizarStatusDasCores(false);
            return;
        }

        try {
            const dados = JSON.parse(dadosSalvos);
            if (dados.cores) {
                Object.keys(dados.cores).forEach(index => {
                    const idx = parseInt(index, 10);
                    if (partesSvg[idx]) partesSvg[idx].setAttribute("fill", dados.cores[idx]);
                });
            }
            const pct = dados.porcentagem || 0;
            const foiConcluido = (pct === 100);
            if (foiConcluido) jaEstavaConcluidoInicialmente = true;
            atualizarBarraVisual(pct, foiConcluido, false);
        } catch (e) {}

        atualizarStatusDasCores(false);
    }

    restaurarPinturaSalva();

    // ========================================================
    // 12. EVENTOS DA PALETA E CLIQUE DE PINTURA
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

    partesSvg.forEach(parte => {
        parte.addEventListener("click", () => {
            if (modoAtual !== "balde") return;
            obterAudioContext();

            const numeroParte = parte.getAttribute("data-numero");
            if (numeroParte === numeroSelecionado) {
                const corAntiga = parte.getAttribute("fill");
                historicoAcoes.push({
                    tipo: "balde",
                    elemento: parte,
                    corAnterior: corAntiga
                });

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
    // 13. ALTERNÂNCIA DE FERRAMENTAS E TEMA
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
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                btnTelaCheia.innerText = "⛶ Sair";
            } else {
                document.exitFullscreen().catch(() => {});
                btnTelaCheia.innerText = "⛶ Tela";
            }
        });
    }

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            btnTema.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    // ========================================================
    // 14. PINCEL LIVRE COM SUPORTE A UNDO
    // ========================================================
    if (canvas && ctx) {
        canvas.style.pointerEvents = "none";

        canvas.addEventListener("mousedown", (e) => {
            if (modoAtual !== "pincel") return;
            salvarEstadoCanvasParaUndo();
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

        window.addEventListener("mouseup", () => { pintando = false; });
    }

    // ========================================================
    // 15. EXPORTAÇÃO, IMPRESSÃO A4 E BOTÃO LIMPAR
    // ========================================================
    function gerarDataURLFinal(callback) {
        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = 600;
        canvasFinal.height = 600;
        const ctxFinal = canvasFinal.getContext("2d");

        ctxFinal.fillStyle = "#ffffff";
        ctxFinal.fillRect(0, 0, 600, 600);

        const svgString = new XMLSerializer().serializeToString(svgElemento);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const urlSvg = URL.createObjectURL(svgBlob);

        const imgSvg = new Image();
        imgSvg.onload = () => {
            ctxFinal.drawImage(imgSvg, 0, 0, 600, 600);
            if (canvas) ctxFinal.drawImage(canvas, 0, 0, 600, 600);
            callback(canvasFinal.toDataURL("image/png"));
            URL.revokeObjectURL(urlSvg);
        };
        imgSvg.src = urlSvg;
    }

    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            gerarDataURLFinal((dataUrl) => {
                const linkDownload = document.createElement("a");
                linkDownload.download = `${idDesenhoAtual}-colorido.png`;
                linkDownload.href = dataUrl;
                linkDownload.click();
            });
        });
    }

    if (btnModalPng) {
        btnModalPng.addEventListener("click", () => {
            if (btnSalvar) btnSalvar.click();
        });
    }

    if (btnModalImprimir) {
        btnModalImprimir.addEventListener("click", () => {
            gerarDataURLFinal((dataUrl) => {
                const janelaImpressao = window.open("", "_blank");
                janelaImpressao.document.write(`
                    <html>
                    <head>
                        <title>Imprimir Arte A4 - ColorirOnline</title>
                        <style>
                            @page { size: A4; margin: 20mm; }
                            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
                            img { max-width: 90%; max-height: 80vh; border: 2px solid #333; border-radius: 8px; }
                            h2 { margin-bottom: 15px; color: #1e293b; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        <h2>Obra: ${desenhoDados.titulo}</h2>
                        <img src="${dataUrl}">
                    </body>
                    </html>
                `);
                janelaImpressao.document.close();
            });
        });
    }

    if (btnModalFechar && modalConclusao) {
        btnModalFechar.addEventListener("click", () => {
            modalConclusao.style.display = "none";
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            partesSvg.forEach(parte => parte.setAttribute("fill", "#ffffff"));
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem(`progresso_${idDesenhoAtual}`);
            jaEstavaConcluidoInicialmente = false;
            atualizarBarraVisual(0, false, false);
            atualizarStatusDasCores(false);
        });
    }
});

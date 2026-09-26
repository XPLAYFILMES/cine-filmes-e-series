/* ========================================================
   BLOCO 1: IDENTIFICAÇÃO E CARREGAMENTO DO DESENHO REAL
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idDesenho = params.get("id");

    const bancoPainel = JSON.parse(localStorage.getItem("db_desenhos") || "[]");
    let desenhoAtual = null;

    if (idDesenho) {
        desenhoAtual = bancoPainel.find(d => String(d.id) === String(idDesenho));
    }

    if (!desenhoAtual && bancoPainel.length > 0) {
        desenhoAtual = bancoPainel[0];
    }

    // Fallback de segurança se não houver desenhos cadastrados
    if (!desenhoAtual) {
        desenhoAtual = {
            id: "desenho_padrao",
            titulo: "Joaninha na Flor",
            imagem: null,
            svg: null
        };
    }

    localStorage.setItem("ultimo_desenho_aberto", desenhoAtual.id);

    const svgPrancheta = document.getElementById("desenho-svg");
    const camadaCanvas = document.getElementById("camada-pincel");
    const ctxCanvas = camadaCanvas ? camadaCanvas.getContext("2d") : null;
    const barraPaleta = document.getElementById("barra-paleta");
    const barraProgresso = document.getElementById("barra-progresso-ativa");
    const textoProgresso = document.getElementById("texto-progresso-ativo");
    const pranchetaWrapper = document.getElementById("prancheta-wrapper");

    // Cores padronizadas para cada número do desenho
    const paletaTematica = [
        { num: 1, hex: "#fbbf24", nome: "Amarelo Pétalas" },
        { num: 2, hex: "#f59e0b", nome: "Laranja Miolo" },
        { num: 3, hex: "#22c55e", nome: "Verde Folha/Caule" },
        { num: 4, hex: "#ef4444", nome: "Vermelho Asas" },
        { num: 5, hex: "#1e293b", nome: "Preto Bolinhas" },
        { num: 6, hex: "#fde68a", nome: "Bege Rosto" },
        { num: 7, hex: "#f472b6", nome: "Rosa Bochechas" }
    ];

    let corAtivaNumero = 1;
    let corAtivaHex = "#fbbf24";
    let modoAtual = "balde";
    let nivelZoom = 1;
    let historicoAcoes = [];
    let partesDoDesenho = [];

    /* ========================================================
       BLOCO 2: MONTAGEM DA IMAGEM ORIGINAL COM REGIÕES REAIS
       ======================================================== */
    function carregarDesenhoNaPrancheta() {
        if (!svgPrancheta) return;
        svgPrancheta.innerHTML = "";

        // Recupera o histórico salvo para manter o progresso
        const salvo = localStorage.getItem(`progresso_${desenhoAtual.id}`);
        let coresSalvas = {};
        if (salvo) {
            try { coresSalvas = JSON.parse(salvo).cores || {}; } catch (e) {}
        }

        // Se for a imagem original enviada (Upload ou Link URL da Imagem 1)
        if (desenhoAtual.imagem) {
            svgPrancheta.setAttribute("viewBox", "0 0 500 500");
            svgPrancheta.innerHTML = `
                <!-- IMAGEM ORIGINAL COM 100% DE NITIDEZ (IMAGEM 1) -->
                <image href="${desenhoAtual.imagem}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid meet" />

                <g id="camada-partes-anatomicas">
                    <!-- Folha e Caule (Cor 3) -->
                    <path class="parte-pintavel" data-numero="3" data-idx="0" d="M190,410 Q170,460 160,500 L185,500 Q195,450 215,410 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="3" data-idx="1" d="M85,380 C70,420 120,490 200,470 C190,420 130,370 85,380 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>

                    <!-- Pétalas da Flor (Cor 1) -->
                    <path class="parte-pintavel" data-numero="1" data-idx="2" d="M85,250 C55,270 70,320 115,315 C130,290 125,260 85,250 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="3" d="M105,310 C80,350 110,400 155,385 C165,350 150,320 105,310 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="4" d="M145,365 C140,415 190,445 225,415 C230,375 200,355 145,365 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="5" d="M210,380 C235,430 290,420 300,375 C285,340 240,345 210,380 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="6" d="M280,360 C325,385 375,345 355,300 C320,290 290,325 280,360 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="7" d="M315,300 C365,305 385,255 350,225 C320,230 305,270 315,300 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <path class="parte-pintavel" data-numero="1" data-idx="8" d="M110,195 C75,205 85,260 135,250 C145,225 140,200 110,195 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>

                    <!-- Miolo da Flor (Cor 2) -->
                    <ellipse class="parte-pintavel" data-numero="2" data-idx="9" cx="240" cy="300" rx="80" ry="55" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>

                    <!-- Rosto da Joaninha (Cor 6) -->
                    <circle class="parte-pintavel" data-numero="6" data-idx="10" cx="190" cy="145" r="70" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>

                    <!-- Bochechas (Cor 7) -->
                    <circle class="parte-pintavel" data-numero="7" data-idx="11" cx="140" cy="175" r="12" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <circle class="parte-pintavel" data-numero="7" data-idx="12" cx="235" cy="165" r="12" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>

                    <!-- Asas da Joaninha (Cor 4) -->
                    <path class="parte-pintavel" data-numero="4" data-idx="13" d="M250,110 C310,40 435,100 425,220 C340,270 265,225 250,110 Z" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2.5"/>

                    <!-- Bolinhas Pretas das Asas (Cor 5) -->
                    <circle class="parte-pintavel" data-numero="5" data-idx="14" cx="305" cy="100" r="18" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <circle class="parte-pintavel" data-numero="5" data-idx="15" cx="365" cy="140" r="22" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <circle class="parte-pintavel" data-numero="5" data-idx="16" cx="295" cy="170" r="20" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                    <circle class="parte-pintavel" data-numero="5" data-idx="17" cx="375" cy="215" r="20" fill="#ffffff" fill-opacity="0.85" stroke="#1e293b" stroke-width="2"/>
                </g>
            `;
        } else {
            // Renderização para vetores SVG limpos
            svgPrancheta.setAttribute("viewBox", desenhoAtual.viewBox || "0 0 350 420");
            svgPrancheta.innerHTML = desenhoAtual.svg;
        }

        const formas = svgPrancheta.querySelectorAll(".parte-pintavel");

        formas.forEach((forma) => {
            const idx = forma.getAttribute("data-idx");
            const num = forma.getAttribute("data-numero");

            // Restaura a cor se já foi pintada anteriormente
            if (coresSalvas[idx]) {
                forma.setAttribute("fill", coresSalvas[idx]);
                forma.setAttribute("fill-opacity", "0.95");
                forma.setAttribute("data-pintado", "true");
            }

            // Injeta o número centralizado na forma
            try {
                const b = forma.getBBox();
                if (b.width > 6 && b.height > 6) {
                    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txt.setAttribute("class", "label-numero");
                    txt.setAttribute("data-numero", num);
                    txt.setAttribute("data-idx", idx);
                    txt.setAttribute("x", b.x + b.width / 2);
                    txt.setAttribute("y", b.y + b.height / 2 + 5);
                    txt.setAttribute("font-size", b.width > 30 ? "17" : "13");
                    txt.setAttribute("font-weight", "900");
                    txt.setAttribute("fill", "#0f172a");
                    txt.setAttribute("text-anchor", "middle");
                    txt.setAttribute("pointer-events", "none");
                    txt.textContent = num;

                    if (coresSalvas[idx]) {
                        txt.style.display = "none";
                    }

                    svgPrancheta.appendChild(txt);
                }
            } catch (e) {}
        });

        partesDoDesenho = Array.from(svgPrancheta.querySelectorAll(".parte-pintavel"));
    }

    /* ========================================================
       BLOCO 3: PALETA DINÂMICA COM CONTADOR E TROCA AUTOMÁTICA
       ======================================================== */
    function montarPaletaDinamica() {
        if (!barraPaleta) return;
        barraPaleta.innerHTML = "";

        const numerosPresentes = [...new Set(partesDoDesenho.map(p => parseInt(p.getAttribute("data-numero"))))].sort((a, b) => a - b);

        numerosPresentes.forEach((num) => {
            const defCor = paletaTematica.find(c => c.num === num) || { num, hex: "#3b82f6" };
            const restantes = partesDoDesenho.filter(p => parseInt(p.getAttribute("data-numero")) === num && p.getAttribute("data-pintado") !== "true").length;

            const divCor = document.createElement("div");
            divCor.className = `item-cor ${num === corAtivaNumero ? 'ativa' : ''} ${restantes === 0 ? 'concluida' : ''}`;
            divCor.style.backgroundColor = defCor.hex;
            divCor.setAttribute("data-numero", num);
            divCor.setAttribute("data-hex", defCor.hex);

            divCor.innerHTML = `
                ${num}
                <span class="badge-contador">${restantes}</span>
            `;

            divCor.addEventListener("click", () => {
                if (divCor.classList.contains("concluida")) return;
                selecionarCor(num, defCor.hex);
            });

            barraPaleta.appendChild(divCor);
        });

        destacarAreasAtivas();
    }

    function selecionarCor(numero, hex) {
        corAtivaNumero = numero;
        corAtivaHex = hex;
        document.querySelectorAll(".item-cor").forEach(c => c.classList.remove("ativa"));
        const botao = document.querySelector(`.item-cor[data-numero="${numero}"]`);
        if (botao) botao.classList.add("ativa");
        destacarAreasAtivas();
    }

    /* ========================================================
       BLOCO 4: PINTURA E ANIMAÇÃO PULSANTE DA COR ATIVA
       ======================================================== */
    function destacarAreasAtivas() {
        partesDoDesenho.forEach(parte => {
            const num = parseInt(parte.getAttribute("data-numero"));
            const jaPintado = parte.getAttribute("data-pintado") === "true";

            if (num === corAtivaNumero && !jaPintado && modoAtual === "balde") {
                parte.classList.add("parte-pendente-ativa");
            } else {
                parte.classList.remove("parte-pendente-ativa");
            }
        });
    }

    svgPrancheta.addEventListener("click", (e) => {
        if (modoAtual !== "balde") return;

        const parte = e.target.closest(".parte-pintavel");
        if (!parte) return;

        const numParte = parseInt(parte.getAttribute("data-numero"));
        const idxParte = parte.getAttribute("data-idx");

        if (numParte === corAtivaNumero) {
            const corAnterior = parte.getAttribute("fill");
            parte.setAttribute("fill", corAtivaHex);
            parte.setAttribute("fill-opacity", "0.95");
            parte.setAttribute("data-pintado", "true");
            parte.classList.remove("parte-pendente-ativa");

            historicoAcoes.push({ elemento: parte, corAntiga: corAnterior, numParte, idx: idxParte });

            // Remove o número visível daquela região preenchida
            const rotulos = svgPrancheta.querySelectorAll(`.label-numero[data-idx="${idxParte}"]`);
            if (rotulos.length > 0) {
                rotulos[0].style.display = "none";
            }

            atualizarProgresso();
            verificarAvancoAutomaticoCor();
        } else {
            // Efeito de aviso: pisca a cor correta na paleta caso clique errado
            const btnCerto = document.querySelector(`.item-cor[data-numero="${numParte}"]`);
            if (btnCerto) {
                btnCerto.style.transform = "scale(1.3)";
                setTimeout(() => btnCerto.style.transform = "", 250);
            }
        }
    });

    // Avanço Automático: quando a cor atual termina, pula para a próxima cor pendente
    function verificarAvancoAutomaticoCor() {
        const pendentesDestaCor = partesDoDesenho.filter(p => parseInt(p.getAttribute("data-numero")) === corAtivaNumero && p.getAttribute("data-pintado") !== "true").length;

        if (pendentesDestaCor === 0) {
            // Procura o próximo número que ainda tem partes por pintar
            const proximaParte = partesDoDesenho.find(p => p.getAttribute("data-pintado") !== "true");
            if (proximaParte) {
                const proximoNum = parseInt(proximaParte.getAttribute("data-numero"));
                const defCor = paletaTematica.find(c => c.num === proximoNum) || { hex: "#3b82f6" };
                setTimeout(() => {
                    selecionarCor(proximoNum, defCor.hex);
                }, 300);
            }
        }
    }

    /* ========================================================
       BLOCO 5: PROGRESSO E CONCLUSÃO (SALVAMENTO COMPLETO)
       ======================================================== */
    function atualizarProgresso() {
        const total = partesDoDesenho.length;
        const pintadas = partesDoDesenho.filter(p => p.getAttribute("data-pintado") === "true").length;
        const porcentagem = total > 0 ? Math.round((pintadas / total) * 100) : 0;

        if (barraProgresso) barraProgresso.style.width = `${porcentagem}%`;
        if (textoProgresso) textoProgresso.innerText = `${porcentagem}% Concluído`;

        // Salva mapa de cores exatas por índice de cada elemento
        const mapaCores = {};
        partesDoDesenho.forEach(p => {
            const idx = p.getAttribute("data-idx");
            if (p.getAttribute("data-pintado") === "true") {
                mapaCores[idx] = p.getAttribute("fill");
            }
        });

        localStorage.setItem(`progresso_${desenhoAtual.id}`, JSON.stringify({
            porcentagem: porcentagem,
            cores: mapaCores
        }));

        montarPaletaDinamica();

        if (porcentagem === 100) {
            if (typeof confetti === "function") {
                confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
            }
            abrirModalConclusao();
        }
    }

    function abrirModalConclusao() {
        const modal = document.getElementById("modal-conclusao");
        const imgPreview = document.getElementById("img-modal-preview");
        if (!modal) return;

        const svgData = new XMLSerializer().serializeToString(svgPrancheta);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const URLObj = window.URL || window.webkitURL || window;
        const blobURL = URLObj.createObjectURL(svgBlob);

        if (imgPreview) imgPreview.src = blobURL;
        modal.style.display = "flex";
    }

    /* ========================================================
       BLOCO 6: FERRAMENTAS SUPERIORES (PINCEL, DESFAZER, ZOOM, DICA)
       ======================================================== */
    const btnModoBalde = document.getElementById("btn-modo-balde");
    const btnModoPincel = document.getElementById("btn-modo-pincel");
    const btnDesfazer = document.getElementById("btn-desfazer");
    const btnDica = document.getElementById("btn-dica");
    const btnZoomIn = document.getElementById("btn-zoom-in");
    const btnZoomOut = document.getElementById("btn-zoom-out");
    const btnTelaCheia = document.getElementById("btn-tela-cheia");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnSalvar = document.getElementById("btn-salvar");
    const btnTema = document.getElementById("btn-tema-pintar");

    if (btnModoBalde && btnModoPincel) {
        btnModoBalde.addEventListener("click", () => {
            modoAtual = "balde";
            btnModoBalde.classList.add("ativo");
            btnModoPincel.classList.remove("ativo");
            if (camadaCanvas) camadaCanvas.style.pointerEvents = "none";
            destacarAreasAtivas();
        });

        btnModoPincel.addEventListener("click", () => {
            modoAtual = "pincel";
            btnModoPincel.classList.add("ativo");
            btnModoBalde.classList.remove("ativo");
            if (camadaCanvas) camadaCanvas.style.pointerEvents = "auto";
            partesDoDesenho.forEach(p => p.classList.remove("parte-pendente-ativa"));
        });
    }

    if (camadaCanvas && ctxCanvas) {
        camadaCanvas.style.pointerEvents = "none";
        let desenhando = false;

        camadaCanvas.addEventListener("mousedown", (e) => {
            if (modoAtual !== "pincel") return;
            desenhando = true;
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(e.offsetX, e.offsetY);
        });

        camadaCanvas.addEventListener("mousemove", (e) => {
            if (!desenhando || modoAtual !== "pincel") return;
            ctxCanvas.lineTo(e.offsetX, e.offsetY);
            ctxCanvas.strokeStyle = corAtivaHex;
            ctxCanvas.lineWidth = 6;
            ctxCanvas.lineCap = "round";
            ctxCanvas.stroke();
        });

        window.addEventListener("mouseup", () => { desenhando = false; });
    }

    if (btnDesfazer) {
        btnDesfazer.addEventListener("click", () => {
            if (historicoAcoes.length === 0) return;
            const ultima = historicoAcoes.pop();
            ultima.elemento.setAttribute("fill", ultima.corAntiga || "#ffffff");
            ultima.elemento.removeAttribute("data-pintado");

            const rotulos = svgPrancheta.querySelectorAll(`.label-numero[data-idx="${ultima.idx}"]`);
            if (rotulos.length > 0) rotulos[0].style.display = "block";

            atualizarProgresso();
        });
    }

    if (btnDica) {
        btnDica.addEventListener("click", () => {
            const pendente = partesDoDesenho.find(p => parseInt(p.getAttribute("data-numero")) === corAtivaNumero && p.getAttribute("data-pintado") !== "true");
            if (pendente) {
                pendente.classList.add("destaque-dica");
                setTimeout(() => pendente.classList.remove("destaque-dica"), 2200);
            }
        });
    }

    if (btnZoomIn && btnZoomOut && pranchetaWrapper) {
        btnZoomIn.addEventListener("click", () => {
            if (nivelZoom < 2.5) {
                nivelZoom += 0.25;
                pranchetaWrapper.style.transform = `scale(${nivelZoom})`;
            }
        });

        btnZoomOut.addEventListener("click", () => {
            if (nivelZoom > 0.75) {
                nivelZoom -= 0.25;
                pranchetaWrapper.style.transform = `scale(${nivelZoom})`;
            }
        });
    }

    if (btnTelaCheia) {
        btnTelaCheia.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            if (!confirm("Deseja reiniciar a pintura deste desenho?")) return;
            partesDoDesenho.forEach(p => {
                p.setAttribute("fill", "#ffffff");
                p.removeAttribute("data-pintado");
            });
            svgPrancheta.querySelectorAll(".label-numero").forEach(l => l.style.display = "block");
            if (ctxCanvas) ctxCanvas.clearRect(0, 0, camadaCanvas.width, camadaCanvas.height);
            historicoAcoes = [];
            atualizarProgresso();
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            alert("Progresso salvo com sucesso!");
        });
    }

    if (btnTema) {
        if (localStorage.getItem("tema_colorir_online") === "dark") {
            document.body.classList.add("dark-mode");
            btnTema.innerText = "☀️";
        }
        btnTema.addEventListener("click", () => {
            const escuro = document.body.classList.toggle("dark-mode");
            btnTema.innerText = escuro ? "☀️" : "🌙";
            localStorage.setItem("tema_colorir_online", escuro ? "dark" : "light");
        });
    }

    /* ========================================================
       BLOCO 7: AÇÕES DO MODAL (BAIXAR HD E IMPRIMIR EM FOLHA A4)
       ======================================================== */
    const btnModalFechar = document.getElementById("btn-modal-fechar");
    const btnModalPng = document.getElementById("btn-modal-png");
    const btnModalImprimir = document.getElementById("btn-modal-imprimir");
    const modalConclusao = document.getElementById("modal-conclusao");

    if (btnModalFechar && modalConclusao) {
        btnModalFechar.addEventListener("click", () => { modalConclusao.style.display = "none"; });
    }

    if (btnModalPng) {
        btnModalPng.addEventListener("click", () => {
            const svgData = new XMLSerializer().serializeToString(svgPrancheta);
            const canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 800;
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, 800, 800);
                ctx.drawImage(img, 0, 0, 800, 800);
                const a = document.createElement("a");
                a.download = `${desenhoAtual.titulo || 'desenho'}_concluido.png`;
                a.href = canvas.toDataURL("image/png");
                a.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        });
    }

    if (btnModalImprimir) {
        btnModalImprimir.addEventListener("click", () => {
            const svgData = new XMLSerializer().serializeToString(svgPrancheta);
            const win = window.open("", "_blank");
            win.document.write(`
                <html>
                <head>
                    <title>Imprimir ${desenhoAtual.titulo}</title>
                    <style>
                        @page { size: A4 portrait; margin: 12mm; }
                        body { font-family: Arial, sans-serif; text-align: center; color: #0f172a; margin: 0; padding: 10px; }
                        .cabecalho-escola { border: 2px solid #000; border-radius: 8px; padding: 10px; margin-bottom: 20px; font-size: 13px; font-weight: bold; }
                        .linha { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .desenho-impresso { width: 90%; max-width: 500px; height: auto; margin: 20px auto; }
                    </style>
                </head>
                <body onload="window.print();">
                    <div class="cabecalho-escola">
                        <div class="linha"><span>ESCOLA: ____________________________________</span><span>DATA: ____/____/________</span></div>
                        <div class="linha"><span>ALUNO(A): __________________________________</span><span>TURMA: ______________</span></div>
                    </div>
                    <h2>${desenhoAtual.titulo}</h2>
                    <div class="desenho-impresso">${svgData}</div>
                </body>
                </html>
            `);
            win.document.close();
        });
    }

    // Inicialização da tela de pintura
    carregarDesenhoNaPrancheta();
    montarPaletaDinamica();
    atualizarProgresso();
});

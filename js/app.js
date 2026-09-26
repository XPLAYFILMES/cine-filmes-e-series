/* ========================================================
   BLOCO 1: RECONHECIMENTO DO DESENHO REAL E DEFINIÇÕES
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idDesenho = params.get("id") || "joaninha";

    localStorage.setItem("ultimo_desenho_aberto", idDesenho);

    // Vetor oficial da Joaninha na Flor com divisões anatômicas reais por números (Imagem 1 e 3)
    const svgJoaninhaReal = `
        <!-- Caule e Folha (Verde - Cor 3) -->
        <path class="parte-pintavel" data-numero="3" d="M145,280 Q130,330 110,380 L125,380 Q145,330 158,280 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="3" d="M125,310 C80,300 50,340 55,390 C90,410 140,360 135,325 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>

        <!-- Pétalas da Flor (Amarelo - Cor 1) -->
        <path class="parte-pintavel" data-numero="1" d="M60,190 C40,210 50,240 80,245 C95,230 95,200 75,190 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M70,240 C50,270 70,300 100,295 C115,275 110,250 85,240 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M95,285 C85,325 120,350 145,335 C150,305 130,285 105,280 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M140,305 C150,350 190,350 205,320 C195,290 165,285 145,300 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M195,290 C225,320 265,300 260,265 C235,250 205,265 195,285 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M225,245 C265,255 285,220 270,185 C240,180 220,210 220,240 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path class="parte-pintavel" data-numero="1" d="M75,150 C55,165 70,195 100,190 C110,170 100,145 80,145 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>

        <!-- Miolo da Flor com Textura (Laranja Claro - Cor 2) -->
        <ellipse class="parte-pintavel" data-numero="2" cx="165" cy="225" rx="55" ry="38" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>

        <!-- Patinhas da Joaninha (Preto - Cor 5) -->
        <path class="parte-pintavel" data-numero="5" d="M140,190 Q135,215 145,225" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
        <path class="parte-pintavel" data-numero="5" d="M165,200 Q155,230 170,240" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
        <path class="parte-pintavel" data-numero="5" d="M220,205 Q220,235 235,245" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
        <path class="parte-pintavel" data-numero="5" d="M260,195 Q265,225 280,230" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>

        <!-- Cabeça da Joaninha (Pele / Bege - Cor 6) -->
        <ellipse class="parte-pintavel" data-numero="6" cx="130" cy="115" rx="48" ry="42" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>

        <!-- Bochechas (Rosa - Cor 7) -->
        <circle class="parte-pintavel" data-numero="7" cx="95" cy="130" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <circle class="parte-pintavel" data-numero="7" cx="160" cy="120" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>

        <!-- Olhos (Preto - Cor 5) -->
        <ellipse class="parte-pintavel" data-numero="5" cx="108" cy="105" rx="10" ry="14" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <ellipse class="parte-pintavel" data-numero="5" cx="148" cy="98" rx="10" ry="14" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>

        <!-- Antenas (Preto - Cor 5) -->
        <path class="parte-pintavel" data-numero="5" d="M110,80 Q95,45 80,55" fill="none" stroke="#1e293b" stroke-width="3"/>
        <circle class="parte-pintavel" data-numero="5" cx="80" cy="55" r="5" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <path class="parte-pintavel" data-numero="5" d="M140,75 Q150,40 170,45" fill="none" stroke="#1e293b" stroke-width="3"/>
        <circle class="parte-pintavel" data-numero="5" cx="170" cy="45" r="5" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>

        <!-- Asas da Joaninha (Vermelho - Cor 4) -->
        <path class="parte-pintavel" data-numero="4" d="M175,90 C220,40 300,90 295,170 C240,210 185,170 175,90 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>

        <!-- Pintinhas da Asa (Preto - Cor 5) -->
        <circle class="parte-pintavel" data-numero="5" cx="215" cy="85" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <circle class="parte-pintavel" data-numero="5" cx="255" cy="115" r="15" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <circle class="parte-pintavel" data-numero="5" cx="205" cy="135" r="15" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <circle class="parte-pintavel" data-numero="5" cx="265" cy="165" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
    `;

    // Busca no banco do painel
    const desenhosPainel = JSON.parse(localStorage.getItem("db_desenhos") || "[]");
    let desenhoAtual = desenhosPainel.find(d => String(d.id) === String(idDesenho));

    // Se não encontrou ou for a joaninha, carrega a estrutura anatômica oficial
    if (!desenhoAtual || idDesenho === "joaninha") {
        desenhoAtual = {
            id: "joaninha",
            titulo: "Joaninha na Flor",
            viewBox: "0 0 350 420",
            svg: svgJoaninhaReal
        };
    }

    const svgPrancheta = document.getElementById("desenho-svg");
    const camadaCanvas = document.getElementById("camada-pincel");
    const ctxCanvas = camadaCanvas ? camadaCanvas.getContext("2d") : null;
    const barraPaleta = document.getElementById("barra-paleta");
    const barraProgresso = document.getElementById("barra-progresso-ativa");
    const textoProgresso = document.getElementById("texto-progresso-ativo");
    const pranchetaWrapper = document.getElementById("prancheta-wrapper");

    // Paleta de Cores Temática e Calibrada para a Joaninha e Natureza (Imagem 3)
    const paletaTematica = [
        { num: 1, hex: "#fbbf24", nome: "Amarelo Pétala" },
        { num: 2, hex: "#f59e0b", nome: "Laranja Miolo" },
        { num: 3, hex: "#22c55e", nome: "Verde Folha" },
        { num: 4, hex: "#ef4444", nome: "Vermelho Asa" },
        { num: 5, hex: "#1e293b", nome: "Preto Bolinhas" },
        { num: 6, hex: "#fde68a", nome: "Bege Rostinho" },
        { num: 7, hex: "#f472b6", nome: "Rosa Bochecha" }
    ];

    let corAtivaNumero = 1;
    let corAtivaHex = "#fbbf24";
    let modoAtual = "balde";
    let nivelZoom = 1;
    let historicoAcoes = [];
    let partesDoDesenho = [];

   /* ========================================================
       BLOCO 2: MONTAGEM DO DESENHO E RESTAURAÇÃO DAS CORES SALVAS
       ======================================================== */
    function carregarDesenhoNaPrancheta() {
        if (!svgPrancheta) return;
        svgPrancheta.innerHTML = "";

        svgPrancheta.setAttribute("viewBox", desenhoAtual.viewBox || "0 0 350 420");
        svgPrancheta.innerHTML = desenhoAtual.svg || svgJoaninhaReal;

        // Recupera o progresso salvo anteriormente (porcentagem e cores das partes)
        const salvo = localStorage.getItem(`progresso_${desenhoAtual.id}`);
        let coresSalvas = {};
        if (salvo) {
            try {
                const dados = JSON.parse(salvo);
                coresSalvas = dados.cores || {};
            } catch(e) {}
        }

        const formas = svgPrancheta.querySelectorAll(".parte-pintavel");
        
        formas.forEach((forma, index) => {
            if (!forma.getAttribute("data-numero")) {
                forma.setAttribute("data-numero", (index % 7) + 1);
            }

            // Se essa parte já foi pintada anteriormente, restaura a cor real!
            if (coresSalvas[index]) {
                forma.setAttribute("fill", coresSalvas[index]);
                forma.setAttribute("data-pintado", "true");
            } else {
                if (!forma.getAttribute("fill") || forma.getAttribute("fill") === "none") {
                    forma.setAttribute("fill", "#ffffff");
                }
            }

            // Injeta o número na parte apenas se ela ainda NÃO foi pintada
            try {
                const b = forma.getBBox();
                if (b.width > 8 && b.height > 8) {
                    const num = forma.getAttribute("data-numero");
                    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txt.setAttribute("class", "label-numero");
                    txt.setAttribute("data-numero", num);
                    txt.setAttribute("data-index", index);
                    txt.setAttribute("x", b.x + b.width / 2);
                    txt.setAttribute("y", b.y + b.height / 2 + 5);
                    txt.setAttribute("font-size", b.width > 30 ? "15" : "11");
                    txt.setAttribute("font-weight", "900");
                    txt.setAttribute("fill", "#334155");
                    txt.setAttribute("text-anchor", "middle");
                    txt.setAttribute("pointer-events", "none");
                    txt.textContent = num;

                    // Se já estiver pintado, esconde o número
                    if (coresSalvas[index]) {
                        txt.style.display = "none";
                    }

                    svgPrancheta.appendChild(txt);
                }
            } catch(e) {}
        });

        partesDoDesenho = Array.from(svgPrancheta.querySelectorAll(".parte-pintavel"));
    }
   
    /* ========================================================
       BLOCO 3: PALETA DINÂMICA COM CONTADOR DE PARTES RESTANTES
       ======================================================== */
    function montarPaletaDinamica() {
        if (!barraPaleta) return;
        barraPaleta.innerHTML = "";

        const numerosPresentes = [...new Set(partesDoDesenho.map(p => parseInt(p.getAttribute("data-numero"))))].sort((a,b) => a - b);

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
                corAtivaNumero = num;
                corAtivaHex = defCor.hex;
                document.querySelectorAll(".item-cor").forEach(c => c.classList.remove("ativa"));
                divCor.classList.add("ativa");
                destacarAreasAtivas();
            });

            barraPaleta.appendChild(divCor);
        });

        if (numerosPresentes.length > 0 && !numerosPresentes.includes(corAtivaNumero)) {
            corAtivaNumero = numerosPresentes[0];
            const prim = paletaTematica.find(c => c.num === corAtivaNumero);
            if (prim) corAtivaHex = prim.hex;
        }

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

        if (numParte === corAtivaNumero) {
            const corAnterior = parte.getAttribute("fill");
            parte.setAttribute("fill", corAtivaHex);
            parte.setAttribute("data-pintado", "true");
            parte.classList.remove("parte-pendente-ativa");

            historicoAcoes.push({ elemento: parte, corAntiga: corAnterior, numParte });

            // Remove o número visível daquela região preenchida
            const rotulos = svgPrancheta.querySelectorAll(`.label-numero[data-numero="${numParte}"]`);
            if (rotulos.length > 0) {
                rotulos[0].style.display = "none";
            }

            atualizarProgresso();
        } else {
            // Efeito de dica caso a criança clique com o número incorreto selecionado
            const btnCerto = document.querySelector(`.item-cor[data-numero="${numParte}"]`);
            if (btnCerto) {
                btnCerto.style.transform = "scale(1.3)";
                setTimeout(() => btnCerto.style.transform = "", 250);
            }
        }
    });

    /* ========================================================
       BLOCO 5: PROGRESSO, GRAVAÇÃO COMPLETA E CONCLUSÃO (A4/PNG)
       ======================================================== */
    function atualizarProgresso() {
        const total = partesDoDesenho.length;
        const pintadas = partesDoDesenho.filter(p => p.getAttribute("data-pintado") === "true").length;
        const porcentagem = total > 0 ? Math.round((pintadas / total) * 100) : 0;

        if (barraProgresso) barraProgresso.style.width = `${porcentagem}%`;
        if (textoProgresso) textoProgresso.innerText = `${porcentagem}% Concluído`;

        // Coleta exatamente a cor de cada parte pintada para salvar
        const mapaCores = {};
        partesDoDesenho.forEach((p, idx) => {
            if (p.getAttribute("data-pintado") === "true") {
                mapaCores[idx] = p.getAttribute("fill");
            }
        });

        // Grava no localStorage a porcentagem + as cores exatas de cada parte
        localStorage.setItem(`progresso_${desenhoAtual.id}`, JSON.stringify({
            porcentagem: porcentagem,
            cores: mapaCores
        }));

        montarPaletaDinamica();

        // Se completou 100%, comemora com confetes e abre o modal
        if (porcentagem === 100) {
            if (typeof confetti === "function") {
                confetti({ particleCount: 160, spread: 85, origin: { y: 0.6 } });
            }
            abrirModalConclusao();
        }
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

            const rotulos = svgPrancheta.querySelectorAll(`.label-numero[data-numero="${ultima.numParte}"]`);
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

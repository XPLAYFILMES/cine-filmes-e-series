/* ========================================================
   BLOCO 1: RECONHECIMENTO PRECISO DO DESENHO CLICADO
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idDesenho = params.get("id");

    // 1.1 - Busca primeiro na lista do painel (db_desenhos)
    const desenhosDoPainel = JSON.parse(localStorage.getItem("db_desenhos") || "[]");
    
    // 1.2 - Desenhos padrão de fallback
    const desenhosPadrao = [
        {
            id: "desenho_1",
            titulo: "Estrela Mágica",
            viewBox: "0 0 300 300",
            svg: `
                <polygon class="parte-pintavel" data-numero="1" points="150,25 179,111 269,111 197,165 224,251 150,200 76,251 103,165 31,111 121,111" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-numero="2" cx="70" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-numero="3" cx="230" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        },
        {
            id: "desenho_2",
            titulo: "Foguetão Espacial",
            viewBox: "0 0 300 300",
            svg: `
                <path class="parte-pintavel" data-numero="1" d="M150,30 C180,90 190,180 190,210 L110,210 C110,180 120,90 150,30 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <path class="parte-pintavel" data-numero="2" d="M110,160 L60,210 L110,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <path class="parte-pintavel" data-numero="3" d="M190,160 L240,210 L190,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-numero="4" cx="150" cy="120" r="22" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <polygon class="parte-pintavel" data-numero="5" points="130,215 150,270 170,215" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        },
        {
            id: "desenho_3",
            titulo: "Flor Geométrica",
            viewBox: "0 0 300 300",
            svg: `
                <ellipse class="parte-pintavel" data-numero="1" cx="150" cy="90" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="2" cx="150" cy="210" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="3" cx="90" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-numero="4" cx="210" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-numero="5" cx="150" cy="150" r="32" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        }
    ];

    // Procura o desenho correspondente:
    let desenhoAtual = null;

    if (idDesenho) {
        desenhoAtual = desenhosDoPainel.find(d => String(d.id) === String(idDesenho));
        if (!desenhoAtual) {
            desenhoAtual = desenhosPadrao.find(d => String(d.id) === String(idDesenho));
        }
    }

    // Se ainda não encontrou, pega o mais recente do painel ou o primeiro padrão
    if (!desenhoAtual) {
        desenhoAtual = desenhosDoPainel.length > 0 ? desenhosDoPainel[0] : desenhosPadrao[0];
    }

    localStorage.setItem("ultimo_desenho_aberto", desenhoAtual.id);

    const svgPrancheta = document.getElementById("desenho-svg");
    const camadaCanvas = document.getElementById("camada-pincel");
    const ctxCanvas = camadaCanvas ? camadaCanvas.getContext("2d") : null;
    const barraPaleta = document.getElementById("barra-paleta");
    const barraProgresso = document.getElementById("barra-progresso-ativa");
    const textoProgresso = document.getElementById("texto-progresso-ativo");
    const pranchetaWrapper = document.getElementById("prancheta-wrapper");

    const tabelaCores = [
        { num: 1, hex: "#e74c3c" },
        { num: 2, hex: "#3498db" },
        { num: 3, hex: "#f1c40f" },
        { num: 4, hex: "#2ecc71" },
        { num: 5, hex: "#9b59b6" },
        { num: 6, hex: "#e67e22" },
        { num: 7, hex: "#1abc9c" },
        { num: 8, hex: "#e84393" }
    ];

    let corAtivaNumero = 1;
    let corAtivaHex = "#e74c3c";
    let modoAtual = "balde";
    let nivelZoom = 1;
    let historicoAcoes = [];
    let partesDoDesenho = [];

    /* ========================================================
       BLOCO 2: MONTAGEM DA IMAGEM REAL E REGIÕES NUMERADAS
       ======================================================== */
    function carregarDesenhoNaPrancheta() {
        if (!svgPrancheta) return;
        svgPrancheta.innerHTML = "";

        // CASO A: Imagem vinda do Painel (Upload ou Link URL)
        if (desenhoAtual.imagem) {
            svgPrancheta.setAttribute("viewBox", "0 0 400 400");
            svgPrancheta.innerHTML = `
                <!-- A imagem enviada pelo painel fica de fundo -->
                <image href="${desenhoAtual.imagem}" x="0" y="0" width="400" height="400" preserveAspectRatio="xMidYMid meet" />
                
                <!-- Regiões translúcidas clicáveis para pintar por números -->
                <g id="camada-partes-numeradas">
                    <!-- Quadrante 1 -->
                    <rect class="parte-pintavel" data-numero="1" x="20" y="20" width="170" height="170" rx="14" fill="rgba(255,255,255,0.70)" stroke="#1e293b" stroke-width="2"/>
                    <text class="label-numero" data-numero="1" x="105" y="115" font-size="28" font-weight="900" fill="#0f172a" text-anchor="middle" pointer-events="none">1</text>

                    <!-- Quadrante 2 -->
                    <rect class="parte-pintavel" data-numero="2" x="210" y="20" width="170" height="170" rx="14" fill="rgba(255,255,255,0.70)" stroke="#1e293b" stroke-width="2"/>
                    <text class="label-numero" data-numero="2" x="295" y="115" font-size="28" font-weight="900" fill="#0f172a" text-anchor="middle" pointer-events="none">2</text>

                    <!-- Quadrante 3 -->
                    <rect class="parte-pintavel" data-numero="3" x="20" y="210" width="170" height="170" rx="14" fill="rgba(255,255,255,0.70)" stroke="#1e293b" stroke-width="2"/>
                    <text class="label-numero" data-numero="3" x="105" y="305" font-size="28" font-weight="900" fill="#0f172a" text-anchor="middle" pointer-events="none">3</text>

                    <!-- Quadrante 4 -->
                    <rect class="parte-pintavel" data-numero="4" x="210" y="210" width="170" height="170" rx="14" fill="rgba(255,255,255,0.70)" stroke="#1e293b" stroke-width="2"/>
                    <text class="label-numero" data-numero="4" x="295" y="305" font-size="28" font-weight="900" fill="#0f172a" text-anchor="middle" pointer-events="none">4</text>
                </g>
            `;
        } 
        // CASO B: Código SVG (do painel ou padrão)
        else {
            svgPrancheta.setAttribute("viewBox", desenhoAtual.viewBox || "0 0 300 300");
            svgPrancheta.innerHTML = desenhoAtual.svg;

            const formas = svgPrancheta.querySelectorAll("path, polygon, circle, rect, ellipse");
            formas.forEach((forma, idx) => {
                if (!forma.getAttribute("data-numero")) {
                    forma.setAttribute("data-numero", (idx % 5) + 1);
                }
                forma.classList.add("parte-pintavel");
                if (!forma.getAttribute("fill") || forma.getAttribute("fill") === "none") {
                    forma.setAttribute("fill", "#ffffff");
                }

                try {
                    const b = forma.getBBox();
                    if (b.width > 8 && b.height > 8) {
                        const num = forma.getAttribute("data-numero");
                        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        txt.setAttribute("class", "label-numero");
                        txt.setAttribute("data-numero", num);
                        txt.setAttribute("x", b.x + b.width / 2);
                        txt.setAttribute("y", b.y + b.height / 2 + 5);
                        txt.setAttribute("font-size", "14");
                        txt.setAttribute("font-weight", "900");
                        txt.setAttribute("fill", "#334155");
                        txt.setAttribute("text-anchor", "middle");
                        txt.setAttribute("pointer-events", "none");
                        txt.textContent = num;
                        svgPrancheta.appendChild(txt);
                    }
                } catch(e) {}
            });
        }

        partesDoDesenho = Array.from(svgPrancheta.querySelectorAll(".parte-pintavel"));
    }

    /* ========================================================
       BLOCO 3: GERAÇÃO DA PALETA CONFORME A QUANTIDADE DE PARTES
       ======================================================== */
    function montarPaletaDinamica() {
        if (!barraPaleta) return;
        barraPaleta.innerHTML = "";

        const numerosPresentes = [...new Set(partesDoDesenho.map(p => parseInt(p.getAttribute("data-numero"))))].sort((a,b) => a - b);

        numerosPresentes.forEach((num, index) => {
            const defCor = tabelaCores.find(c => c.num === num) || tabelaCores[index % tabelaCores.length];
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

        // Atualiza a primeira cor como ativa
        if (numerosPresentes.length > 0 && !numerosPresentes.includes(corAtivaNumero)) {
            corAtivaNumero = numerosPresentes[0];
            const prim = tabelaCores.find(c => c.num === corAtivaNumero);
            if (prim) corAtivaHex = prim.hex;
        }

        destacarAreasAtivas();
    }

    /* ========================================================
       BLOCO 4: PINTURA INTERATIVA POR NÚMERO (BALDE)
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

            // Registra no histórico para a ferramenta "Desfazer"
            historicoAcoes.push({ elemento: parte, corAntiga: corAnterior, numParte });

            // Remove o número visível daquela região
            const rotulos = svgPrancheta.querySelectorAll(`.label-numero[data-numero="${numParte}"]`);
            if (rotulos.length > 0) {
                rotulos[0].style.display = "none";
            }

            atualizarProgresso();
        } else {
            // Efeito visual caso o clique seja na cor errada
            const btnCerto = document.querySelector(`.item-cor[data-numero="${numParte}"]`);
            if (btnCerto) {
                btnCerto.style.transform = "scale(1.25)";
                setTimeout(() => btnCerto.style.transform = "", 250);
            }
        }
    });

    /* ========================================================
       BLOCO 5: CÁLCULO DE PROGRESSO E CONCLUSÃO (MODAL A4 / PNG)
       ======================================================== */
    function atualizarProgresso() {
        const total = partesDoDesenho.length;
        const pintadas = partesDoDesenho.filter(p => p.getAttribute("data-pintado") === "true").length;
        const porcentagem = total > 0 ? Math.round((pintadas / total) * 100) : 0;

        if (barraProgresso) barraProgresso.style.width = `${porcentagem}%`;
        if (textoProgresso) textoProgresso.innerText = `${porcentagem}% Concluído`;

        // Salva progresso individual para alimentar a home e o hero
        localStorage.setItem(`progresso_${desenhoAtual.id}`, JSON.stringify({ porcentagem }));

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

        // Gera a imagem final para prévia no modal
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

    // Alternar Balde / Pincel
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

    // Pincel livre sobre o Canvas
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

    // Ferramenta Desfazer
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

    // Ferramenta Dica Mágica
    if (btnDica) {
        btnDica.addEventListener("click", () => {
            const pendente = partesDoDesenho.find(p => parseInt(p.getAttribute("data-numero")) === corAtivaNumero && p.getAttribute("data-pintado") !== "true");
            if (pendente) {
                pendente.classList.add("destaque-dica");
                setTimeout(() => pendente.classList.remove("destaque-dica"), 2200);
            }
        });
    }

    // Ferramentas de Zoom
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

    // Tela Cheia
    if (btnTelaCheia) {
        btnTelaCheia.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    // Limpar
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

    // Salvar Rascunho
    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            alert("Progresso salvo com sucesso!");
        });
    }

    // Alternador de Modo Escuro
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

    // Baixar Imagem PNG em HD
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

    // Imprimir com Cabeçalho em Folha A4
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

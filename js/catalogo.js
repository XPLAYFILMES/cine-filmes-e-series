document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE DESENHOS COM SVG ORIGINAL PARA MINIATURA
    // ========================================================
    const catalogoSVG = {
        desenho_1: {
            titulo: "Estrela Mágica",
            categoria: "animais",
            complexidade: "Fácil",
            viewBox: "0 0 300 300",
            svg: `
                <polygon class="parte-pintavel" data-index="0" points="150,25 179,111 269,111 197,165 224,251 150,200 76,251 103,165 31,111 121,111" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-index="1" cx="70" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-index="2" cx="230" cy="70" r="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        },
        desenho_2: {
            titulo: "Foguetão Espacial",
            categoria: "infantil",
            complexidade: "Médio",
            viewBox: "0 0 300 300",
            svg: `
                <path class="parte-pintavel" data-index="0" d="M150,30 C180,90 190,180 190,210 L110,210 C110,180 120,90 150,30 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <path class="parte-pintavel" data-index="1" d="M110,160 L60,210 L110,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <path class="parte-pintavel" data-index="2" d="M190,160 L240,210 L190,210 Z" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-index="3" cx="150" cy="120" r="22" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <polygon class="parte-pintavel" data-index="4" points="130,215 150,270 170,215" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        },
        desenho_3: {
            titulo: "Flor Geométrica",
            categoria: "mandalas",
            complexidade: "Fácil",
            viewBox: "0 0 300 300",
            svg: `
                <ellipse class="parte-pintavel" data-index="0" cx="150" cy="90" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-index="1" cx="150" cy="210" rx="30" ry="45" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-index="2" cx="90" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <ellipse class="parte-pintavel" data-index="3" cx="210" cy="150" rx="45" ry="30" fill="#ffffff" stroke="#333333" stroke-width="4"/>
                <circle class="parte-pintavel" data-index="4" cx="150" cy="150" r="32" fill="#ffffff" stroke="#333333" stroke-width="4"/>
            `
        }
    };

    const listaDesenhos = [
        { id: "desenho_1", titulo: catalogoSVG.desenho_1.titulo, categoria: catalogoSVG.desenho_1.categoria, complexidade: catalogoSVG.desenho_1.complexidade },
        { id: "desenho_2", titulo: catalogoSVG.desenho_2.titulo, categoria: catalogoSVG.desenho_2.categoria, complexidade: catalogoSVG.desenho_2.complexidade },
        { id: "desenho_3", titulo: catalogoSVG.desenho_3.titulo, categoria: catalogoSVG.desenho_3.categoria, complexidade: catalogoSVG.desenho_3.complexidade }
    ];

    // Gerando mais desenhos de demonstração para testar as 5 colunas e 30 itens por página
    const categoriasMock = ["animais", "infantil", "mandalas"];
    for (let i = 4; i <= 65; i++) {
        listaDesenhos.push({
            id: `desenho_${i}`,
            titulo: `Desenho ${i}`,
            categoria: categoriasMock[i % 3],
            complexidade: i % 2 === 0 ? "Fácil" : "Médio"
        });
    }

    // ========================================================
    // 2. CONTROLES E ESTADOS DA PÁGINA
    // ========================================================
    const ITENS_POR_PAGINA = 30;
    let paginaAtual = 1;
    let statusAtual = "todos";
    let categoriaAtual = "todos";
    let termoBusca = "";
    let desenhosFiltrados = [];

    const gradeCatalogo = document.getElementById("catalogo");
    const containerPaginacao = document.getElementById("container-paginacao");
    const numerosPaginacao = document.getElementById("numeros-paginacao");
    const btnAnterior = document.getElementById("btn-pag-anterior");
    const btnProximo = document.getElementById("btn-pag-proximo");
    const botoesAba = document.querySelectorAll(".btn-aba");
    const botoesCat = document.querySelectorAll(".btn-categoria");
    const campoBusca = document.getElementById("campo-busca");
    const qtdProgresso = document.getElementById("qtd-progresso");
    const qtdFinalizados = document.getElementById("qtd-finalizados");
    const containerContinuar = document.getElementById("container-continuar");
    const btnTemaGlobal = document.getElementById("btn-tema-global");

    // ========================================================
    // 3. TEMA NOTURNO GLOBAL
    // ========================================================
    if (btnTemaGlobal) {
        btnTemaGlobal.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            btnTemaGlobal.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    // ========================================================
    // 4. ATALHO HERO: CONTINUAR PINTANDO O ÚLTIMO DESENHO
    // ========================================================
    function renderizarHeroContinuar() {
        if (!containerContinuar) return;
        const ultimoId = localStorage.getItem("ultimo_desenho_aberto");
        if (!ultimoId) return;

        const salvo = localStorage.getItem(`progresso_${ultimoId}`);
        if (!salvo) return;

        try {
            const dados = JSON.parse(salvo);
            if (dados.porcentagem > 0 && dados.porcentagem < 100) {
                const item = listaDesenhos.find(d => d.id === ultimoId) || { titulo: "Último Desenho" };
                containerContinuar.innerHTML = `
                    <div class="card-continuar">
                        <div>
                            <strong>🎨 Continuar onde parou:</strong>
                            <span>${item.titulo} (${dados.porcentagem}% concluído)</span>
                        </div>
                        <a href="pintar.html?id=${ultimoId}" class="btn-continuar-link">Retomar Pintura ➡</a>
                    </div>
                `;
            }
        } catch (e) {}
    }

    // ========================================================
    // 5. ATUALIZAR CONTADORES GLOBAIS
    // ========================================================
    function atualizarContadoresGlobais() {
        let progressoCount = 0;
        let finalizadosCount = 0;

        listaDesenhos.forEach(item => {
            const salvo = localStorage.getItem(`progresso_${item.id}`);
            if (salvo) {
                try {
                    const dados = JSON.parse(salvo);
                    if (dados.porcentagem === 100) finalizadosCount++;
                    else if (dados.porcentagem > 0) progressoCount++;
                } catch (e) {}
            }
        });

        if (qtdProgresso) qtdProgresso.innerText = progressoCount;
        if (qtdFinalizados) qtdFinalizados.innerText = finalizadosCount;
    }

    // ========================================================
    // 6. FILTRO DE DADOS
    // ========================================================
    function filtrarDesenhos() {
        desenhosFiltrados = listaDesenhos.filter(item => {
            const salvo = localStorage.getItem(`progresso_${item.id}`);
            let porcentagem = 0;
            if (salvo) {
                try { porcentagem = JSON.parse(salvo).porcentagem || 0; } catch (e) {}
            }

            const statusItem = porcentagem === 100 ? "finalizados" : (porcentagem > 0 ? "progresso" : "novo");
            const bateuStatus = (statusAtual === "todos") || (statusAtual === statusItem);
            const bateuCat = (categoriaAtual === "todos") || (item.categoria === categoriaAtual);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca);

            return bateuStatus && bateuCat && bateuBusca;
        });

        paginaAtual = 1;
        renderizarGrade();
        renderizarControlesPaginacao();
    }

    // ========================================================
    // 7. RENDERIZAR CARTÕES COM MINIATURAS SVG VIVAS
    // ========================================================
    function renderizarGrade() {
        if (!gradeCatalogo) return;
        gradeCatalogo.innerHTML = "";

        if (desenhosFiltrados.length === 0) {
            gradeCatalogo.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; font-weight: bold; padding: 40px;">Nenhum desenho encontrado.</p>`;
            return;
        }

        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const itensPagina = desenhosFiltrados.slice(inicio, fim);

        itensPagina.forEach(item => {
            const salvo = localStorage.getItem(`progresso_${item.id}`);
            let porcentagem = 0;
            let coresSalvas = {};

            if (salvo) {
                try {
                    const dados = JSON.parse(salvo);
                    porcentagem = dados.porcentagem || 0;
                    coresSalvas = dados.cores || {};
                } catch (e) {}
            }

            const card = document.createElement("div");
            card.className = "card-desenho";

            // Se for um dos 3 modelos principais, injeta o SVG real pré-colorido na miniatura
            let conteudoMiniatura = "";
            if (catalogoSVG[item.id]) {
                const dadosSvg = catalogoSVG[item.id];
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = dadosSvg.svg;

                // Aplica as cores que o jogador já pintou na miniatura do card
                Object.keys(coresSalvas).forEach(idx => {
                    const el = tempDiv.querySelectorAll(".parte-pintavel")[parseInt(idx, 10)];
                    if (el) el.setAttribute("fill", coresSalvas[idx]);
                });

                conteudoMiniatura = `
                    <svg viewBox="${dadosSvg.viewBox}">
                        ${tempDiv.innerHTML}
                    </svg>
                `;
            } else {
                conteudoMiniatura = `<span style="font-size: 2.2rem;">🎨</span>`;
            }

            card.innerHTML = `
                <div class="cabecalho-card">
                    <span class="tag-categoria">${item.categoria}</span>
                    <span class="badge-complexidade">${item.complexidade}</span>
                </div>
                <div class="preview-svg-container">
                    ${conteudoMiniatura}
                </div>
                <h3 class="titulo-card">${item.titulo}</h3>
                <div class="container-progresso">
                    <div class="barra-progresso" style="width: ${porcentagem}%;"></div>
                </div>
                <span class="texto-progresso">${porcentagem}% Concluído</span>
                <a href="pintar.html?id=${item.id}" class="btn-jogar">Colorir Agora</a>
            `;

            gradeCatalogo.appendChild(card);
        });
    }

    // ========================================================
    // 8. RENDERIZAR PAGINAÇÃO (30 ITENS POR PÁGINA)
    // ========================================================
    function renderizarControlesPaginacao() {
        if (!containerPaginacao || !numerosPaginacao) return;

        const totalPaginas = Math.ceil(desenhosFiltrados.length / ITENS_POR_PAGINA);
        if (totalPaginas <= 1) {
            containerPaginacao.style.display = "none";
            return;
        }

        containerPaginacao.style.display = "flex";
        numerosPaginacao.innerHTML = "";

        if (btnAnterior) btnAnterior.disabled = (paginaAtual === 1);
        if (btnProximo) btnProximo.disabled = (paginaAtual === totalPaginas);

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.className = `btn-num-pag ${i === paginaAtual ? "ativo" : ""}`;
            btn.innerText = i;
            btn.addEventListener("click", () => {
                paginaAtual = i;
                renderizarGrade();
                renderizarControlesPaginacao();
                window.scrollTo({ top: 350, behavior: "smooth" });
            });
            numerosPaginacao.appendChild(btn);
        }
    }

    if (btnAnterior) {
        btnAnterior.addEventListener("click", () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                renderizarGrade();
                renderizarControlesPaginacao();
                window.scrollTo({ top: 350, behavior: "smooth" });
            }
        });
    }

    if (btnProximo) {
        btnProximo.addEventListener("click", () => {
            const totalPaginas = Math.ceil(desenhosFiltrados.length / ITENS_POR_PAGINA);
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                renderizarGrade();
                renderizarControlesPaginacao();
                window.scrollTo({ top: 350, behavior: "smooth" });
            }
        });
    }

    // ========================================================
    // 9. EVENTOS DE FILTROS E BUSCA
    // ========================================================
    botoesAba.forEach(aba => {
        aba.addEventListener("click", () => {
            botoesAba.forEach(a => a.classList.remove("ativa"));
            aba.classList.add("ativa");
            statusAtual = aba.getAttribute("data-filtro");
            filtrarDesenhos();
        });
    });

    botoesCat.forEach(cat => {
        cat.addEventListener("click", () => {
            botoesCat.forEach(c => c.classList.remove("ativo"));
            cat.classList.add("ativo");
            categoriaAtual = cat.getAttribute("data-cat");
            filtrarDesenhos();
        });
    });

    if (campoBusca) {
        campoBusca.addEventListener("input", (e) => {
            termoBusca = e.target.value.toLowerCase().trim();
            filtrarDesenhos();
        });
    }

    // Inicialização
    atualizarContadoresGlobais();
    renderizarHeroContinuar();
    filtrarDesenhos();
});

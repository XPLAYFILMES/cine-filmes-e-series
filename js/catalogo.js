document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BASE DE DADOS DE DESENHOS (DEMO COM VÁRIOS ITENS)
    // ========================================================
    // Os 3 originais:
    const listaDesenhos = [
        { id: "desenho_1", titulo: "Estrela Mágica", icone: "⭐", categoria: "animais" },
        { id: "desenho_2", titulo: "Foguetão Espacial", icone: "🚀", categoria: "infantil" },
        { id: "desenho_3", titulo: "Flor Geométrica", icone: "🌸", categoria: "mandalas" }
    ];

    // Gerando ilustrações adicionais de exemplo para testar a paginação de 30 itens
    const categoriasExemplo = ["animais", "infantil", "mandalas"];
    const iconesExemplo = ["🐱", "🐶", "🦁", "🚗", "⛵", "🏰", "🌺", "🌻", "🎨"];

    for (let i = 4; i <= 65; i++) {
        const cat = categoriasExemplo[i % 3];
        const ico = iconesExemplo[i % iconesExemplo.length];
        listaDesenhos.push({
            id: `desenho_${i}`,
            titulo: `Desenho ${i} (${cat})`,
            icone: ico,
            categoria: cat
        });
    }

    // ========================================================
    // 2. CONFIGURAÇÃO DE ESTADO E PAGINAÇÃO
    // ========================================================
    const ITENS_POR_PAGINA = 30; // Limite de 30 por página (6 linhas de 5)
    let paginaAtual = 1;
    let statusAtual = "todos";
    let categoriaAtual = "todos";
    let termoBusca = "";
    let desenhosFiltrados = [];

    // Elementos DOM
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

    // ========================================================
    // 3. CALCULAR TOTAIS DE PROGRESSO
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
                } catch (e) {
                    console.error(e);
                }
            }
        });

        if (qtdProgresso) qtdProgresso.innerText = progressoCount;
        if (qtdFinalizados) qtdFinalizados.innerText = finalizadosCount;
    }

    // ========================================================
    // 4. FILTRAR DADOS (STATUS, CATEGORIA E BUSCA)
    // ========================================================
    function filtrarDesenhos() {
        desenhosFiltrados = listaDesenhos.filter(item => {
            const salvo = localStorage.getItem(`progresso_${item.id}`);
            let porcentagem = 0;
            if (salvo) {
                try {
                    porcentagem = JSON.parse(salvo).porcentagem || 0;
                } catch (e) {}
            }

            const statusItem = porcentagem === 100 ? "finalizados" : (porcentagem > 0 ? "progresso" : "novo");

            const bateuStatus = (statusAtual === "todos") || (statusAtual === statusItem);
            const bateuCat = (categoriaAtual === "todos") || (item.categoria === categoriaAtual);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca);

            return bateuStatus && bateuCat && bateuBusca;
        });

        paginaAtual = 1; // Reseta para a primeira página ao filtrar
        renderizarGrade();
        renderizarControlesPaginacao();
    }

    // ========================================================
    // 5. RENDERIZAR OS CARTÕES DA PÁGINA ATUAL
    // ========================================================
    function renderizarGrade() {
        if (!gradeCatalogo) return;
        gradeCatalogo.innerHTML = "";

        if (desenhosFiltrados.length === 0) {
            gradeCatalogo.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #475569; font-weight: bold; padding: 40px;">Nenhum desenho encontrado com esses critérios.</p>`;
            return;
        }

        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const itensPagina = desenhosFiltrados.slice(inicio, fim);

        itensPagina.forEach(item => {
            const salvo = localStorage.getItem(`progresso_${item.id}`);
            let porcentagem = 0;
            if (salvo) {
                try {
                    porcentagem = JSON.parse(salvo).porcentagem || 0;
                } catch (e) {}
            }

            const card = document.createElement("div");
            card.className = "card-desenho";
            card.setAttribute("data-id", item.id);
            card.setAttribute("data-categoria", item.categoria);

            card.innerHTML = `
                <div class="tag-categoria">${item.categoria}</div>
                <div class="preview-imagem">${item.icone} ${item.titulo}</div>
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
    // 6. RENDERIZAR BOTÕES DE PAGINAÇÃO
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

        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual === totalPaginas;

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

    // Eventos dos botões Anterior e Próximo
    if (btnAnterior && btnProximo) {
        btnAnterior.addEventListener("click", () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                renderizarGrade();
                renderizarControlesPaginacao();
                window.scrollTo({ top: 350, behavior: "smooth" });
            }
        });

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
    // 7. EVENTOS DE FILTROS E BUSCA
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
    filtrarDesenhos();
});

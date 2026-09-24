document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. SELEÇÃO DE ELEMENTOS DO DOM E ESTADO DO CATÁLOGO
    // ========================================================
    const botoesAba = document.querySelectorAll(".btn-aba");
    const botoesCat = document.querySelectorAll(".btn-categoria");
    const cards = document.querySelectorAll(".card-desenho");
    const campoBusca = document.getElementById("campo-busca");
    const qtdProgresso = document.getElementById("qtd-progresso");
    const qtdFinalizados = document.getElementById("qtd-finalizados");

    let totalProgresso = 0;
    let totalFinalizados = 0;
    let statusAtual = "todos";
    let categoriaAtual = "todos";
    let termoBusca = "";

    // ========================================================
    // 2. LEITURA E SINCRONIZAÇÃO DO PROGRESSO SALVO
    // ========================================================
    cards.forEach(card => {
        const idDesenho = card.getAttribute("data-id");
        const dadosSalvos = localStorage.getItem(`progresso_${idDesenho}`);
        
        let porcentagem = 0;

        if (dadosSalvos) {
            try {
                const progresso = JSON.parse(dadosSalvos);
                porcentagem = progresso.porcentagem || 0;
            } catch (e) {
                console.error("Erro ao carregar dados do catálogo:", e);
            }
        }

        const barra = card.querySelector(".barra-progresso");
        const texto = card.querySelector(".texto-progresso");

        if (barra) barra.style.width = `${porcentagem}%`;
        if (texto) texto.innerText = `${porcentagem}% Concluído`;

        if (porcentagem === 100) {
            card.setAttribute("data-status", "finalizados");
            totalFinalizados++;
        } else if (porcentagem > 0) {
            card.setAttribute("data-status", "progresso");
            totalProgresso++;
        } else {
            card.setAttribute("data-status", "novo");
        }
    });

    if (qtdProgresso) qtdProgresso.innerText = totalProgresso;
    if (qtdFinalizados) qtdFinalizados.innerText = totalFinalizados;

    // ========================================================
    // 3. MOTOR DE FILTRAGEM COMBINADA (STATUS + CATEGORIA + BUSCA)
    // ========================================================
    function aplicarFiltros() {
        cards.forEach(card => {
            const statusCard = card.getAttribute("data-status");
            const catCard = card.getAttribute("data-categoria");
            const tituloCard = card.querySelector(".preview-imagem").innerText.toLowerCase();

            const bateuStatus = (statusAtual === "todos") || 
                                (statusAtual === "progresso" && statusCard === "progresso") || 
                                (statusAtual === "finalizados" && statusCard === "finalizados");

            const bateuCategoria = (categoriaAtual === "todos") || (catCard === categoriaAtual);
            const bateuBusca = tituloCard.includes(termoBusca);

            if (bateuStatus && bateuCategoria && bateuBusca) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    // ========================================================
    // 4. EVENTOS DE CLIQUE NAS ABAS DE ESTADO
    // ========================================================
    botoesAba.forEach(aba => {
        aba.addEventListener("click", () => {
            botoesAba.forEach(a => a.classList.remove("ativa"));
            aba.classList.add("ativa");
            statusAtual = aba.getAttribute("data-filtro");
            aplicarFiltros();
        });
    });

    // ========================================================
    // 5. EVENTOS DE CLIQUE NOS FILTROS DE CATEGORIA
    // ========================================================
    botoesCat.forEach(cat => {
        cat.addEventListener("click", () => {
            botoesCat.forEach(c => c.classList.remove("ativo"));
            cat.classList.add("ativo");
            categoriaAtual = cat.getAttribute("data-cat");
            aplicarFiltros();
        });
    });

    // ========================================================
    // 6. EVENTO DE DIGITAÇÃO NO CAMPO DE PESQUISA
    // ========================================================
    if (campoBusca) {
        campoBusca.addEventListener("input", (e) => {
            termoBusca = e.target.value.toLowerCase().trim();
            aplicarFiltros();
        });
    }
});

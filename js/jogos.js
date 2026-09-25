document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE DADOS DE JOGOS (TODAS AS IDADES)
    // ========================================================
    const bancoJogos = [
        {
            id: "jogo_1",
            titulo: "Caça-Palavras: Animais da Floresta",
            tipo: "caca-palavras",
            tipoNome: "Caça-Palavras",
            publico: "infantil",
            publicoNome: "Infantil (Fácil)",
            icone: "🦊",
            descricao: "Grade menor com letras grandes, ideal para iniciantes e crianças."
        },
        {
            id: "jogo_2",
            titulo: "Caça-Palavras Clássico: Cidades do Mundo",
            tipo: "caca-palavras",
            tipoNome: "Caça-Palavras",
            publico: "adultos",
            publicoNome: "Adultos & Idosos",
            icone: "🗺️",
            descricao: "Grade ampla com palavras na diagonal e invertidas para estimular a visão e foco."
        },
        {
            id: "jogo_3",
            titulo: "Jogo da Memória: Cores & Frutas",
            tipo: "memoria",
            tipoNome: "Memória",
            publico: "infantil",
            publicoNome: "Infantil (Fácil)",
            icone: "🍓",
            descricao: "Pares de frutas coloridas para treinar a atenção dos pequeninos."
        },
        {
            id: "jogo_4",
            titulo: "Jogo da Memória: Obras de Arte Clássicas",
            tipo: "memoria",
            tipoNome: "Memória",
            publico: "adultos",
            publicoNome: "Adultos & Idosos",
            icone: "🎨",
            descricao: "Pares com pinturas famosas mundiais, excelente para exercício neurológico diário."
        },
        {
            id: "jogo_5",
            titulo: "Quebra-Cabeça: Paisagem Zen",
            tipo: "quebra-cabeca",
            tipoNome: "Quebra-Cabeça",
            publico: "geral",
            publicoNome: "Todas as Idades",
            icone: "🌄",
            descricao: "Encaixe as peças para montar um pôr do sol relaxante."
        },
        {
            id: "jogo_6",
            titulo: "Desafio Sudoku Suave",
            tipo: "raciocinio",
            tipoNome: "Raciocínio",
            publico: "adultos",
            publicoNome: "Adultos & Idosos",
            icone: "🔢",
            descricao: "Números sem repetição para exercitar a lógica e o pensamento estruturado."
        }
    ];

    // ========================================================
    // 2. CONTROLES E ESTADOS DA PÁGINA
    // ========================================================
    let tipoAtivo = "todos";
    let publicoAtivo = "todos";
    let termoBusca = "";

    const gradeJogos = document.getElementById("catalogo-jogos");
    const botoesTipo = document.querySelectorAll("#filtros-tipo-jogo .btn-categoria");
    const botoesPublico = document.querySelectorAll("#filtros-idade-jogo .btn-aba");
    const campoBusca = document.getElementById("campo-busca-jogos");
    const btnTema = document.getElementById("btn-tema-jogos");

    // ========================================================
    // 3. TEMA NOTURNO
    // ========================================================
    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            btnTema.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    // ========================================================
    // 4. RENDERIZAR CARTÕES DE JOGOS
    // ========================================================
    function renderizarJogos() {
        if (!gradeJogos) return;
        gradeJogos.innerHTML = "";

        const filtrados = bancoJogos.filter(item => {
            const bateuTipo = (tipoAtivo === "todos") || (item.tipo === tipoAtivo);
            const bateuPublico = (publicoAtivo === "todos") || (item.publico === publicoAtivo);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca) || item.descricao.toLowerCase().includes(termoBusca);
            return bateuTipo && bateuPublico && bateuBusca;
        });

        if (filtrados.length === 0) {
            gradeJogos.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; font-weight: bold; padding: 40px;">Nenhum jogo encontrado com esses filtros.</p>`;
            return;
        }

        filtrados.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-desenho";

            card.innerHTML = `
                <div class="cabecalho-card">
                    <span class="tag-categoria" style="background-color: #f3e8ff; color: #7e22ce;">${item.tipoNome}</span>
                    <span class="badge-complexidade">${item.publicoNome}</span>
                </div>
                <div class="preview-svg-container" style="background-color: #faf5ff;">
                    <span style="font-size: 3rem;">${item.icone}</span>
                </div>
                <h3 class="titulo-card">${item.titulo}</h3>
                <p style="font-size: 0.75rem; color: #64748b; text-align: center; margin-bottom: 12px; flex: 1;">${item.descricao}</p>
                <button class="btn-jogar" style="background-color: #7c3aed; cursor: pointer; border: none;" onclick="alert('Iniciando: ${item.titulo}!')">
                    🎮 Jogar Agora
                </button>
            `;

            gradeJogos.appendChild(card);
        });
    }

    // ========================================================
    // 5. EVENTOS DE FILTROS E BUSCA
    // ========================================================
    botoesTipo.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesTipo.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            tipoAtivo = btn.getAttribute("data-tipo");
            renderizarJogos();
        });
    });

    botoesPublico.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesPublico.forEach(b => b.classList.remove("ativa"));
            btn.classList.add("ativa");
            publicoAtivo = btn.getAttribute("data-publico");
            renderizarJogos();
        });
    });

    if (campoBusca) {
        campoBusca.addEventListener("input", (e) => {
            termoBusca = e.target.value.toLowerCase().trim();
            renderizarJogos();
        });
    }

    renderizarJogos();
});

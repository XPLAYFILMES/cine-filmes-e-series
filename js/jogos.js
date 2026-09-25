document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE JOGOS (PADRÃO + CADASTRADOS NO ADMIN)
    // ========================================================
    const jogosPadrao = [
        {
            id: "jogo_1",
            titulo: "Caça-Palavras: Animais",
            tipo: "caca-palavras",
            tipoNome: "Caça-Palavras",
            publico: "infantil",
            publicoNome: "Infantil",
            icone: "🦁",
            palavras: ["GATO", "PATO", "LEAO", "URSO"],
            grade: [
                ["G","A","T","O","X"],
                ["P","A","T","O","Y"],
                ["L","E","A","O","Z"],
                ["U","R","S","O","W"],
                ["K","B","C","D","F"]
            ]
        },
        {
            id: "jogo_2",
            titulo: "Jogo da Memória: Cores & Frutas",
            tipo: "memoria",
            tipoNome: "Memória",
            publico: "infantil",
            publicoNome: "Infantil",
            icone: "🍓",
            cartas: ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓"]
        }
    ];

    const jogosAdmin = JSON.parse(localStorage.getItem("admin_jogos") || "[]");
    const bancoJogos = [...jogosAdmin, ...jogosPadrao];

    // ========================================================
    // 2. ESTADOS E SELETORES
    // ========================================================
    let tipoAtivo = "todos";
    let publicoAtivo = "todos";
    let termoBusca = "";

    const gradeJogos = document.getElementById("catalogo-jogos");
    const botoesTipo = document.querySelectorAll("#filtros-tipo-jogo .btn-categoria");
    const botoesPublico = document.querySelectorAll("#filtros-idade-jogo .btn-aba");
    const campoBusca = document.getElementById("campo-busca");
    const btnTema = document.getElementById("btn-tema-jogos");

    const modalArena = document.getElementById("modal-jogo-arena");
    const tituloArena = document.getElementById("titulo-jogo-arena");
    const descArena = document.getElementById("desc-jogo-arena");
    const tabuleiro = document.getElementById("tabuleiro-jogo-container");
    const btnFecharArena = document.getElementById("btn-fechar-arena");

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
    function renderizar() {
        if (!gradeJogos) return;
        gradeJogos.innerHTML = "";

        const filtrados = bancoJogos.filter(item => {
            const bateuTipo = (tipoAtivo === "todos") || (item.tipo === tipoAtivo);
            const bateuPublico = (publicoAtivo === "todos") || (item.publico === publicoAtivo);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca);
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
                    <span class="tag-categoria" style="background-color: #f3e8ff; color: #7e22ce;">${item.tipoNome || item.tipo}</span>
                    <span class="badge-complexidade">${item.publicoNome || item.publico}</span>
                </div>
                <div class="preview-svg-container" style="background-color: #faf5ff;">
                    <span style="font-size: 3rem;">${item.icone || "🧩"}</span>
                </div>
                <h3 class="titulo-card">${item.titulo}</h3>
                <p style="font-size: 0.78rem; color: #64748b; text-align: center; margin-bottom: 12px; flex: 1;">Clique abaixo para jogar agora na tela!</p>
                <button class="btn-jogar" style="background-color: #7c3aed; border: none; cursor: pointer;" onclick="iniciarJogo('${item.id}')">
                    🎮 Jogar Online
                </button>
            `;

            gradeJogos.appendChild(card);
        });
    }

    // ========================================================
    // 5. MOTOR REAL DE EXECUÇÃO DOS JOGOS
    // ========================================================
    window.iniciarJogo = function(id) {
        const jogo = bancoJogos.find(j => j.id === id);
        if (!jogo) return;

        tituloArena.innerText = jogo.titulo;
        modalArena.style.display = "flex";
        tabuleiro.innerHTML = "";

        if (jogo.tipo === "caca-palavras") {
            descArena.innerText = `Encontre as palavras: ${(jogo.palavras || []).join(", ")}`;
            const containerGrid = document.createElement("div");
            containerGrid.style.display = "grid";
            containerGrid.style.gridTemplateColumns = `repeat(${jogo.grade[0].length}, 42px)`;
            containerGrid.style.gap = "6px";
            containerGrid.style.margin = "10px auto";

            jogo.grade.forEach((linha) => {
                linha.forEach(letra => {
                    const cell = document.createElement("div");
                    cell.innerText = letra;
                    cell.style.width = "42px";
                    cell.style.height = "42px";
                    cell.style.display = "flex";
                    cell.style.alignItems = "center";
                    cell.style.justifyContent = "center";
                    cell.style.backgroundColor = "#e2e8f0";
                    cell.style.borderRadius = "8px";
                    cell.style.fontWeight = "bold";
                    cell.style.cursor = "pointer";
                    cell.style.userSelect = "none";
                    cell.onclick = () => {
                        cell.style.backgroundColor = cell.style.backgroundColor === "rgb(168, 85, 247)" ? "#e2e8f0" : "#a855f7";
                        cell.style.color = cell.style.backgroundColor === "rgb(168, 85, 247)" ? "#ffffff" : "#000000";
                    };
                    containerGrid.appendChild(cell);
                });
            });
            tabuleiro.appendChild(containerGrid);
        } else if (jogo.tipo === "memoria") {
            descArena.innerText = "Encontre todos os pares correspondentes!";
            const cartasEmbaralhadas = [...jogo.cartas].sort(() => 0.5 - Math.random());
            const containerGrid = document.createElement("div");
            containerGrid.style.display = "grid";
            containerGrid.style.gridTemplateColumns = "repeat(4, 60px)";
            containerGrid.style.gap = "8px";
            containerGrid.style.margin = "10px auto";

            let cartaVirada1 = null;
            let paresEncontrados = 0;

            cartasEmbaralhadas.forEach(simbolo => {
                const card = document.createElement("div");
                card.style.width = "60px";
                card.style.height = "60px";
                card.style.backgroundColor = "#0f172a";
                card.style.borderRadius = "10px";
                card.style.display = "flex";
                card.style.alignItems = "center";
                card.style.justifyContent = "center";
                card.style.fontSize = "1.8rem";
                card.style.cursor = "pointer";
                card.style.color = "transparent";
                card.innerText = simbolo;

                card.onclick = () => {
                    if (card.style.color !== "transparent" || cartaVirada1 === card) return;
                    card.style.backgroundColor = "#ffffff";
                    card.style.color = "#000000";

                    if (!cartaVirada1) {
                        cartaVirada1 = card;
                    } else {
                        if (cartaVirada1.innerText === card.innerText) {
                            paresEncontrados++;
                            cartaVirada1 = null;
                            if (paresEncontrados === jogo.cartas.length / 2) {
                                if (typeof confetti === "function") confetti({ particleCount: 120 });
                                setTimeout(() => alert("Parabéns! Você encontrou todos os pares!"), 300);
                            }
                        } else {
                            setTimeout(() => {
                                card.style.backgroundColor = "#0f172a";
                                card.style.color = "transparent";
                                cartaVirada1.style.backgroundColor = "#0f172a";
                                cartaVirada1.style.color = "transparent";
                                cartaVirada1 = null;
                            }, 600);
                        }
                    }
                };
                containerGrid.appendChild(card);
            });
            tabuleiro.appendChild(containerGrid);
        }
    };

    if (btnFecharArena) {
        btnFecharArena.addEventListener("click", () => {
            modalArena.style.display = "none";
        });
    }

    // ========================================================
    // 6. FILTROS E BUSCA
    // ========================================================
    botoesTipo.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesTipo.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            tipoAtivo = btn.getAttribute("data-tipo");
            renderizar();
        });
    });

    botoesPublico.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesPublico.forEach(b => b.classList.remove("ativa"));
            btn.classList.add("ativa");
            publicoAtivo = btn.getAttribute("data-publico");
            renderizar();
        });
    });

    if (campoBusca) {
        campoBusca.addEventListener("input", (e) => {
            termoBusca = e.target.value.toLowerCase().trim();
            renderizar();
        });
    }

    renderizar();
});

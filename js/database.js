/* ========================================================
   BLOCO 1: RECEPTOR UNIVERSAL DO MODO MANUTENÇÃO E AVISOS
   (LEITURA DIRETA DAS CONFIGURAÇÕES DO PAINEL)
   ======================================================== */
(function executarControleAcesso() {
    function checarStatus() {
        const urlCompleta = window.location.pathname.toLowerCase();
        const manutencao = JSON.parse(localStorage.getItem("sistema_manutencao") || "{}");

        // Nunca bloqueia a tela de administração
        if (urlCompleta.includes("admin.html") || urlCompleta.endsWith("/admin")) {
            return;
        }

        let paginaBloqueada = false;

        // 1.1 - Manutenção Geral (Trava todo o site público)
        if (manutencao.geral === true) {
            paginaBloqueada = true;
        } 
        // 1.2 - Manutenção da Página de Colorir
        else if (manutencao.colorir === true && (urlCompleta.endsWith("/") || urlCompleta.includes("index.html") || urlCompleta.includes("pintar.html") || !urlCompleta.includes(".html"))) {
            paginaBloqueada = true;
        } 
        // 1.3 - Manutenção de Jogos
        else if (manutencao.jogos === true && urlCompleta.includes("jogos.html")) {
            paginaBloqueada = true;
        } 
        // 1.4 - Manutenção de Atividades Escolares
        else if (manutencao.atividades === true && urlCompleta.includes("atividades.html")) {
            paginaBloqueada = true;
        } 
        // 1.5 - Manutenção de Conquistas
        else if (manutencao.conquistas === true && urlCompleta.includes("conquistas.html")) {
            paginaBloqueada = true;
        } 
        // 1.6 - Manutenção da Central A4 (Imprimir)
        else if (manutencao.imprimir === true && urlCompleta.includes("imprimir.html")) {
            paginaBloqueada = true;
        }

        // Renderiza o ecrã amigável de manutenção se a página estiver bloqueada
        if (paginaBloqueada) {
            const textoMsg = manutencao.textoAviso || "Estamos preparando novidades incríveis! Esta seção volta em instantes.";
            document.body.innerHTML = `
                <div style="min-height: 100vh; background-color: #070d1e; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 25px; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="font-size: 5.5rem; margin-bottom: 20px;">🛠️</div>
                    <h1 style="font-size: 2.2rem; margin-bottom: 12px; color: #38bdf8;">Área em Manutenção Programada</h1>
                    <p style="font-size: 1.1rem; max-width: 580px; color: #cbd5e1; line-height: 1.6; margin-bottom: 25px;">${textoMsg}</p>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                        <a href="index.html" style="background-color: #2563eb; color: #fff; text-decoration: none; padding: 10px 22px; border-radius: 20px; font-weight: bold; font-size: 0.95rem;">Ir para a Página Inicial</a>
                        <button onclick="window.location.reload()" style="background-color: #111c38; color: #38bdf8; border: 1px solid #1e293b; padding: 10px 22px; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 0.95rem;">Atualizar Página</button>
                    </div>
                </div>
            `;
            return;
        }

        // 1.7 - Barra de Notificação Global no Topo
        const configAviso = JSON.parse(localStorage.getItem("sistema_aviso_topo") || "{}");
        if (configAviso.ativo && configAviso.texto && configAviso.texto.trim() !== "") {
            if (!document.getElementById("barra-aviso-topo-portal")) {
                let corFundo = "#0284c7";
                if (configAviso.tipo === "alerta") corFundo = "#d97706";
                if (configAviso.tipo === "urgente") corFundo = "#dc2626";

                const barraAviso = document.createElement("div");
                barraAviso.id = "barra-aviso-topo-portal";
                barraAviso.style.cssText = `
                    width: 100%;
                    background-color: ${corFundo};
                    color: #ffffff;
                    font-size: 0.9rem;
                    font-weight: 700;
                    padding: 9px 20px;
                    text-align: center;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    position: relative;
                    z-index: 2000;
                `;
                barraAviso.innerHTML = `
                    <span>📢 ${configAviso.texto}</span>
                    <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: #fff; font-size: 1.15rem; cursor: pointer; line-height: 1; padding: 0 4px; margin-left: 8px;">✕</button>
                `;
                document.body.insertAdjacentElement("afterbegin", barraAviso);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checarStatus);
    } else {
        checarStatus();
    }
})();

/* ========================================================
   BLOCO 2: INICIALIZAÇÃO DO BANCO CENTRALIZADO (LOCALSTORAGE)
   ======================================================== */
const DB = {
    init() {
        if (!localStorage.getItem("db_desenhos")) {
            const desenhosIniciais = [
                { id: "estrela", titulo: "Estrela Mágica", categoria: "animais", complexidade: "Fácil", svg: '<polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#ef4444" stroke="#000" stroke-width="2"/>' },
                { id: "foguete", titulo: "Foguetão Espacial", categoria: "infantil", complexidade: "Médio", svg: '<path d="M50,10 L75,60 L60,60 L60,85 L40,85 L40,60 L25,60 Z" fill="#f97316" stroke="#000" stroke-width="2"/>' },
                { id: "flor", titulo: "Flor Mágica", categoria: "mandalas", complexidade: "Fácil", svg: '<circle cx="50" cy="50" r="22" fill="#ef4444" stroke="#000" stroke-width="2"/>' }
            ];
            for (let i = 4; i <= 35; i++) {
                desenhosIniciais.push({
                    id: `desenho_${i}`,
                    titulo: `Desenho ${i}`,
                    categoria: i % 3 === 0 ? "animais" : (i % 2 === 0 ? "infantil" : "mandalas"),
                    complexidade: i % 2 === 0 ? "Médio" : "Fácil",
                    svg: '<circle cx="50" cy="50" r="28" fill="#eab308" stroke="#000" stroke-width="2"/>'
                });
            }
            localStorage.setItem("db_desenhos", JSON.stringify(desenhosIniciais));
        }

        if (!localStorage.getItem("db_jogos")) {
            const jogosIniciais = [
                {
                    id: "jogo_1",
                    titulo: "Caça-Palavras: Animais",
                    tipo: "caca-palavras",
                    tipoNome: "Caça-Palavras",
                    publico: "infantil",
                    publicoNome: "Infantil",
                    icone: "🦁"
                },
                {
                    id: "jogo_2",
                    titulo: "Jogo da Memória: Cores & Frutas",
                    tipo: "memoria",
                    tipoNome: "Memória",
                    publico: "infantil",
                    publicoNome: "Infantil",
                    icone: "🍓"
                }
            ];
            localStorage.setItem("db_jogos", JSON.stringify(jogosIniciais));
        }

        if (!localStorage.getItem("db_atividades")) {
            const atividadesIniciais = [
                {
                    id: "ativ_1",
                    titulo: "Classificação das Vogais e Alfabeto",
                    serie: "infantil",
                    serieNome: "Educação Infantil",
                    materia: "portugues",
                    materiaNome: "Português",
                    icone: "🔤",
                    enunciado: "Quais são as 5 vogais do nosso alfabeto? Escreva-as na caixa abaixo."
                },
                {
                    id: "ativ_2",
                    titulo: "Continhas de Adição: Frutas e Animais",
                    serie: "1ano",
                    serieNome: "1º Ano",
                    materia: "matematica",
                    materiaNome: "Matemática",
                    icone: "🍎",
                    enunciado: "Se você tem 4 maçãs e ganha mais 3, com quantas maçãs você fica no total?"
                },
                {
                    id: "ativ_3",
                    titulo: "Reconhecimento das Partes de uma Planta",
                    serie: "2ano",
                    serieNome: "2º Ano",
                    materia: "ciencias",
                    materiaNome: "Ciências",
                    icone: "🌱",
                    enunciado: "Cite quais são as principais partes de uma planta completa (ex: raiz, caule...)."
                },
                {
                    id: "ativ_4",
                    titulo: "Desafio da Tabuada do 3 e do 4",
                    serie: "3ano",
                    serieNome: "3º Ano",
                    materia: "matematica",
                    materiaNome: "Matemática",
                    icone: "✖️",
                    enunciado: "Quanto é 3 x 7? E quanto é 4 x 6? Coloque as duas respostas."
                },
                {
                    id: "ativ_5",
                    titulo: "Operações com Centenas e Dezenas",
                    serie: "4e5ano",
                    serieNome: "4º e 5º Ano",
                    materia: "matematica",
                    materiaNome: "Matemática",
                    icone: "🔢",
                    enunciado: "Quanto é 150 + 250? E qual é a metade de 500?"
                }
            ];
            localStorage.setItem("db_atividades", JSON.stringify(atividadesIniciais));
        }

        if (!localStorage.getItem("admin_submissoes_atividades")) {
            localStorage.setItem("admin_submissoes_atividades", JSON.stringify([]));
        }
    },

    /* ========================================================
       BLOCO 3: MÉTODOS DE CONSULTA E GRAVAÇÃO COMPARTILHADOS
       ======================================================== */
    getDesenhos() { return JSON.parse(localStorage.getItem("db_desenhos") || "[]"); },
    getJogos() { return JSON.parse(localStorage.getItem("db_jogos") || "[]"); },
    getAtividades() { return JSON.parse(localStorage.getItem("db_atividades") || "[]"); },
    getSubmissoes() { return JSON.parse(localStorage.getItem("admin_submissoes_atividades") || "[]"); },
    salvarSubmissao(item) {
        const lista = this.getSubmissoes();
        lista.unshift(item);
        localStorage.setItem("admin_submissoes_atividades", JSON.stringify(lista));
    }
};

DB.init();

/* ========================================================
   BLOCO 4: CARREGAMENTO DE ELEMENTOS E ATIVIDADES DO CATÁLOGO
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const bancoAtividades = DB.getAtividades();

    let serieAtiva = "todas";
    let materiaAtiva = "todas";
    let termoBusca = "";
    let atividadeSendoFeita = null;

    const gradeAtividades = document.getElementById("catalogo-atividades");
    const botoesSerie = document.querySelectorAll("#filtros-series .btn-categoria");
    const botoesMateria = document.querySelectorAll("#filtros-materias .btn-aba");
    const campoBusca = document.getElementById("campo-busca");
    const btnTema = document.getElementById("btn-tema-atividades");

    const modalAtiv = document.getElementById("modal-fazer-atividade");
    const modalTitulo = document.getElementById("modal-titulo-ativ");
    const modalEnunciado = document.getElementById("modal-enunciado-ativ");
    const inputResposta = document.getElementById("resposta-aluno");
    const inputNome = document.getElementById("nome-aluno");
    const inputTurma = document.getElementById("turma-aluno");
    const btnEnviarTarefa = document.getElementById("btn-enviar-tarefa");
    const btnFecharModal = document.getElementById("btn-fechar-modal-ativ");

    const btnAbrirBoletim = document.getElementById("btn-abrir-boletim");
    const modalBoletim = document.getElementById("modal-boletim-aluno");
    const btnFecharBoletim = document.getElementById("btn-fechar-boletim");
    const inputBuscarMeuNome = document.getElementById("input-buscar-meu-nome");
    const btnPesquisarMeuBoletim = document.getElementById("btn-pesquisar-meu-boletim");
    const containerListaBoletim = document.getElementById("container-lista-meu-boletim");

    /* ========================================================
       BLOCO 5: TEMA NOTURNO / CLARO
       ======================================================== */
    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            btnTema.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    /* ========================================================
       BLOCO 6: RENDERIZAR ATIVIDADES DO CATÁLOGO
       ======================================================== */
    function renderizar() {
        if (!gradeAtividades) return;
        gradeAtividades.innerHTML = "";

        const filtradas = bancoAtividades.filter(item => {
            const bateuSerie = (serieAtiva === "todas") || (item.serie === serieAtiva);
            const bateuMateria = (materiaAtiva === "todas") || (item.materia === materiaAtiva);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca) || item.enunciado.toLowerCase().includes(termoBusca);
            return bateuSerie && bateuMateria && bateuBusca;
        });

        if (filtradas.length === 0) {
            gradeAtividades.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; font-weight: bold; padding: 40px;">Nenhuma atividade cadastrada para estes filtros.</p>`;
            return;
        }

        filtradas.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-desenho";

            card.innerHTML = `
                <div class="cabecalho-card">
                    <span class="tag-categoria" style="background-color: #d1fae5; color: #065f46;">${item.serieNome || item.serie}</span>
                    <span class="badge-complexidade">${item.materiaNome || item.materia}</span>
                </div>
                <div class="preview-svg-container" style="background-color: #f0fdf4;">
                    <span style="font-size: 3rem;">${item.icone || "📝"}</span>
                </div>
                <h3 class="titulo-card">${item.titulo}</h3>
                <p style="font-size: 0.78rem; color: #64748b; text-align: center; margin-bottom: 12px; flex: 1;">${item.enunciado}</p>
                <button class="btn-jogar" style="background-color: #059669; border: none; cursor: pointer;" onclick="abrirResolucao('${item.id}')">
                    ✏️ Realizar Atividade Online
                </button>
            `;

            gradeAtividades.appendChild(card);
        });
    }

    /* ========================================================
       BLOCO 7: ENVIO DA ATIVIDADE RESOLVIDA
       ======================================================== */
    window.abrirResolucao = function(id) {
        atividadeSendoFeita = bancoAtividades.find(a => a.id === id);
        if (!atividadeSendoFeita) return;

        modalTitulo.innerText = `Atividade: ${atividadeSendoFeita.titulo}`;
        modalEnunciado.innerText = atividadeSendoFeita.enunciado;
        inputResposta.value = "";

        const ultimoNome = localStorage.getItem("aluno_ultimo_nome");
        if (ultimoNome) inputNome.value = ultimoNome;

        modalAtiv.style.display = "flex";
    };

    if (btnFecharModal) {
        btnFecharModal.addEventListener("click", () => { modalAtiv.style.display = "none"; });
    }

    if (btnEnviarTarefa) {
        btnEnviarTarefa.addEventListener("click", () => {
            const resposta = inputResposta.value.trim();
            const nome = inputNome.value.trim();
            const turma = inputTurma.value.trim();

            if (!resposta || !nome) {
                alert("Preencha sua resposta e o seu nome completo antes de enviar!");
                return;
            }

            localStorage.setItem("aluno_ultimo_nome", nome);

            const novaSubmissao = {
                id: "submissao_" + Date.now(),
                atividadeId: atividadeSendoFeita.id,
                tituloAtividade: atividadeSendoFeita.titulo,
                serie: atividadeSendoFeita.serieNome || atividadeSendoFeita.serie,
                materia: atividadeSendoFeita.materiaNome || atividadeSendoFeita.materia,
                enunciado: atividadeSendoFeita.enunciado,
                nomeAluno: nome,
                turmaAluno: turma || "Geral",
                resposta: resposta,
                dataEnvio: new Date().toLocaleString("pt-BR"),
                status: "Pendente",
                nota: null,
                feedbackProfessor: ""
            };

            DB.salvarSubmissao(novaSubmissao);
            modalAtiv.style.display = "none";

            if (typeof confetti === "function") {
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            }

            alert(`Parabéns, ${nome}! Sua atividade foi enviada ao professor. Você pode consultar sua nota no botão 'Minhas Notas / Resultados'!`);
        });
    }

    /* ========================================================
       BLOCO 8: CONSULTA PRIVADA DE NOTAS (BOLETIM DO ALUNO)
       ======================================================== */
    function carregarBoletim(nomeFiltro) {
        containerListaBoletim.innerHTML = "";
        const todas = DB.getSubmissoes();
        const nomeAlvo = (nomeFiltro || "").trim().toLowerCase();

        const minhas = todas.filter(t => t.nomeAluno.toLowerCase().includes(nomeAlvo));

        if (minhas.length === 0) {
            containerListaBoletim.innerHTML = `
                <div style="text-align: center; color: #64748b; padding: 25px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
                    <p style="font-weight: bold; margin-bottom: 6px; color: #0f172a;">Nenhuma atividade localizada para "${nomeFiltro || 'você'}".</p>
                    <p style="font-size: 0.82rem; margin-bottom: 12px;">Resolva uma atividade online para que ela apareça aqui para avaliação do professor.</p>
                </div>
            `;
            return;
        }

        minhas.forEach(tarefa => {
            const card = document.createElement("div");
            card.style.background = "#f8fafc";
            card.style.border = "1px solid #cbd5e1";
            card.style.borderRadius = "12px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "6px";

            const corrigido = (tarefa.status === "Corrigido");

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #0f172a;">${tarefa.tituloAtividade}</strong>
                    <span style="font-size: 0.75rem; color: #64748b;">${tarefa.dataEnvio}</span>
                </div>
                <div style="font-size: 0.82rem; color: #475569;">
                    Aluno: <strong>${tarefa.nomeAluno}</strong> | Turma: ${tarefa.turmaAluno}
                </div>
                <div style="margin-top: 6px; padding-top: 8px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 0.85rem; font-weight: bold;">Status: </span>
                        <span style="font-size: 0.85rem; font-weight: bold; color: ${corrigido ? '#059669' : '#d97706'};">
                            ${corrigido ? '✅ Avaliado' : '⏳ Aguardando Correção'}
                        </span>
                    </div>
                    ${corrigido ? `
                        <div style="background: #ecfdf5; border: 2px solid #059669; padding: 4px 12px; border-radius: 20px;">
                            <span style="font-size: 0.9rem; font-weight: 900; color: #065f46;">Nota: ${tarefa.nota} / 10</span>
                        </div>
                    ` : '<span style="font-size: 0.8rem; color: #64748b; font-style: italic;">Em análise...</span>'}
                </div>
                ${corrigido && tarefa.feedbackProfessor ? `
                    <div style="background: #ffffff; border-left: 3px solid #059669; padding: 8px 12px; border-radius: 4px; margin-top: 6px;">
                        <span style="font-size: 0.78rem; font-weight: bold; color: #065f46;">Recado do Professor:</span>
                        <p style="font-size: 0.82rem; color: #334155; margin: 3px 0 0 0;">${tarefa.feedbackProfessor}</p>
                    </div>
                ` : ''}
            `;
            containerListaBoletim.appendChild(card);
        });
    }

    if (btnAbrirBoletim) {
        btnAbrirBoletim.addEventListener("click", () => {
            const ultimoNome = localStorage.getItem("aluno_ultimo_nome") || "";
            inputBuscarMeuNome.value = ultimoNome;
            carregarBoletim(ultimoNome);
            modalBoletim.style.display = "flex";
        });
    }

    if (btnFecharBoletim) btnFecharBoletim.addEventListener("click", () => { modalBoletim.style.display = "none"; });

    if (btnPesquisarMeuBoletim) {
        btnPesquisarMeuBoletim.addEventListener("click", () => {
            carregarBoletim(inputBuscarMeuNome.value);
        });
    }

    /* ========================================================
       BLOCO 9: FILTROS POR SÉRIE, DISCIPLINA E CAMPO DE BUSCA
       ======================================================== */
    botoesSerie.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesSerie.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            serieAtiva = btn.getAttribute("data-serie");
            renderizar();
        });
    });

    botoesMateria.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesMateria.forEach(b => b.classList.remove("ativa"));
            btn.classList.add("ativa");
            materiaAtiva = btn.getAttribute("data-materia");
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

/* ========================================================
   BLOCO 10: SINCRONIZAÇÃO AUTOMÁTICA DO MENU SUPERIOR ATIVO
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const caminhoAtual = window.location.pathname.split("/").pop() || "index.html";
    const linksMenu = document.querySelectorAll(".links-navegacao .link-nav");

    linksMenu.forEach(link => {
        link.classList.remove("ativo");
        const destino = link.getAttribute("href");
        
        if (
            (caminhoAtual === "" && destino === "index.html") ||
            (caminhoAtual === "index.html" && destino === "index.html") ||
            (caminhoAtual === destino)
        ) {
            link.classList.add("ativo");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. CARREGAMENTO DAS ATIVIDADES (PADRÃO + ADMIN)
    // ========================================================
    const atividadesPadrao = [
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
        }
    ];

    // Carrega também as atividades criadas pelo Admin
    const atividadesCustom = JSON.parse(localStorage.getItem("admin_atividades") || "[]");
    const bancoAtividades = [...atividadesCustom, ...atividadesPadrao];

    // ========================================================
    // 2. ESTADOS E SELETORES
    // ========================================================
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
    // 4. RENDERIZAR ATIVIDADES
    // ========================================================
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
            gradeAtividades.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; font-weight: bold; padding: 40px;">Nenhuma atividade encontrada com esses critérios.</p>`;
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

    // ========================================================
    // 5. ABRIR E ENVIAR ATIVIDADE PARA O PAINEL DO ADMIN
    // ========================================================
    window.abrirResolucao = function(id) {
        atividadeSendoFeita = bancoAtividades.find(a => a.id === id);
        if (!atividadeSendoFeita) return;

        modalTitulo.innerText = `Atividade: ${atividadeSendoFeita.titulo}`;
        modalEnunciado.innerText = atividadeSendoFeita.enunciado;
        inputResposta.value = "";
        modalAtiv.style.display = "flex";
    };

    if (btnFecharModal) {
        btnFecharModal.addEventListener("click", () => {
            modalAtiv.style.display = "none";
        });
    }

    if (btnEnviarTarefa) {
        btnEnviarTarefa.addEventListener("click", () => {
            const resposta = inputResposta.value.trim();
            const nome = inputNome.value.trim();
            const turma = inputTurma.value.trim();

            if (!resposta || !nome) {
                alert("Por favor, preencha sua resposta e o seu nome completo antes de enviar!");
                return;
            }

            const novaSubmissao = {
                id: "submissao_" + Date.now(),
                atividadeId: atividadeSendoFeita.id,
                tituloAtividade: atividadeSendoFeita.titulo,
                serie: atividadeSendoFeita.serieNome || atividadeSendoFeita.serie,
                materia: atividadeSendoFeita.materiaNome || atividadeSendoFeita.materia,
                enunciado: atividadeSendoFeita.enunciado,
                nomeAluno: nome,
                turmaAluno: turma || "Não informada",
                resposta: resposta,
                dataEnvio: new Date().toLocaleString("pt-BR"),
                status: "Pendente",
                nota: null,
                feedbackProfessor: ""
            };

            const submissoes = JSON.parse(localStorage.getItem("admin_submissoes_atividades") || "[]");
            submissoes.unshift(novaSubmissao);
            localStorage.setItem("admin_submissoes_atividades", JSON.stringify(submissoes));

            modalAtiv.style.display = "none";

            if (typeof confetti === "function") {
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            }

            alert(`Parabéns, ${nome}! Sua atividade foi enviada com sucesso para o painel do professor. Em breve ele atribuirá a sua nota!`);
        });
    }

    // ========================================================
    // 6. EVENTOS DE FILTROS E BUSCA
    // ========================================================
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

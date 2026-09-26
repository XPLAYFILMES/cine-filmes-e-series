document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. CARREGAMENTO DAS ATIVIDADES VIA BANCO CENTRAL
    // ========================================================
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

    // ========================================================
    // 2. TEMA NOTURNO
    // ========================================================
    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            btnTema.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    }

    // ========================================================
    // 3. RENDERIZAR ATIVIDADES DO CATÁLOGO
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

    // ========================================================
    // 4. ENVIO DE ATIVIDADE
    // ========================================================
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

    if (btnFecharModal) btnFecharModal.addEventListener("click", () => { modalAtiv.style.display = "none"; });

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

    // ========================================================
    // 5. CONSULTA PRIVADA DE NOTAS (BOLETIM DO ALUNO)
    // ========================================================
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

    // ========================================================
    // 6. FILTROS E BUSCA
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
/* ========================================================
   SINCRONIZAÇÃO AUTOMÁTICA DO MENU SUPERIOR ATIVO
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

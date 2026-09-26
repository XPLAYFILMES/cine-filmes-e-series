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

    // Modais de Realização
    const modalAtiv = document.getElementById("modal-fazer-atividade");
    const modalTitulo = document.getElementById("modal-titulo-ativ");
    const modalEnunciado = document.getElementById("modal-enunciado-ativ");
    const inputResposta = document.getElementById("resposta-aluno");
    const inputNome = document.getElementById("nome-aluno");
    const inputTurma = document.getElementById("turma-aluno");
    const btnEnviarTarefa = document.getElementById("btn-enviar-tarefa");
    const btnFecharModal = document.getElementById("btn-fechar-modal-ativ");

    // Modais de Consulta Privada de Notas
    const btnAbrirBoletim = document.getElementById("btn-abrir-boletim");
    const modalBoletim = document.getElementById("modal-boletim-aluno");
    const btnFecharBoletim = document.getElementById("btn-fechar-boletim");
    const inputBuscarMeuNome = document.getElementById("input-buscar-meu-nome");
    const btnPesquisarMeuBoletim = document.getElementById("btn-pesquisar-meu-boletim");
    const containerListaBoletim = document.getElementById("container-lista-meu-boletim");

   /* ========================================================
       3. CONTROLE DE MODO ESCURO / CLARO (LÓGICA CORRIGIDA)
       ======================================================== */
    // Verifica se já estava salvo no navegador como escuro
    const temaSalvo = localStorage.getItem("tema_colorir_online");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode");
        if (btnTema) btnTema.innerText = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        if (btnTema) btnTema.innerText = "🌙";
    }

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            const estaEscuro = document.body.classList.toggle("dark-mode");
            
            if (estaEscuro) {
                btnTema.innerText = "☀️"; // Ícone de sol para voltar ao modo claro
                localStorage.setItem("tema_colorir_online", "dark");
            } else {
                btnTema.innerText = "🌙"; // Ícone de lua para voltar ao modo escuro
                localStorage.setItem("tema_colorir_online", "light");
            }
        });
    }

    // ========================================================
    // 4. RENDERIZAR ATIVIDADES DO CATÁLOGO
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
    // 5. ABRIR E ENVIAR ATIVIDADE ONLINE
    // ========================================================
    window.abrirResolucao = function(id) {
        atividadeSendoFeita = bancoAtividades.find(a => a.id === id);
        if (!atividadeSendoFeita) return;

        modalTitulo.innerText = `Atividade: ${atividadeSendoFeita.titulo}`;
        modalEnunciado.innerText = atividadeSendoFeita.enunciado;
        inputResposta.value = "";

        // Se o aluno já digitou o nome antes neste aparelho, já preenche automaticamente
        const ultimoNome = localStorage.getItem("aluno_ultimo_nome");
        if (ultimoNome) inputNome.value = ultimoNome;

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

            // Memoriza o nome do aluno neste aparelho para consultas futuras
            localStorage.setItem("aluno_ultimo_nome", nome);

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
                confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
            }

            alert(`Parabéns, ${nome}! Sua atividade foi enviada com sucesso.\n\nVocê pode acompanhar sua nota a qualquer momento clicando no botão "📋 Minhas Notas / Resultados"!`);
        });
    }

    // ========================================================
    // 6. CONSULTA PRIVADA DE NOTAS (BOLETIM DO ALUNO)
    // ========================================================
    function carregarBoletimDoAluno(nomeParaFiltrar) {
        containerListaBoletim.innerHTML = "";
        const todasSubmissoes = JSON.parse(localStorage.getItem("admin_submissoes_atividades") || "[]");

        const nomeBusca = (nomeParaFiltrar || "").trim().toLowerCase();
        const minhasTarefas = todasSubmissoes.filter(sub => 
            sub.nomeAluno.toLowerCase().includes(nomeBusca)
        );

        if (minhasTarefas.length === 0) {
            containerListaBoletim.innerHTML = `
                <div style="text-align: center; color: #64748b; padding: 25px; background: #f8fafc; border-radius: 10px;">
                    <p style="font-weight: bold; margin-bottom: 4px;">Nenhuma atividade encontrada para "${nomeParaFiltrar}".</p>
                    <p style="font-size: 0.8rem; margin: 0;">Certifique-se de digitar o mesmo nome usado no envio da tarefa.</p>
                </div>
            `;
            return;
        }

        minhasTarefas.forEach(tarefa => {
            const cardItem = document.createElement("div");
            cardItem.style.background = "#f8fafc";
            cardItem.style.border = "1px solid #cbd5e1";
            cardItem.style.borderRadius = "12px";
            cardItem.style.padding = "14px";
            cardItem.style.display = "flex";
            cardItem.style.flexDirection = "column";
            cardItem.style.gap = "6px";

            const estaCorrigido = (tarefa.status === "Corrigido");

            cardItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #0f172a; font-size: 0.95rem;">${tarefa.tituloAtividade}</strong>
                    <span style="font-size: 0.75rem; color: #64748b;">${tarefa.dataEnvio}</span>
                </div>
                <div style="font-size: 0.82rem; color: #475569;">
                    <span>Aluno: <strong>${tarefa.nomeAluno}</strong> | Turma: ${tarefa.turmaAluno}</span>
                </div>
                
                <div style="margin-top: 6px; padding-top: 8px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 0.85rem; font-weight: bold;">Status: </span>
                        <span style="font-size: 0.85rem; font-weight: bold; color: ${estaCorrigido ? '#059669' : '#d97706'};">
                            ${estaCorrigido ? '✅ Avaliado pelo Professor' : '⏳ Aguardando Correção'}
                        </span>
                    </div>

                    ${estaCorrigido ? `
                        <div style="background: #ecfdf5; border: 2px solid #059669; padding: 4px 12px; border-radius: 20px;">
                            <span style="font-size: 0.9rem; font-weight: 900; color: #065f46;">Nota: ${tarefa.nota} / 10</span>
                        </div>
                    ` : `
                        <span style="font-size: 0.8rem; color: #64748b; font-style: italic;">Em análise...</span>
                    `}
                </div>

                ${estaCorrigido && tarefa.feedbackProfessor ? `
                    <div style="background: #ffffff; border-left: 3px solid #059669; padding: 8px 12px; border-radius: 4px; margin-top: 6px;">
                        <span style="font-size: 0.78rem; font-weight: bold; color: #065f46;">Recado do Professor:</span>
                        <p style="font-size: 0.82rem; color: #334155; margin: 3px 0 0 0;">${tarefa.feedbackProfessor}</p>
                    </div>
                ` : ''}
            `;

            containerListaBoletim.appendChild(cardItem);
        });
    }

    if (btnAbrirBoletim) {
        btnAbrirBoletim.addEventListener("click", () => {
            const ultimoNome = localStorage.getItem("aluno_ultimo_nome") || "";
            inputBuscarMeuNome.value = ultimoNome;
            carregarBoletimDoAluno(ultimoNome);
            modalBoletim.style.display = "flex";
        });
    }

    if (btnFecharBoletim) {
        btnFecharBoletim.addEventListener("click", () => {
            modalBoletim.style.display = "none";
        });
    }

    if (btnPesquisarMeuBoletim) {
        btnPesquisarMeuBoletim.addEventListener("click", () => {
            carregarBoletimDoAluno(inputBuscarMeuNome.value);
        });
    }

    // ========================================================
    // 7. EVENTOS DE FILTROS E BUSCA
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

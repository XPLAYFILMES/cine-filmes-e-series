document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // 1. BANCO DE DADOS DE ATIVIDADES ESCOLARES
    // ========================================================
    const bancoAtividades = [
        {
            id: "ativ_1",
            titulo: "Treino do Alfabeto e Vogais",
            serie: "infantil",
            serieNome: "Educação Infantil",
            materia: "portugues",
            materiaNome: "Português",
            icone: "🔤",
            descricao: "Pontilhados das letras A, E, I, O, U para coordenação motora inicial.",
            exercicio: "Cubra as linhas pontilhadas de cada vogal e pinte a ilustração correspondente."
        },
        {
            id: "ativ_2",
            titulo: "Contando os Animais (1 a 10)",
            serie: "infantil",
            serieNome: "Educação Infantil",
            materia: "matematica",
            materiaNome: "Matemática",
            icone: "🦁",
            descricao: "Associe a quantidade de animais desenhados ao número correto.",
            exercicio: "Conte quantos animais há em cada grupo e circule o número exato."
        },
        {
            id: "ativ_3",
            titulo: "Ligue os Pontos do Alfabeto",
            serie: "1ano",
            serieNome: "1º Ano",
            materia: "coordenacao",
            materiaNome: "Coordenação",
            icone: "⭐",
            descricao: "Siga as letras de A a Z em ordem para revelar o desenho secreto.",
            exercicio: "Ligue as letras em ordem alfabética e depois pinte o desenho final."
        },
        {
            id: "ativ_4",
            titulo: "Adições Simples com Figuras",
            serie: "1ano",
            serieNome: "1º Ano",
            materia: "matematica",
            materiaNome: "Matemática",
            icone: "➕",
            descricao: "Continhas básicas com suporte visual de maçãs e estrelas.",
            exercicio: "Some as quantidades das figuras e escreva o resultado no quadradinho."
        },
        {
            id: "ativ_5",
            titulo: "Formação de Palavras e Sílabas",
            serie: "2ano",
            serieNome: "2º Ano",
            materia: "portugues",
            materiaNome: "Português",
            icone: "📝",
            descricao: "Junte as sílabas e descubra os nomes dos objetos escolares.",
            exercicio: "Ordene as sílabas embaralhadas e escreva a palavra correta na linha."
        },
        {
            id: "ativ_6",
            titulo: "Partes da Planta e Natureza",
            serie: "2ano",
            serieNome: "2º Ano",
            materia: "ciencias",
            materiaNome: "Ciências",
            icone: "🌻",
            descricao: "Identificação de raiz, caule, folha, flor e fruto com ilustração.",
            exercicio: "Escreva os nomes das partes da planta nas caixinhas indicadas pelas setas."
        },
        {
            id: "ativ_7",
            titulo: "Tabuada Divertida do 2 e do 3",
            serie: "3ano",
            serieNome: "3º Ano",
            materia: "matematica",
            materiaNome: "Matemática",
            icone: "✖️",
            descricao: "Desafios de multiplicação rápida ilustrada com agrupamentos.",
            exercicio: "Resolva as multiplicações e ligue cada conta ao seu resultado."
        },
        {
            id: "ativ_8",
            titulo: "Ecossistemas e Animais",
            serie: "3ano",
            serieNome: "3º Ano",
            materia: "ciencias",
            materiaNome: "Ciências",
            icone: "🌍",
            descricao: "Classificação entre animais vertebrados e invertebrados.",
            exercicio: "Separe os animais em duas colunas de acordo com a sua classe."
        },
        {
            id: "ativ_9",
            titulo: "Desafio de Frações Visuais",
            serie: "4e5ano",
            serieNome: "4º e 5º Ano",
            materia: "matematica",
            materiaNome: "Matemática",
            icone: "🍕",
            descricao: "Compreensão de partes inteiras e frações com pizzas e formas.",
            exercicio: "Pinte a fração correspondente indicada em cada figura geométrica."
        }
    ];

    // ========================================================
    // 2. CONTROLES E ESTADOS DA PÁGINA
    // ========================================================
    let serieAtiva = "todas";
    let materiaAtiva = "todas";
    let termoBusca = "";

    const gradeAtividades = document.getElementById("catalogo-atividades");
    const botoesSerie = document.querySelectorAll("#filtros-series .btn-categoria");
    const botoesMateria = document.querySelectorAll("#filtros-materias .btn-aba");
    const campoBusca = document.getElementById("campo-busca-atividades");
    const btnTema = document.getElementById("btn-tema-atividades");

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
    // 4. IMPRESSÃO DA ATIVIDADE EM FOLHA A4 COM CABEÇALHO
    // ========================================================
    window.imprimirAtividadeA4 = function(idAtividade) {
        const ativ = bancoAtividades.find(a => a.id === idAtividade);
        if (!ativ) return;

        const janela = window.open("", "_blank");
        janela.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>${ativ.titulo} - Folha de Atividade</title>
                <style>
                    @page { size: A4; margin: 15mm; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 10px; margin: 0; }
                    .cabecalho-escola {
                        border: 2px solid #0f172a;
                        border-radius: 8px;
                        padding: 12px 18px;
                        margin-bottom: 20px;
                    }
                    .linha-cabecalho { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; font-weight: bold; }
                    .campo-linha { border-bottom: 1px solid #64748b; flex: 1; margin-left: 8px; }
                    .titulo-atividade { text-align: center; margin-bottom: 15px; }
                    .titulo-atividade h2 { margin: 0; font-size: 20px; color: #0f172a; }
                    .titulo-atividade p { margin: 4px 0 0 0; color: #475569; font-size: 13px; }
                    .caixa-exercicio {
                        border: 2px dashed #94a3b8;
                        border-radius: 12px;
                        min-height: 520px;
                        padding: 25px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        font-size: 16px;
                    }
                    .rodape-folha { text-align: center; margin-top: 30px; font-size: 11px; color: #64748b; }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                <div class="cabecalho-escola">
                    <div class="linha-cabecalho">
                        <span style="display: flex; flex: 2;">ESCOLA:<span class="campo-linha"></span></span>
                        <span style="display: flex; flex: 1; margin-left: 20px;">DATA: ____/____/________</span>
                    </div>
                    <div class="linha-cabecalho">
                        <span style="display: flex; flex: 2;">ALUNO(A):<span class="campo-linha"></span></span>
                        <span style="display: flex; flex: 1; margin-left: 20px;">TURMA / ANO: ${ativ.serieNome}</span>
                    </div>
                </div>

                <div class="titulo-atividade">
                    <h2>${ativ.titulo}</h2>
                    <p>Disciplina: ${ativ.materiaNome} | Série: ${ativ.serieNome}</p>
                </div>

                <div class="caixa-exercicio">
                    <p><strong>Orientações:</strong> ${ativ.exercicio}</p>
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; font-size: 70px; opacity: 0.15;">
                        ${ativ.icone}
                    </div>
                    <div style="border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 14px; color: #64748b;">
                        Espaço para resposta / desenho do aluno:
                    </div>
                </div>

                <div class="rodape-folha">
                    Atividade Educativa Gerada por ColorirOnline • www.colorironline.com
                </div>
            </body>
            </html>
        `);
        janela.document.close();
    };

    // ========================================================
    // 5. RENDERIZAR CARTÕES DE ATIVIDADES
    // ========================================================
    function renderizarAtividades() {
        if (!gradeAtividades) return;
        gradeAtividades.innerHTML = "";

        const filtradas = bancoAtividades.filter(item => {
            const bateuSerie = (serieAtiva === "todas") || (item.serie === serieAtiva);
            const bateuMateria = (materiaAtiva === "todas") || (item.materia === materiaAtiva);
            const bateuBusca = item.titulo.toLowerCase().includes(termoBusca) || item.descricao.toLowerCase().includes(termoBusca);
            return bateuSerie && bateuMateria && bateuBusca;
        });

        if (filtradas.length === 0) {
            gradeAtividades.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; font-weight: bold; padding: 40px;">Nenhuma atividade encontrada para estes filtros.</p>`;
            return;
        }

        filtradas.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-desenho";

            card.innerHTML = `
                <div class="cabecalho-card">
                    <span class="tag-categoria" style="background-color: #d1fae5; color: #065f46;">${item.serieNome}</span>
                    <span class="badge-complexidade">${item.materiaNome}</span>
                </div>
                <div class="preview-svg-container" style="background-color: #f0fdf4;">
                    <span style="font-size: 3rem;">${item.icone}</span>
                </div>
                <h3 class="titulo-card">${item.titulo}</h3>
                <p style="font-size: 0.75rem; color: #64748b; text-align: center; margin-bottom: 12px; flex: 1;">${item.descricao}</p>
                <button onclick="imprimirAtividadeA4('${item.id}')" class="btn-jogar" style="background-color: #059669; margin-bottom: 6px; cursor: pointer; border: none; font-size: 0.82rem;">
                    🖨 Imprimir em A4
                </button>
            `;

            gradeAtividades.appendChild(card);
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
            renderizarAtividades();
        });
    });

    botoesMateria.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesMateria.forEach(b => b.classList.remove("ativa"));
            btn.classList.add("ativa");
            materiaAtiva = btn.getAttribute("data-materia");
            renderizarAtividades();
        });
    });

    if (campoBusca) {
        campoBusca.addEventListener("input", (e) => {
            termoBusca = e.target.value.toLowerCase().trim();
            renderizarAtividades();
        });
    }

    renderizarAtividades();
});

/* ========================================================
   1. BANCO DE DADOS CENTRALIZADO E SINCRONIZADOR
   ======================================================== */
const DB = {
    // Inicialização do banco caso esteja vazio
    init() {
        if (!localStorage.getItem("db_desenhos")) {
            const desenhosIniciais = [
                { id: "desenho_1", titulo: "Estrela Mágica", categoria: "animais", complexidade: "Fácil" },
                { id: "desenho_2", titulo: "Foguetão Espacial", categoria: "infantil", complexidade: "Médio" },
                { id: "desenho_3", titulo: "Flor Geométrica", categoria: "mandalas", complexidade: "Fácil" }
            ];
            for (let i = 4; i <= 35; i++) {
                desenhosIniciais.push({
                    id: `desenho_${i}`,
                    titulo: `Desenho ${i}`,
                    categoria: i % 2 === 0 ? "animais" : "infantil",
                    complexidade: i % 3 === 0 ? "Médio" : "Fácil"
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
                    titulo: "Jogo da Memória: Frutas",
                    tipo: "memoria",
                    tipoNome: "Memória",
                    publico: "infantil",
                    publicoNome: "Infantil",
                    icone: "🍓",
                    cartas: ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓"]
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
                    materiaNome: "Língua Portuguesa",
                    icone: "🔤",
                    enunciado: "Quais são as 5 vogais do nosso alfabeto? Escreva-as na caixa abaixo."
                },
                {
                    id: "ativ_2",
                    titulo: "Continhas de Adição: Frutas",
                    serie: "1ano",
                    serieNome: "1º Ano",
                    materia: "matematica",
                    materiaNome: "Matemática",
                    icone: "🍎",
                    enunciado: "Se você tem 4 maçãs e ganha mais 3, com quantas maçãs você fica no total?"
                },
                {
                    id: "ativ_3",
                    titulo: "Partes de uma Planta",
                    serie: "2ano",
                    serieNome: "2º Ano",
                    materia: "ciencias",
                    materiaNome: "Ciências",
                    icone: "🌱",
                    enunciado: "Cite quais são as principais partes de uma planta completa (ex: raiz, caule...)."
                }
            ];
            localStorage.setItem("db_atividades", JSON.stringify(atividadesIniciais));
        }

        if (!localStorage.getItem("db_submissoes")) {
            localStorage.setItem("db_submissoes", JSON.stringify([]));
        }

        if (!localStorage.getItem("db_perfil")) {
            localStorage.setItem("db_perfil", JSON.stringify({ nome: "Amigo(a)", avatar: "🦁" }));
        }

        if (!localStorage.getItem("som_ativo")) {
            localStorage.setItem("som_ativo", "true");
        }
    },

    getDesenhos() { return JSON.parse(localStorage.getItem("db_desenhos") || "[]"); },
    getJogos() { return JSON.parse(localStorage.getItem("db_jogos") || "[]"); },
    getAtividades() { return JSON.parse(localStorage.getItem("db_atividades") || "[]"); },
    getSubmissoes() { return JSON.parse(localStorage.getItem("db_submissoes") || "[]"); },
    salvarSubmissao(item) {
        const lista = this.getSubmissoes();
        lista.unshift(item);
        localStorage.setItem("db_submissoes", JSON.stringify(lista));
    }
};

DB.init();

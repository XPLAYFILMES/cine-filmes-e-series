document.addEventListener("DOMContentLoaded", () => {
    const botoesAba = document.querySelectorAll(".btn-aba");
    const cards = document.querySelectorAll(".card-desenho");
    const qtdProgresso = document.getElementById("qtd-progresso");
    const qtdFinalizados = document.getElementById("qtd-finalizados");

    let totalProgresso = 0;
    let totalFinalizados = 0;

    // 1. LER O PROGRESSO DE CADA DESENHO SALVO NO NAVEGADOR
    cards.forEach(card => {
        const idDesenho = card.getAttribute("data-id");
        const dadosSalvos = localStorage.getItem(`progresso_${idDesenho}`);
        
        let porcentagem = 0;

        if (dadosSalvos) {
            const progresso = JSON.parse(dadosSalvos);
            // Porcentagem calculada a partir das partes pintadas
            porcentagem = progresso.porcentagem || 0;
        }

        // Atualiza a barra visual e o texto do card
        const barra = card.querySelector(".barra-progresso");
        const texto = card.querySelector(".texto-progresso");

        if (barra) barra.style.width = `${porcentagem}%`;
        if (texto) texto.innerText = `${porcentagem}% Concluído`;

        // Classifica o cartão conforme o estado
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

    // Atualiza os contadores numéricos nas abas
    if (qtdProgresso) qtdProgresso.innerText = totalProgresso;
    if (qtdFinalizados) qtdFinalizados.innerText = totalFinalizados;

    // 2. SISTEMA DE FILTRAGEM DAS ABAS
    botoesAba.forEach(aba => {
        aba.addEventListener("click", () => {
            botoesAba.forEach(a => a.classList.remove("ativa"));
            aba.classList.add("ativa");

            const filtro = aba.getAttribute("data-filtro");

            cards.forEach(card => {
                const statusCard = card.getAttribute("data-status");

                if (filtro === "todos") {
                    card.style.display = "flex";
                } else if (filtro === "progresso") {
                    card.style.display = statusCard === "progresso" ? "flex" : "none";
                } else if (filtro === "finalizados") {
                    card.style.display = statusCard === "finalizados" ? "flex" : "none";
                }
            });
        });
    });
});

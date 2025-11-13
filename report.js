document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

        // ======================
        // 1) Array para guardar os botões que vão piscar
        // ======================
        const botoesPisca = [];

        // ======================
        // 2) Função reutilizável para criar botões com toggle
        // ======================
        function criarToggle(divId, textoMostrar, textoOcultar) {
            const panel = document.getElementById(divId);
            if (!panel || !panel.parentNode) {
                console.log("Elemento não encontrado:", divId);
                return;
            }

            // Oculto por padrão
            panel.style.display = 'none';

            // Cria o botão
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-small';
            btn.textContent = textoMostrar;

            // estilos diretos para garantir que funcionem
            btn.style.transition = 'opacity 0.8s ease-in-out';

            // guarda para animação depois
            botoesPisca.push(btn);

            // Insere o botão ANTES do painel
            panel.parentNode.insertBefore(btn, panel);

            // Toggle
            btn.addEventListener('click', () => {
                const isHidden = panel.style.display === 'none';

                if (isHidden) {
                    panel.style.display = '';
                    btn.textContent = textoOcultar;
                } else {
                    panel.style.display = 'none';
                    btn.textContent = textoMostrar;
                }
            });
        }

        // ======================
        // 3) Criar todos os botões
        // ======================
        criarToggle("PanelStep", "Mostrar histórico", "Ocultar histórico");
        criarToggle("PanelMessage", "Mostrar mensagens", "Ocultar mensagens");
        criarToggle("PanelFile", "Mostrar anexos", "Ocultar anexos");
        criarToggle("PanelFlowDesigner", "Mostrar desenho", "Ocultar desenho");

        // ======================
        // 4) Animação de "piscar" suave via JS
        // ======================
        let opaco = false;
        setInterval(() => {
            botoesPisca.forEach(btn => {
                // se em algum lugar já mudarem a opacidade, não quebra nada
                if (opaco) {
                    btn.style.opacity = '1';
                } else {
                    btn.style.opacity = '0.45';
                }
            });
            opaco = !opaco;
        }, 800); // 0,8s pra ir/voltar, bem suave

        // ======================
        // 5) Ocultar tabelas específicas
        // ======================
        const tabela1 = document.querySelector('table[id="Orientações"]');
        if (tabela1) tabela1.style.display = 'none';

        const tabela2 = document.querySelector('table[id="Links para download"]');
        if (tabela2) tabela2.style.display = 'none';

    }, 100);
});

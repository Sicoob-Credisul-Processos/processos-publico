
window.addEventListener('load', function () {
    setTimeout(function () {

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

            // estilo de transição pra animação suave
            btn.style.transition = 'opacity 0.8s ease-in-out';

            // guarda pra animação
            botoesPisca.push(btn);

            // Insere o botão ANTES do painel
            panel.parentNode.insertBefore(btn, panel);

            // Toggle de exibição
            btn.addEventListener('click', function () {
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
        setInterval(function () {
            botoesPisca.forEach(function (btn) {
                if (opaco) {
                    btn.style.opacity = '1';
                } else {
                    btn.style.opacity = '0.45';
                }
            });
            opaco = !opaco;
        }, 800); // 0,8s para ir/voltar — bem suave

        // ======================
        // 5) Ocultar tabelas específicas
        // ======================
        const tabela1 = document.querySelector('table[id="Orientações"]');
        if (tabela1) {
            tabela1.style.display = 'none';
        } else {
            console.log('Tabela "Orientações" não encontrada');
        }

        const tabela2 = document.querySelector('table[id="Links para download"]');
        if (tabela2) {
            tabela2.style.display = 'none';
        } else {
            console.log('Tabela "Links para download" não encontrada');
        }

    }, 100); // roda 100ms depois que TUDO carregou
});


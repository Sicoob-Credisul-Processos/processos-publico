window.addEventListener('load', function () {
    setTimeout(function () {
// =====================================================
        // 1) Injeta CSS direto no JS (botão com destaque verde)
        // =====================================================
        const estilo = document.createElement("style");
        estilo.innerHTML = `
            .btn-destaque-verde {
                background-color: #eaffe5 !important;
                border: 1px solid #6ccf74 !important;
                color: #2e7d32 !important;
                font-weight: bold;
            }
            .btn-destaque-verde:hover {
                background-color: #d5f7ce !important;
                border-color: #5abf64 !important;
            }
        `;
        document.head.appendChild(estilo);

        // =====================================================
        // 2) Função reutilizável para criar botões de toggle
        // =====================================================
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
            btn.className = 'btn btn-small btn-destaque-verde';
            btn.textContent = textoMostrar;

            // Insere o botão acima do painel
            panel.parentNode.insertBefore(btn, panel);

            // Toggle
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

        // =====================================================
        // 3) Criar botões
        // =====================================================
        criarToggle("PanelStep", "Mostrar histórico", "Ocultar histórico");
        criarToggle("PanelMessage", "Mostrar mensagens", "Ocultar mensagens");
        criarToggle("PanelFile", "Mostrar anexos", "Ocultar anexos");
        criarToggle("PanelFlowDesigner", "Mostrar desenho", "Ocultar desenho");

        // =====================================================
        // 4) Ocultar tabelas específicas
        // =====================================================
        const tabela1 = document.querySelector('table[id="Orientações"]');
        if (tabela1) tabela1.style.display = 'none';

        const tabela2 = document.querySelector('table[id="Links para download"]');
        if (tabela2) tabela2.style.display = 'none';


    }, 100); // roda 100ms depois que TUDO carregou
});

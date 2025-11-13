<script>
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

        // =====================================================
        // 1) Injeta CSS diretamente via JavaScript
        // =====================================================
        const estilo = document.createElement("style");
        estilo.innerHTML = `
            .btn-pisca {
                animation: piscar 1.6s ease-in-out infinite;
            }

            @keyframes piscar {
                0% { opacity: 1; }
                50% { opacity: 0.45; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(estilo);

        // =====================================================
        // 2) Função reutilizável para criar botões com toggle
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
            btn.className = 'btn btn-small btn-pisca'; // inclui efeito
            btn.textContent = textoMostrar;

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

        // =====================================================
        // 3) Criar todos os botões
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

    }, 100);
});
</script>

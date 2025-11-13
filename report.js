document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

        // ======================
        // Função reutilizável
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
            btn.className = 'btn btn-small'; // ajuste se quiser
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

        // ======================
        // BOTÕES
        // ======================

        // Histórico
        criarToggle("PanelStep", "Mostrar histórico", "Ocultar histórico");

        // Mensagens
        criarToggle("PanelMessage", "Mostrar mensagens", "Ocultar mensagens");

        // Arquivos
        criarToggle("PanelFile", "Mostrar anexos", "Ocultar anexos");


        // ======================
        // Ocultar tabelas (seu código antigo)
        // ======================
        const tabela1 = document.querySelector('table[id="Orientações"]');
        if (tabela1) tabela1.style.display = 'none';

        const tabela2 = document.querySelector('table[id="Links para download"]');
        if (tabela2) tabela2.style.display = 'none';

    }, 100);
});

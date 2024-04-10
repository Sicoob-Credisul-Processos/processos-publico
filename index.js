const SicoobZeev = {
    geral: {
        obterOpcoesJsonHierarquico: (objetoJson, ...args) => {
            // Estrutura do JSON hierárquico
            const dados = objetoJson;

            // Verifica se nenhum argumento foi passado
            if (args.length === 0) {
                return Object.keys(dados);
            }

            // Verifica se o primeiro argumento é um nó válido no JSON
            if (dados[args[0]]) {
                // Se tiver apenas um argumento, retorna as chaves do nó correspondente
                if (args.length === 1) {
                    return Object.keys(dados[args[0]]);
                }

                // Se tiver mais de um argumento, verifica se os nós existem e retorna suas chaves
                let currentNode = dados[args[0]];
                for (let i = 1; i < args.length; i++) {
                    if (!currentNode[args[i]]) {
                        return [];
                    }
                    currentNode = currentNode[args[i]];
                }
                return Object.keys(currentNode);
            }

            // Caso nenhum caso corresponda, retorna um array vazio
            return [];
        },
        obterValoresJsonPelaChave: (objeto, chave) => {
            // Verificar se a chave existe no objeto
            if (objeto.hasOwnProperty(chave)) {
                return objeto[chave]; // Retorna o valor se a chave existir
            } else {
                return ''; // Retorna vazio se a chave não existir
            }
        }
    },
    ferramentasHTML: {
        utils: {
            AddlinkParaBaixarTodosOsDocumentos: () => {
                // Seleciona a lista ul com a classe nav-pills
                const lista = document.querySelector('.nav.nav-pills.flex-column');

                // Cria um novo elemento li
                const novoItem = document.createElement('li');
                novoItem.classList.add('nav-item', 'text-nowrap');

                // Cria o conteúdo do novo item
                const novoLink = document.createElement('a');
                novoLink.classList.add('nav-link', 'text-dark');
                novoLink.href = '#containerDownloads'; // Define o href desejado
                novoLink.textContent = 'Baixar arquivos'; // Define o texto do link

                // Adiciona um evento de clique ao novo link
                novoLink.addEventListener('click', function (event) {
                    event.preventDefault(); // Para evitar que o link redirecione

                    // Coloque aqui a lógica que você deseja executar quando o link for clicado
                    // Por exemplo, chamar a função de download de todos os documentos
                    downloadTodosDocumentos();
                });

                // Anexa o link ao novo item e o novo item à lista
                novoItem.appendChild(novoLink);
                lista.appendChild(novoItem);

                // Função para simular o download de todos os documentos
                function downloadTodosDocumentos() {
                    const elementosComDocument = document.querySelectorAll('a[href*="document/download"]');

                    function dispararEventoCliqueComTimeout(elemento, index) {
                        setTimeout(() => {
                            const eventoClique = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            elemento.dispatchEvent(eventoClique);
                        }, index * 1000); // Atraso de 1 segundo entre cada clique
                    }

                    elementosComDocument.forEach((elemento, index) => {
                        dispararEventoCliqueComTimeout(elemento, index);
                    });
                }
            }
        },
        Alertas: {
            criarAlertSpam: (idDoInput, mensagem, color) => {
                SicoobZeev.ferramentasHTML.Alertas.apagarAlertSpam(idDoInput)

                let inputElement = document.getElementById(idDoInput);

                let textoEmbaixo = document.createElement('p');
                textoEmbaixo.id = `alerta${idDoInput}`
                textoEmbaixo.style.color = color || "red"
                textoEmbaixo.style.fontSize = "15px"
                textoEmbaixo.style.padding = "0px"
                textoEmbaixo.textContent = mensagem;
                inputElement.parentNode.appendChild(textoEmbaixo);
            },

            apagarAlertSpam: (idDoInput) => {
                let alerta = document.getElementById(`alerta${idDoInput}`)

                if (alerta) alerta.remove()
            }
        },
        tabela: {
            ocultarTitulosTabelasMultivaloradas: (nomeTabela) => {
                let tabelasMultivaloradas = document.getElementsByClassName('table-responsive');

                for (let tabelaMultivalorada of tabelasMultivaloradas) {

                    tabelaMultivalorada.style = "padding-top: 20px";
                    var elementoCaption = tabelaMultivalorada.querySelector('caption');

                    if (elementoCaption && elementoCaption.textContent.trim() === nomeTabela) {
                        elementoCaption.style.display = 'none';
                    }
                }
            },
            obterDadosTabelaMultivalorada: (nomeTabela) => {
                let tables = document.getElementsByTagName('table');
                let dados = [];

                for (var i = 0; i < tables.length; i++) {
                    if (tables[i].caption && tables[i].caption.textContent.trim() === nomeTabela) {
                        let colunasHTML = tables[i].querySelectorAll('tr[class="header"]');

                        const colunas = colunasHTML[0].querySelectorAll('[column-name]')

                        const nomeColunas = []

                        for (let coluna of colunas) {
                            nomeColunas.push(coluna.getAttribute('column-name'))
                        }

                        if (nomeColunas.length === 0) {
                            console.error(`Colunas não encontrada na tabela ${nomeTabela}`);
                            return dados;
                        }

                        let linhas = tables[i].querySelectorAll('tr:not([class="header"])');

                        for (let linha of linhas) {

                            let objetoLinha = {};
                            for (let nomeColuna of nomeColunas) {
                                let coluna = linha.querySelector('td[column-name="' + nomeColuna + '"]');
                                let input = coluna.querySelector('input');
                                if (input) {
                                    nomeColuna = nomeColuna.replace("col", "")
                                    objetoLinha[`inp${nomeColuna}`] = input.value;
                                }
                            };
                            dados.push(objetoLinha);
                        };
                        return dados;
                    }
                }

                console.error(`Tabela com o nome ${nomeTabela} não encontrada`);
                return dados;
            },

            obterDadosTabelaMultivaloradaPorColuna: (nomeTabela, idColuna) => {
                let tables = document.getElementsByTagName('table');
                idColuna = idColuna.replace("inp", "")

                let dados = [];


                for (var i = 0; i < tables.length; i++) {
                    if (tables[i].caption && tables[i].caption.textContent.trim() === nomeTabela) {
                        let colunas = tables[i].querySelectorAll('td[column-name="' + `col${idColuna}` + '"]');
                        if (colunas.length === 0) {
                            console.error(`Coluna ${idColuna} não encontrada na tabela ${nomeTabela}`);
                            return dados;
                        }
                        colunas.forEach(function (coluna) {
                            let input = coluna.querySelector('input');
                            if (input) {
                                dados.push(input.value);
                            }
                        });
                        return dados; // Retorna os dados uma vez que a coluna é encontrada
                    }
                }

                console.error(`Tabela com o nome ${nomeTabela} não encontrada`);
                return dados; // Retorna uma array vazia se a tabela não for encontrada
            }
        },
        campoTexto: {
            contarCaracteres: (text) => {
                return text.length;
            }
        },
        campoData: {
            ehDataFutura: (dateString) => {
                //dateString, formato: "10/02/2023"
                let today = new Date();
                today.setHours(0, 0, 0, 0); // Define as horas, minutos, segundos e milissegundos como zero para comparar apenas as datas
                let dateObj = new Date(dateString);
                return dateObj > today;
            }
        },
        campoSelecao: {
            mostrarCampos: (idCampoSelecao, valoresVisiveis) => {
                //exemplo (inpCidades, ["Valor A", "Valor B"])
                var campoSelecao = document.getElementById(idCampoSelecao);
                var opcoes = campoSelecao.querySelectorAll("option");

                for (const opcao of opcoes) {
                    if (valoresVisiveis.includes(opcao.value)) {
                        opcao.style.display = ""; // Remove o estilo display: none
                    } else {
                        opcao.style.display = "none";
                    }
                }
            },
            // Função para mostrar apenas o valor especificado no campo de seleção
            mostrarApenasUmValor: (id, valor) => {
                let selectElement = document.getElementById(id);
                let options = selectElement.getElementsByTagName("option");

                for (let i = 0; i < options.length; i++) {
                    if (options[i].value == valor) {
                        options[i].style.display = "block"; // Exibe o valor se for igual ao especificado
                    } else {
                        options[i].style.display = "none"; // Oculta os demais valores
                    }
                }
            },

            // Função para mostrar todos os valores no campo de seleção
            mostrarTodosValores: (id) => {
                let selectElement = document.getElementById(id);
                let options = selectElement.querySelectorAll('option');

                for (let i = 0; i < options.length; i++) {
                    options[i].style.display = "inline"; // Exibe todos os valores
                }
            },

            // Função para ocultar todos os valores no campo de seleção e limpar a seleção
            ocultarTodosValores: (id) => {
                let selectElement = document.getElementById(id);
                let options = selectElement.querySelectorAll('option');

                for (let i = 0; i < options.length; i++) {
                    options[i].style.display = "none"; // Oculta todos os valores
                }

                selectElement.value = ""; // Limpa a seleção
            },

            // Função para exibir apenas os valores presentes no array no campo de seleção
            exibirValoresDoArray: (id, arrayDeValores) => {
                let selectElement = document.getElementById(id);

                for (let i = 0; i < selectElement.options.length; i++) {
                    selectElement.options[i].style.display = "none"; // Oculta todos os valores
                }

                for (valor of arrayDeValores) {
                    selectElement.querySelector(`option[value="${valor}"]`).style.display = "inline"; // Exibe os valores presentes no array
                }
            },

            // Função para ocultar os valores que contêm no array no campo de seleção
            ocultarValoresDoArray: (id, arrayDeValores) => {
                let selectElement = document.getElementById(id);

                for (valor of arrayDeValores) {
                    selectElement.querySelector(`option[value="${valor}"]`).style.display = "none"; // Oculta os valores presentes no array
                }
            },

            // Função para excluir todos os valores no campo de seleção
            excluirTodosValores: (id) => {
                let selectElement = document.getElementById(id);
                let options = selectElement.querySelectorAll('option');

                for (let i = 0; i < options.length; i++) {
                    selectElement.remove(0); // Remove todos os valores
                }
            },

            // Função para excluir os valores que contêm no array no campo de seleção
            excluirValoresNoArray: (id, arrayDeValores) => {
                let selectElement = document.getElementById(id);
                for (valor of arrayDeValores) {
                    selectElement.querySelector(`option[value="${valor}"]`).remove(0); // Remove os valores presentes no array
                }
            },

            // Função para mostrar apenas os valores que contêm o texto especificado no campo de seleção
            mostrarApenasValoresQueContemUmTexto: (id, texto) => {
                let selectElement = document.getElementById(id);
                let options = selectElement.querySelectorAll('option');

                for (let i = 0; i < options.length; i++) {
                    if (!options[i].text.includes(texto)) {
                        options[i].style.display = "none"; // Oculta os valores que não contêm o texto especificado
                    }
                }
            }
        },
        campoSelecaoUnica: {
            retornarValoresOpcaoSelecionada: (ArrayDeElementId) => {

                let valores = []

                for (let elementId of ArrayDeElementId) {
                    elementId = elementId.replace("inp", "")

                    let inputs = document.querySelectorAll('#td1' + elementId + ' input')

                    inputs.forEach(function (input) {
                        if (input.checked) {
                            valores.push(input.value)
                        }
                    })
                }
                return valores
            }
        }
    },
    validadores: {
        validarCPFCNPJ: (documento) => {
            documento = documento.replace(/[^\d]/g, '')

            if (documento.length === 11) {
                if (SicoobZeev.validadores.validarCPF(documento)) {
                    return { tipo: 'PF', valido: true }
                }
            } else if (documento.length === 14) {
                if (SicoobZeev.validadores.validarCNPJ(documento)) {
                    return { tipo: 'PJ', valido: true }
                }
            }

            return { tipo: 'Inválido', valido: false }
        },

        validarCPF: (cpf) => {
            // Validação do CPF
            cpf = cpf.replace(/[^\d]/g, '')

            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false
            }

            let soma = 0
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i)
            }
            let resto = 11 - (soma % 11)
            let digitoVerificador1 = (resto >= 10) ? 0 : resto

            soma = 0
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i)
            }
            resto = 11 - (soma % 11)
            let digitoVerificador2 = (resto >= 10) ? 0 : resto

            return parseInt(cpf.charAt(9)) === digitoVerificador1 && parseInt(cpf.charAt(10)) === digitoVerificador2
        },

        validarCNPJ: (cnpj) => {
            // Validação do CNPJ
            cnpj = cnpj.replace(/[^\d]/g, '')

            if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
                return false
            }

            let tamanho = cnpj.length - 2
            let numeros = cnpj.substring(0, tamanho)
            let digitos = cnpj.substring(tamanho)
            let soma = 0
            let pos = tamanho - 7

            for (let i = tamanho; i >= 1; i--) {
                soma += parseInt(numeros.charAt(tamanho - i)) * pos--
                if (pos < 2) {
                    pos = 9
                }
            }
            let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

            if (parseInt(digitos.charAt(0)) !== resultado) {
                return false
            }

            tamanho += 1
            numeros = cnpj.substring(0, tamanho)
            soma = 0
            pos = tamanho - 7

            for (let i = tamanho; i >= 1; i--) {
                soma += parseInt(numeros.charAt(tamanho - i)) * pos--
                if (pos < 2) {
                    pos = 9
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

            return parseInt(digitos.charAt(1)) === resultado
        }
    }
}

console.info("Iniciando o script Sicoob Zeev");

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

        SicoobZeev.ferramentasHTML.utils.AddlinkParaBaixarTodosOsDocumentos();

    }, 200);
});

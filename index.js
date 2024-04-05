console.info("Iniciando o script Sicoob Zeev");
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
        }
    },
    ferramentasHTML: {
        tabela: {},
        campoTexto: {
             contarCaracteres: (text)=> {
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
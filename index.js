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
        },
        valorEmReaisPorExtenso: (valor) => {
            // Remover vírgula e converter para número float
            valor = parseFloat(valor.replace(',', '.'));

            // Verificar se o valor é válido
            if (isNaN(valor)) {
                return 'Valor inválido';
            }

            // Definição das unidades, dezenas e centenas
            const unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
            const dezenasAteDezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
            const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
            const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

            const unidadesSingulares = ['', 'mil', 'milhão', 'bilhão', 'trilhão', 'quadrilhão'];
            const unidadesPlurais = ['', 'mil', 'milhões', 'bilhões', 'trilhões', 'quadrilhões'];

            // Função para converter valores menores que 1000 em palavras
            function converterMenorQueMil(numero) {
                if (numero < 10) {
                    return unidades[numero];
                } else if (numero < 20) {
                    return dezenasAteDezenove[numero - 10];
                } else if (numero < 100) {
                    const dezena = Math.floor(numero / 10);
                    const unidade = numero % 10;
                    return dezenas[dezena] + (unidade > 0 ? ' e ' + unidades[unidade] : '');
                } else if (numero === 100) {
                    return 'cem'
                } else {
                    const centena = Math.floor(numero / 100);
                    const resto = numero % 100;
                    return centenas[centena] + (resto > 0 ? ' e ' + converterMenorQueMil(resto) : '');
                }
            }

            // Função para converter valores maiores em palavras
            function converterValor(numero) {
                if (numero < 1000) {
                    return converterMenorQueMil(numero);
                }

                let resultado = '';
                let nivel = 0;

                // Dividir o número por 1000 para converter partes maiores em palavras
                while (numero > 0) {
                    const parte = numero % 1000;
                    numero = Math.floor(numero / 1000);

                    // Se a parte for maior que zero, converte
                    if (parte > 0) {
                        const partePorExtenso = converterMenorQueMil(parte);

                        const unidade = (parte === 1) ? unidadesSingulares[nivel] : unidadesPlurais[nivel];
                        // Adicionar a parte por extenso com o nível correspondente


                        if (resultado.length > 0) {
                            let partes = resultado.split(" ").length;

                            if (partes < 4) {
                                resultado = partePorExtenso + ' ' + unidade + ' e ' + resultado;
                            } else {
                                resultado = partePorExtenso + ' ' + unidade + ' ' + resultado;
                            }

                        } else {
                            resultado = partePorExtenso + ' ' + unidade;
                        }
                    }
                    nivel++;
                }

                return resultado.trim();
            }

            // Converter o valor inteiro e a parte decimal separadamente
            const parteInteira = Math.floor(valor);
            const parteDecimal = Math.round((valor - parteInteira) * 100);
            let resultado

            if (parteInteira > 0 || parteInteira == 0 && parteDecimal == 0) {

                resultado = `${converterValor(parteInteira)} ${parteInteira <= 1 ? 'real' : 'reais'}`;

                if (parteDecimal > 0) {
                    resultado += ' e ' + converterMenorQueMil(parteDecimal) + `${parteDecimal <= 1 ? ' centavo' : ' centavos'}`;
                }
            } else {
                resultado = `${converterMenorQueMil(parteDecimal)} ${parteDecimal === 1 ? 'centavo' : 'centavos'} de real`;
            }

            return resultado.charAt(0).toUpperCase() + resultado.slice(1);
        },
        criarTabelaDeVisualizacao: (divPai, dados, titulo, nomesColunas) => {
            const tituloSemAcento = titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //retira os acentos do titulo
            const tituloPorPalavra = tituloSemAcento.split(' '); //separa o titulo por palavras

            // Converte a primeira letra de cada palavra para maiúscula
            const tituloPorPalavraCamelCase = tituloPorPalavra.map((palavra) => {
                return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
            });

            // Junta as palavras novamente em uma única string
            const tituloCamelCase = tituloPorPalavraCamelCase.join('');

            var novaDiv = document.createElement("div");
            novaDiv.className = "box spaced padded";
            novaDiv.id = `divTable${tituloCamelCase}`;

            // Criar um novo elemento h3
            var novoH3 = document.createElement('h3');
            novoH3.textContent = titulo;
            novoH3.style.paddingBottom = "15px"
            novaDiv.appendChild(novoH3);

            const tabela = document.createElement('table');
            tabela.style.borderCollapse = 'collapse';
            tabela.style.width = '100%';

            // Cabeçalho da tabela
            const cabecalho = tabela.createTHead();
            const cabecalhoRow = cabecalho.insertRow();

            // Criar as células do cabeçalho baseadas no array de nomes de colunas
            nomesColunas.forEach(nome => {
                const cabecalhoCell = cabecalhoRow.insertCell();
                cabecalhoCell.textContent = nome;
                cabecalhoCell.style.border = '1px solid #dddddd';
                cabecalhoCell.style.padding = '8px';
            });

            // Corpo da tabela
            const corpo = tabela.createTBody();

            // Preencher corpo da tabela com os dados
            dados.forEach(objeto => {
                const linha = corpo.insertRow();

                // Preencher as células da linha com os dados do objeto
                nomesColunas.forEach(nome => {

                    const nomeSemAcento = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    const nomeColuna = nomeSemAcento.split(' ');

                    // Converte a primeira letra de cada palavra para maiúscula, exceto a primeira palavra
                    const camelCase = nomeColuna.map((palavra, index) => {
                        if (index === 0) {
                            return palavra.toLowerCase(); // A primeira palavra permanece em minúsculas
                        } else {
                            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
                        }
                    })

                    // Junta as palavras novamente em uma única string
                    const nomeChaveObjeto = camelCase.join('');

                    const cell = linha.insertCell();
                    cell.textContent = objeto[nomeChaveObjeto];
                    cell.style.border = '1px solid #dddddd';
                    cell.style.padding = '8px';
                })
            })

            novaDiv.appendChild(tabela);

            let boxFrmExecute = document.getElementById(divPai);
            boxFrmExecute.parentNode.insertBefore(novaDiv, boxFrmExecute.nextSibling);
        }
    },
    ferramentasHTML: {
        utils: {
            ClicarNoBotaoPesquisarDoInputPesquisarPreencher: () => {
                // Selecionar todos os inputs com a classe form-control-text
                const inputs = document.querySelectorAll('[data-fieldformat="SEARCH_AND_FILL"]');

                // Adicionar um evento de pressionar tecla para cada input
                inputs.forEach(function (input) {
                    input.addEventListener('keypress', function (event) {
                        // Verificar se a tecla pressionada é Enter (código 13)
                        if (event.keyCode === 13) {
                            // Disparar o evento onBlur no campo de entrada
                            input.blur()

                            setTimeout(() => {
                                // Encontrar o botão correspondente
                                const button = input.parentElement.parentElement.querySelector('button.btn-search-and-fill');
                                // Clicar no botão se ele existir
                                if (button) {
                                    button.click();
                                }
                            }, 200)
                        }
                    });
                });
            },
            createTeamsLink: () => {
                // Seleciona o email da div correspondente
                const emailElement = document.querySelector('.user-content .small')?.textContent;

                if (emailElement) {
                    // Cria a URL do Teams com o email
                    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(emailElement)}`;

                    // Cria o link
                    const linkElement = document.createElement('a');
                    linkElement.href = teamsUrl;
                    linkElement.textContent = "Conversar com o requerente no Teams";
                    linkElement.target = "_blank"; // Abre em uma nova aba

                    // Cria uma nova div para o link
                    const divElement = document.createElement('div');
                    divElement.id = 'teams-link';

                    // Adiciona o link dentro da div
                    divElement.appendChild(linkElement);

                    // Adiciona a nova div com o link no final de .user-content
                    const userContent = document.querySelector('.user-content');
                    userContent.appendChild(divElement);
                }
            },
            AddlinkParaBaixarTodosOsDocumentos: () => {

                // Seleciona a lista ul com a classe nav-pills
                const lista = document.querySelector('.nav.nav-pills.flex-column');

                // Seleciona o elemento com o id "lnkDownloadAllFiles"
                const downloadLinkElement = document.getElementById('lnkDownloadAllFiles');

                if (downloadLinkElement) {
                    // Clona o elemento "lnkDownloadAllFiles"
                    const cloneLink = downloadLinkElement.cloneNode(true); // true para clonar o conteúdo interno também

                    // Define os estilos inline para o link clonado
                    cloneLink.style.display = 'block'; // Mude para 'block' para ocupar toda a largura
                    cloneLink.style.overflow = 'hidden';
                    cloneLink.style.textOverflow = 'ellipsis';
                    cloneLink.style.whiteSpace = 'nowrap';
                    cloneLink.style.fontSize = '0.8em'; // Tamanho da fonte reduzido
                    cloneLink.style.padding = '0.5rem 1rem'; // Adicione um padding para aumentar a área clicável

                    // Cria um novo elemento li
                    const novoItem = document.createElement('li');
                    novoItem.classList.add('nav-item', 'text-nowrap');

                    novoItem.style.width = '100%';

                    // Adiciona o clone ao novo item
                    novoItem.appendChild(cloneLink);

                    // Adiciona o novo item à lista
                    lista.appendChild(novoItem);
                } else {
                    console.error('Elemento com ID lnkDownloadAllFiles não encontrado.');
                }


                /*Código comentado por Juliano de Mello em 21/10/2024*/
                // // Seleciona a lista ul com a classe nav-pills
                // const lista = document.querySelector('.nav.nav-pills.flex-column');

                // // Cria um novo elemento li
                // const novoItem = document.createElement('li');
                // novoItem.classList.add('nav-item', 'text-nowrap');

                // // Cria o conteúdo do novo item
                // const novoLink = document.createElement('a');
                // novoLink.classList.add('nav-link', 'text-dark');
                // novoLink.href = '#containerDownloads'; // Define o href desejado
                // novoLink.textContent = 'Baixar arquivos'; // Define o texto do link

                // // Adiciona um evento de clique ao novo link
                // novoLink.addEventListener('click', function (event) {
                //     event.preventDefault(); // Para evitar que o link redirecione

                //     // Coloque aqui a lógica que você deseja executar quando o link for clicado
                //     // Por exemplo, chamar a função de download de todos os documentos
                //     downloadTodosDocumentos();
                // });

                // // Anexa o link ao novo item e o novo item à lista
                // novoItem.appendChild(novoLink);
                // lista.appendChild(novoItem);

                // // Função para simular o download de todos os documentos
                // function downloadTodosDocumentos() {
                //     const elementosComDocument = document.querySelectorAll('a[href*="document/download"]');

                //     function dispararEventoCliqueComTimeout(elemento, index) {
                //         setTimeout(() => {
                //             const eventoClique = new MouseEvent('click', {
                //                 bubbles: true,
                //                 cancelable: true,
                //                 view: window
                //             });
                //             elemento.dispatchEvent(eventoClique);
                //         }, index * 1200); // Atraso de 1 segundo entre cada clique
                //     }

                //     elementosComDocument.forEach((elemento, index) => {
                //         dispararEventoCliqueComTimeout(elemento, index);
                //     });
                // }
            },
            adicionarTextoRicoHTML(idDaReferencia, html) {
                // Encontrar o elemento pelo ID
                const elemento = document.getElementById(idDaReferencia);

                if (elemento) {
                    // Criar um novo elemento de parágrafo
                    const novoParagrafo = document.createElement('p');
                    // Adicionar o estilo justificado via JavaScript
                    novoParagrafo.style.textAlign = 'justify';
                    // Definir o HTML do parágrafo
                    novoParagrafo.innerHTML = html;

                    novoParagrafo.id = `textoRico${idDaReferencia}`

                    // Inserir o novo parágrafo após o elemento encontrado
                    elemento.insertAdjacentElement('afterend', novoParagrafo);
                } else {
                    console.error(`Elemento com ID "${idDaReferencia}" não encontrado.`);
                }
            },
            limitarTextArea: (maximoDeCaracteres) => {
                const textAreas = document.querySelectorAll('textarea');

                textAreas.forEach((textArea) => {
                    const aviso = document.createElement('div');

                    aviso.style.cssText = 'color:#e53935;font-size:0.85rem;margin-top:4px;display:none';

                    aviso.textContent = `⚠️ Limite de ${maximoDeCaracteres} caracteres atingido!`;

                    textArea.insertAdjacentElement('afterend', aviso);

                    textArea.addEventListener('input', (e) => {
                        const { value } = e.target;

                        if (value.length > maximoDeCaracteres) {

                            e.target.value = value.slice(0, maximoDeCaracteres);

                            aviso.style.display = 'block';
                            console.log(`🚨 Texto truncado em ${maximoDeCaracteres} caracteres.`);
                        } else {
                            aviso.style.display = 'none';
                        }
                    });
                });
            }
        },
        Alertas: {
            toast: (message, type = 'success') => {
                let toastContainer = document.getElementById('toast-container');

                // Criar o contêiner apenas uma vez
                if (!toastContainer) {
                    toastContainer = document.createElement('div');
                    toastContainer.id = 'toast-container';
                    toastContainer.style.position = 'fixed';
                    toastContainer.style.top = '20px';
                    toastContainer.style.left = '50%';
                    toastContainer.style.transform = 'translateX(-50%)';
                    toastContainer.style.display = 'flex';
                    toastContainer.style.flexDirection = 'column';
                    toastContainer.style.gap = '10px';
                    toastContainer.style.alignItems = 'center';
                    toastContainer.style.zIndex = '9999';
                    document.body.appendChild(toastContainer);
                }

                const toast = document.createElement('div');
                toast.textContent = message;

                // Estilos básicos
                toast.style.padding = '16px 24px';
                toast.style.borderRadius = '10px';
                toast.style.fontSize = '18px';
                toast.style.fontWeight = 'bold';
                toast.style.color = 'white';
                toast.style.opacity = '1';
                toast.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                toast.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-in-out';
                toast.style.minWidth = '250px';
                toast.style.textAlign = 'center';

                // Definição de cores conforme o tipo de mensagem
                switch (type) {
                    case 'error':
                        toast.style.background = '#e74c3c'; // Vermelho
                        break;
                    case 'warning':
                        toast.style.background = '#f39c12'; // Laranja
                        break;
                    case 'success':
                    default:
                        toast.style.background = '#2ecc71'; // Verde
                        break;
                }

                // Adiciona ao container
                toastContainer.appendChild(toast);

                // Remoção suave da notificação
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toastContainer.removeChild(toast);
                        }
                    }, 500);
                }, 2500);
            },
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
            mapearTabelaMultivalorada: (nomeTabela, novoid = nomeTabela) => {
                let tables = document.getElementsByTagName('table');

                for (let i = 0; i < tables.length; i++) {
                    if (tables[i].caption && tables[i].caption.textContent.trim() === nomeTabela) {
                        tables[i].setAttribute("id", novoid)
                        Zeev.Form.Functions.Tables.MapTableMult(novoid);
                    }
                }
            },
            validarTabela: (array, regras, idDaTabela) => {
                const mensagensErro = []; // Array para armazenar mensagens de erro
                const valoresVerificados = {}; // Objeto para rastrear valores já verificados

                // Função para formatar o nome do campo, removendo prefixos e adicionando espaços entre palavras
                const formatarNomeCampo = (campo) => {
                    const nomeCampo = campo.replace(/^inp/, '');
                    return nomeCampo
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/^./, (str) => str.toUpperCase());
                };

                // Função para validar dependências entre campos
                // const validarDependencias = (linha, dependencias, index, campoPrincipal, valorPrincipal) => {
                //     dependencias.forEach((dependencia) => {
                //         const {
                //             campo: campoDependente,           // Campo dependente a ser validado
                //             obrigatorio: obrigatorioDependente, // Indica se o campo dependente é obrigatório
                //             valoresAceitos: valoresDependencia, // Lista de valores aceitos para o campo dependente
                //             obrigatorioTodos,                // Indica se todos os valores devem ser verificados
                //             dependencias: subDependencias,    // Dependências adicionais para validação recursiva
                //         } = dependencia;
                //         const valorDependencia = linha[campoDependente]; // Valor do campo dependente
                //         const nomeDependencia = formatarNomeCampo(campoDependente); // Nome formatado do campo dependente

                //         // Chave de verificação única para rastrear valores já verificados
                //         const chaveVerificacao = `${campoPrincipal}-${valorPrincipal}-${campoDependente}`;
                //         if (!valoresVerificados[chaveVerificacao] && Array.isArray(valoresDependencia)) {
                //             valoresVerificados[chaveVerificacao] = new Set(valoresDependencia);
                //         }

                //         // Verifica se o campo dependente é obrigatório e está vazio
                //         if (obrigatorioDependente && (!valorDependencia || valorDependencia.trim() === '')) {
                //             mensagensErro.push(`Linha ${index + 1}: O campo "${nomeDependencia}" é obrigatório.`);
                //         }

                //         // Verifica se o valor do campo dependente está na lista de valores aceitos, caso seja um objeto
                //         if (
                //             typeof valoresDependencia === 'object' &&
                //             !Array.isArray(valoresDependencia) &&
                //             valoresDependencia[valorPrincipal] &&
                //             valorDependencia &&
                //             !valoresDependencia[valorPrincipal].includes(valorDependencia)
                //         ) {
                //             mensagensErro.push(
                //                 `Linha ${index + 1}: O campo "${nomeDependencia}" deve ser um dos valores: "${valoresDependencia[
                //                     valorPrincipal
                //                 ].join('", "')}" quando "${formatarNomeCampo(campoPrincipal)}" é "${valorPrincipal}".`
                //             );
                //         }

                //         // Verifica se o valor do campo dependente está na lista de valores aceitos, caso seja um array
                //         if (
                //             Array.isArray(valoresDependencia) &&
                //             valorDependencia &&
                //             !valoresDependencia.includes(valorDependencia)
                //         ) {
                //             mensagensErro.push(
                //                 `Linha ${index + 1}: O campo "${nomeDependencia}" deve ser um dos valores: "${valoresDependencia.join(
                //                     '", "'
                //                 )}" quando "${formatarNomeCampo(campoPrincipal)}" é "${valorPrincipal}".`
                //             );
                //         }

                //         // Verifica se todos os valores obrigatórios foram preenchidos
                //         if (
                //             obrigatorioTodos &&
                //             Array.isArray(valoresDependencia) &&
                //             valoresVerificados[chaveVerificacao]
                //         ) {
                //             if (valoresVerificados[chaveVerificacao].has(valorDependencia)) {
                //                 valoresVerificados[chaveVerificacao].delete(valorDependencia);
                //             }
                //         }

                //         // Recursivamente validar sub-dependências
                //         if (subDependencias && subDependencias.length > 0) {
                //             validarDependencias(linha, subDependencias, index, campoDependente, valorDependencia);
                //         }
                //     });
                // };

                const validarDependencias = (linha, dependencias, index, campoPrincipal, valorPrincipal) => {
                    dependencias.forEach((dependencia) => {
                        const {
                            campo: campoDependente,
                            obrigatorio: obrigatorioDependente,
                            valoresAceitos: valoresDependencia,
                            obrigatorioTodos,
                            dependencias: subDependencias,
                            validarArquivo: validarArquivoDependente
                        } = dependencia;

                        const valorDependencia = linha[campoDependente];
                        const nomeDependencia = formatarNomeCampo(campoDependente);

                        // Chave de verificação única para rastrear valores já verificados
                        const chaveVerificacao = `${campoPrincipal}-${valorPrincipal}-${campoDependente}`;
                        if (!valoresVerificados[chaveVerificacao] && Array.isArray(valoresDependencia)) {
                            valoresVerificados[chaveVerificacao] = new Set(valoresDependencia);
                        }

                        // Verifica se o campo dependente é obrigatório e está vazio
                        if (obrigatorioDependente && (!valorDependencia || valorDependencia.trim() === '')) {
                            mensagensErro.push(`Linha ${index + 1}: O campo "${nomeDependencia}" é obrigatório.`);
                        }

                        // Se validarArquivo estiver ativado, ignora valoresAceitos como valor e valida EXTENSÃO
                        if (validarArquivoDependente && valoresDependencia && typeof valoresDependencia === 'object') {
                            if (typeof valorDependencia === 'string' && valorDependencia.includes('.')) {
                                const extensao = valorDependencia.split('.').pop().toLowerCase();

                                if (valoresDependencia[valorPrincipal]) {
                                    const extensoesAceitas = valoresDependencia[valorPrincipal].map(e => e.toLowerCase());

                                    if (!extensoesAceitas.includes(extensao)) {
                                        mensagensErro.push(
                                            `Linha ${index + 1}: O campo "${nomeDependencia}" deve ser um arquivo com extensão: "${extensoesAceitas.join('", "')}" quando "${formatarNomeCampo(campoPrincipal)}" é "${valorPrincipal}".`
                                        );
                                    }
                                }
                            }
                        } else {
                            // Validação padrão de valoresAceitos como valor do campo (Array ou Objeto)
                            if (
                                typeof valoresDependencia === 'object' &&
                                !Array.isArray(valoresDependencia) &&
                                valoresDependencia[valorPrincipal] &&
                                valorDependencia &&
                                !valoresDependencia[valorPrincipal].includes(valorDependencia)
                            ) {
                                mensagensErro.push(
                                    `Linha ${index + 1}: O campo "${nomeDependencia}" deve ser um dos valores: "${valoresDependencia[valorPrincipal].join('", "')}" quando "${formatarNomeCampo(campoPrincipal)}" é "${valorPrincipal}".`
                                );
                            }

                            if (
                                Array.isArray(valoresDependencia) &&
                                valorDependencia &&
                                !valoresDependencia.includes(valorDependencia)
                            ) {
                                mensagensErro.push(
                                    `Linha ${index + 1}: O campo "${nomeDependencia}" deve ser um dos valores: "${valoresDependencia.join('", "')}" quando "${formatarNomeCampo(campoPrincipal)}" é "${valorPrincipal}".`
                                );
                            }
                        }

                        // Verifica se todos os valores obrigatórios foram preenchidos
                        if (
                            obrigatorioTodos &&
                            Array.isArray(valoresDependencia) &&
                            valoresVerificados[chaveVerificacao]
                        ) {
                            if (valoresVerificados[chaveVerificacao].has(valorDependencia)) {
                                valoresVerificados[chaveVerificacao].delete(valorDependencia);
                            }
                        }

                        // Validação recursiva de sub-dependências
                        if (subDependencias && subDependencias.length > 0) {
                            validarDependencias(linha, subDependencias, index, campoDependente, valorDependencia);
                        }
                    });
                };


                // Função para validar condições baseadas nas regras
                const validarCondicional = (linha, condicoes, index, qtdDeLinhas) => {
                    condicoes.forEach((condicao) => {
                        const { campo, valoresAceitos, obrigatorio, dependencias, obrigatorioTodos } = condicao;
                        const valorCampo = linha[campo]; // Valor do campo atual
                        const nomeCampo = formatarNomeCampo(campo); // Nome formatado do campo

                        // Verifica se o campo é obrigatório e está vazio
                        if (obrigatorio && (!valorCampo || valorCampo.trim() === '')) {
                            mensagensErro.push(`Linha ${index + 1}: O campo "${nomeCampo}" é obrigatório.`);
                        }

                        if (condicao.validarArquivo && condicao.extensoes) {
                            if (typeof valorCampo === 'string' && valorCampo.includes('.')) {
                                const extensao = valorCampo.split('.').pop().toLowerCase();
                                const extensoesAceitas = condicao.extensoes.map(e => e.toLowerCase());

                                if (!extensoesAceitas.includes(extensao)) {
                                    mensagensErro.push(
                                        `Linha ${index + 1}: O campo "${nomeCampo}" deve ser um arquivo com extensão: "${extensoesAceitas.join('", "')}".`
                                    );
                                }
                            }
                        } else {
                            if (Array.isArray(valoresAceitos) && valorCampo && !valoresAceitos.includes(valorCampo)) {
                                mensagensErro.push(`
                        Linha ${index + 1}: O campo <strong>"${nomeCampo}"</strong> deve ser um dos valores: 
                        <ul style="margin: 5px 0 5px 20px; padding-left: 30px;">
                            ${valoresAceitos.map(valor => `<li>${valor}</li>`).join('')}
                        </ul>
                    `);
                            }
                        }


                        // Valida dependências se o campo tiver um valor
                        if (dependencias && valorCampo) {
                            validarDependencias(linha, dependencias, index, campo, valorCampo);
                        }

                        // Verifica se todos os valores aceitos estão presentes na primeira linha
                        if (obrigatorioTodos && index == (qtdDeLinhas - 1)) {
                            const valoresEncontrados = new Set(array.map(item => item[campo]));
                            const valoresFaltando = valoresAceitos.filter(valor => !valoresEncontrados.has(valor));

                            if (valoresFaltando.length > 0) {
                                mensagensErro.push(`
                        É necessário que na tabela contenha no campo <strong>${formatarNomeCampo(campo)}</strong> os seguintes valores:
                        <ul style="margin: 5px 0 5px 20px; padding-left: 30px;">
                            ${valoresFaltando.map(valor => `<li>${valor}</li>`).join('')}
                        </ul>
                    `);
                            }
                        }
                    });
                };

                // Itera sobre cada linha do array de dados para validar cada uma
                array.forEach((linha, index) => {
                    validarCondicional(linha, regras, index, array.length);
                });

                // Verifica se há valores obrigatórios que não foram preenchidos após a validação
                for (const [chave, valoresRestantes] of Object.entries(valoresVerificados)) {
                    const [campoPrincipal, valorPrincipal, campoDependente] = chave.split('-');
                    const nomeCampoPrincipal = formatarNomeCampo(campoPrincipal);
                    const nomeCampoDependente = formatarNomeCampo(campoDependente);

                    let obrigatorioTodos;

                    const regraCorrespondente = regras.find(
                        (regra) =>
                            regra.campo === campoPrincipal &&
                            regra.dependencias?.some(
                                (dep) => {
                                    obrigatorioTodos = dep.obrigatorioTodos;
                                    dep.campo === campoDependente &&
                                        (dep.obrigatorioTodos || typeof dep.valoresAceitos === 'string');
                                }
                            )
                    );

                    if (valoresRestantes.size > 0 && (!regraCorrespondente || !regraCorrespondente.obrigatorioTodos) && obrigatorioTodos) {
                        mensagensErro.push(
                            `Para o valor "${valorPrincipal}" no campo "${nomeCampoPrincipal}", os seguintes valores no campo "${nomeCampoDependente}" são obrigatórios: "${[
                                ...valoresRestantes,
                            ].join('", "')}".`
                        );
                    }
                }

                const criarMensagemHTML = (idDaReferencia, mensagensErro) => {
                    // Encontrar o elemento pelo ID
                    const elemento = document.getElementById(idDaReferencia);
                    const containerId = `container-${idDaReferencia}`;

                    // Remover o contêiner existente, se houver
                    const containerExistente = document.getElementById(containerId);
                    if (containerExistente) {
                        containerExistente.remove();
                    }

                    // Se não houver mensagens, não cria o contêiner
                    if (!mensagensErro || mensagensErro.length === 0) {
                        console.log('Nenhuma mensagem para exibir.');
                        return;
                    }

                    if (elemento) {
                        // Criar um contêiner para agrupar todas as mensagens
                        const container = document.createElement('div');
                        container.id = containerId; // Atribui um ID ao contêiner para futuras verificações
                        container.style.border = '2px solid red'; // Borda vermelha ao redor do agrupador
                        container.style.padding = '10px'; // Espaçamento interno
                        container.style.borderRadius = '5px'; // Bordas arredondadas
                        container.style.marginTop = '30px'; // Espaço acima do agrupador
                        container.style.backgroundColor = '#ffe6e6'; // Fundo levemente avermelhado
                        container.style.maxWidth = '1300px'; // Largura máxima do contêiner
                        container.style.wordWrap = 'break-word'; // Quebra de palavras
                        container.style.marginLeft = 'auto'; // Margem automática para centralizar horizontalmente
                        container.style.marginRight = 'auto'; // Margem automática para centralizar horizontalmente
                        container.style.textAlign = 'center'; // Centralizar o texto dentro do contêiner

                        // Iterar sobre as mensagens e adicionar ao contêiner
                        mensagensErro.forEach((mensagem, index) => {
                            // Criar um novo elemento de parágrafo para cada mensagem
                            const novoParagrafo = document.createElement('p');
                            novoParagrafo.style.textAlign = 'justify'; // Texto justificado
                            novoParagrafo.style.color = 'red'; // Texto em vermelho
                            novoParagrafo.style.fontWeight = 'bold'; // Texto em negrito
                            novoParagrafo.style.margin = '5px 0'; // Espaço entre as mensagens
                            novoParagrafo.innerHTML = mensagem;

                            // Atribuir um ID único ao parágrafo, se necessário
                            novoParagrafo.id = `textoRico${idDaReferencia}-${index + 1}`;

                            // Adicionar o parágrafo ao contêiner
                            container.appendChild(novoParagrafo);
                        });

                        // Inserir o contêiner após o elemento encontrado
                        elemento.insertAdjacentElement('afterend', container);
                    } else {
                        console.error(`Elemento com ID "${idDaReferencia}" não encontrado.`);
                    }
                }

                criarMensagemHTML(idDaTabela, mensagensErro)

                return mensagensErro.length > 0 ? false : true
            },
            ocultarTabelaPeloNome: (nomeTabela) => {
                var tables = document.querySelectorAll('table');
                tables.forEach(function (table) {
                    var caption = table.querySelector('caption');
                    if (caption && caption.textContent.trim() === nomeTabela) {
                        // Ocultar a tabela pai
                        table.style.display = 'none';
                    }
                });
            },
            mostrarTabelaPeloNome: (nomeTabela) => {
                var tables = document.querySelectorAll('table');
                tables.forEach(function (table) {
                    var caption = table.querySelector('caption');
                    if (caption && caption.textContent.trim() === nomeTabela) {
                        // Ocultar a tabela pai
                        table.style.display = '';
                    }
                });
            },
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

                for (let i = 0; i < tables.length; i++) {
                    if (tables[i].caption && tables[i].caption.textContent.trim() === nomeTabela) {
                        let colunasHTML = tables[i].querySelectorAll('tr[class="header"]');

                        const colunas = colunasHTML[0].querySelectorAll('[column-name]')

                        const nomeColunas = []

                        for (let coluna of colunas) {
                            nomeColunas.push(coluna.getAttribute('column-name'))
                        }

                        if (nomeColunas.length === 0) {
                            console.error(`Colunas não encontradas na tabela ${nomeTabela}`);
                            return dados;
                        }

                        let linhas = tables[i].querySelectorAll('tr:not([class="header"])');

                        for (let linha of linhas) {
                            let objetoLinha = {};
                            for (let nomeColuna of nomeColunas) {
                                let coluna = linha.querySelector('td[column-name="' + nomeColuna + '"]');
                                let input = coluna.querySelector('input');
                                let select = coluna.querySelector('select');
                                let textarea = coluna.querySelector('textarea');
                                if (input) {
                                    nomeColuna = nomeColuna.replace("col", "");
                                    objetoLinha[`inp${nomeColuna}`] = input.value;
                                } else if (select) {
                                    nomeColuna = nomeColuna.replace("col", "");
                                    objetoLinha[`inp${nomeColuna}`] = select.value;
                                } else if (textarea) {
                                    nomeColuna = nomeColuna.replace("col", "");
                                    objetoLinha[`inp${nomeColuna}`] = textarea.value;
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

                for (let i = 0; i < tables.length; i++) {
                    if (tables[i].caption && tables[i].caption.textContent.trim() === nomeTabela) {
                        let colunas = tables[i].querySelectorAll('td[column-name="' + `col${idColuna}` + '"]');
                        if (colunas.length === 0) {
                            console.error(`Coluna ${idColuna} não encontrada na tabela ${nomeTabela}`);
                            return dados;
                        }
                        colunas.forEach(function (coluna) {
                            let input = coluna.querySelector('input');
                            let select = coluna.querySelector('select');
                            let textarea = coluna.querySelector('textarea');
                            if (input) {
                                dados.push(input.value);
                            } else if (select) {
                                dados.push(select.value);
                            } else if (textarea) {
                                dados.push(textarea.value);
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
            adicionarValorNoSelect: (id, arrayDeValores) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {

                    const selectArray = Array.from(select)

                    for (let valor of arrayDeValores) {

                        const optionJaExiste = selectArray.find(select => select.value === valor)

                        if (!optionJaExiste) {
                            const novoOption = document.createElement('option')

                            novoOption.value = valor
                            novoOption.text = valor

                            select.add(novoOption)
                        }
                    }
                }
            },
            mostrarCampos: (id, valoresVisiveis) => {
                //exemplo (inpCidades, ["Valor A", "Valor B"])
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    var opcoes = select.querySelectorAll("option");

                    for (const opcao of opcoes) {
                        if (valoresVisiveis.includes(opcao.value)) {
                            opcao.style.display = ""; // Remove o estilo display: none
                        } else {
                            opcao.style.display = "none";
                        }
                    }
                }
            },
            // Função para mostrar apenas o valor especificado no campo de seleção
            mostrarApenasUmValor: (id, valor) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    let options = select.getElementsByTagName("option");

                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value == valor) {
                            options[i].style.display = "block"; // Exibe o valor se for igual ao especificado
                        } else {
                            options[i].style.display = "none"; // Oculta os demais valores
                        }
                    }
                }
            },

            // Função para mostrar todos os valores no campo de seleção
            mostrarTodosValores: (id) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    let options = select.querySelectorAll('option');

                    for (let i = 0; i < options.length; i++) {
                        options[i].style.display = "inline"; // Exibe todos os valores
                    }
                }
            },

            // Função para ocultar todos os valores no campo de seleção e limpar a seleção
            ocultarTodosValores: (id) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    let options = select.querySelectorAll('option');

                    for (let i = 0; i < options.length; i++) {
                        options[i].style.display = "none"; // Oculta todos os valores
                    }

                    select.value = ""; // Limpa a seleção
                }
            },

            // Função para exibir apenas os valores presentes no array no campo de seleção
            exibirValoresDoArray: (id, arrayDeValores) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    for (let i = 0; i < select.options.length; i++) {
                        select.options[i].style.display = "none"; // Oculta todos os valores
                    }

                    for (valor of arrayDeValores) {
                        const option = select.querySelector(`option[value="${valor}"]`)

                        if (option) option.style.display = "inline"; // Exibe os valores presentes no array
                    }

                    if (!arrayDeValores.includes(select.value)) {
                        select.value = ''
                    }
                }
            },

            // Função para ocultar os valores que contêm no array no campo de seleção
            ocultarValoresDoArray: (id, arrayDeValores) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {

                    for (valor of arrayDeValores) {
                        const option = select.querySelector(`option[value="${valor}"]`)

                        if (option) option.style.display = "none"; // Oculta os valores presentes no array
                    }
                }
            },

            // Função para excluir todos os valores no campo de seleção
            excluirTodosValores: (id) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    let options = select.querySelectorAll('option');

                    for (let i = 0; i < options.length; i++) {
                        select.remove(0); // Remove todos os valores
                    }
                }
            },

            // Função para excluir os valores que contêm no array no campo de seleção
            excluirValoresNoArray: (id, arrayDeValores) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    for (valor of arrayDeValores) {
                        const option = select.querySelector(`option[value="${valor}"]`)

                        if (option) option.remove(0); // Remove os valores presentes no array
                    }
                }
            },

            // Função para mostrar apenas os valores que contêm o texto especificado no campo de seleção
            mostrarApenasValoresQueContemUmTexto: (id, texto) => {
                let selectsElement = document.querySelectorAll(`[id = '${id}']`)

                for (let select of selectsElement) {
                    const valoresOptions = []
                    let options = select.querySelectorAll('option');

                    for (let i = 0; i < options.length; i++) {
                        if (!options[i].text.includes(texto)) {
                            options[i].style.display = "none"; // Oculta os valores que não contêm o texto especificado
                        } else {
                            valoresOptions.push(options[i].value);
                        }
                    }

                    if (!valoresOptions.includes(select.value)) {
                        select.value = ''
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

            documento = documento.replace(/[^a-zA-Z0-9]/g, '')

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
    },
    regras: {
        proibirSubstituicao: () => {
            const substituindo = document.getElementById("userIsSubstituing")?.value

            if (substituindo === "S") {
                document.querySelectorAll(".container-task").forEach(el => {
                    let message = document.createElement("p");
                    message.textContent = "Esse processo não pode ser aberto por pessoas definidas como substitutas em ausência temporária!";

                    // Estilos da mensagem
                    message.style.color = "red"; // Cor vermelha para destacar
                    message.style.fontWeight = "bold"; // Negrito
                    message.style.fontSize = "24px"; // Aumenta o tamanho da fonte
                    message.style.fontFamily = "Arial, sans-serif"; // Muda a fonte
                    message.style.textAlign = "center"; // Centraliza o texto
                    message.style.position = "absolute"; // Posiciona de forma absoluta
                    message.style.top = "50%"; // Centraliza verticalmente
                    message.style.left = "50%"; // Centraliza horizontalmente
                    message.style.transform = "translate(-50%, -50%)"; // Ajusta para garantir que o texto esteja bem no centro
                    message.style.zIndex = "9999"; // Coloca a mensagem acima de outros elementos

                    el.style.display = "none"; // Esconde o elemento original
                    el.parentNode.insertBefore(message, el); // Insere a mensagem no lugar
                });
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        SicoobZeev.ferramentasHTML.utils.AddlinkParaBaixarTodosOsDocumentos();
        SicoobZeev.ferramentasHTML.utils.ClicarNoBotaoPesquisarDoInputPesquisarPreencher();
        SicoobZeev.ferramentasHTML.utils.createTeamsLink();
        SicoobZeev.ferramentasHTML.utils.limitarTextArea(3000);
    }, 200);
});

const prompts = {
    irpfDadosPessoais: `
            Você é um assistente especializado em extração e estruturação de dados de documentos fiscais.  
            Dado um texto extraído via OCR de um documento IRPF, sua tarefa é estruturar as informações no seguinte formato JSON:

            {
                "nome_completo": "Nome do contribuinte",
                "cpf": "XXX.XXX.XXX-XX",
                "dependentes": 2,
                "estado_civil": "estado civil",
                "profissao": "profissão",
                "tipo_endereco": "Residencial",
                "cpf_conjuge": "XXX.XXX.XXX-XX",
                "cep": "12345-678",
                "logradouro": "Rua Exemplo, 123",
                "tipo_logradouro": "Rua",
                "numero_casa": "123",
                "complemento": "Apto 101",
                "bairro": "Centro",
                "uf": "SP",
                "cidade": "São Paulo"
            }
            Obs. Não traga nenhum texto ou caracter além do objeto JSON.
            Regras de Extração:
            - Casas Decimais: Nenhum valor pode ser arredondado. Sempre exibir com duas casas decimais.
            Formatação e Validação:
                - Números sempre no formato decimal com duas casas (exemplo: 12345.67).
                - Organização estruturada nos blocos bens, rendimentos e dados_pessoais.
                - Campos ausentes devem ser preenchidos somente e nada alem de:
                  - "" para strings (ex.: "cidade": "").
                  - 0.00 para valores numéricos.
                - Nunca deve ser retornado null
                - estado_civil deve pode ser observado no campo possui conjuge ou companheira no OCR.
                - logradouro é somente o nome da rua, avenida, etc sem número.
                - o nome da cidade dever ser formatado da seguinte forma, somente a primeira letra de casa palavra maiuscula, exeto preposições como da, do de.

            Interfaces de Validação:
    
                interface DadosPessoais {
                    nome_completo: string,
                    cpf: string,
                    dependentes: number;
                    estado_civil: 
                        | "CASADO(A)"
                        | "DIVORCIADO(A)"
                        | "SEPARADO(A)/DESQUITADO(A)"
                        | "SOLTEIRO(A)"
                        | "UNIÃO ESTÁVEL"
                        | "VIÚVO(A)";
                    cpf_conjuge: string;
                    profissao: string;
                    tipo_endereco: 
                        | "RESIDENCIAL" 
                    cep: string;
                    logradouro: string;
                    tipo_logradouro:
                        | "RUA"
                        | "AVENIDA"
                        | "CHÁCARA"
                        | "COLÔNIA"
                        | "CONDOMÍNIO"
                        | "DISTRITO"
                        | "ESTRADA"
                        | "FAZENDA"
                        | "OUTRO"
                        | "PÁTIO"
                        | "PRAÇA"
                        | "QUADRA"
                        | "RECANTO"
                        | "RESIDENCIAL"
                        | "RODOVIA"
                        | "RUA"
                        | "SETOR"
                        | "SÍTIO"
                        | "TRAVESSA"
                        | "VILA";
                    numero_casa: string;
                    complemento: string | "-";
                    bairro: string;
                    uf: string;
                    cidade: string;
                }

            Certifique-se de seguir todas essas regras com precisão.
    `,
    irpfRendimentos: {
        promptExtracao:`
            Você receberá um conteúdo bruto extraído por OCR de um informe de rendimentos.
            Sua tarefa é extrair e estruturar as informações no formato JSON, de forma limpa, objetiva e sem redundâncias.

            Para cada rendimento encontrado, crie um único objeto dentro do array "rendimentos".
            Use apenas os campos que estiverem presentes no texto. Se um campo não for encontrado, ele **não deve aparecer** no JSON.
            Não inclua chaves vazias. Não repita a estrutura completa se só houver, por exemplo, um valor total anual.
            Código do rendimento (por exemplo: '06. Rendimentos de aplicações financeiras') – quando houver, inclua uma chave "codigo" no JSON

            Exemplo mínimo:
            {
                "rendimentos": [
                    {
                        "descricao": "Aluguéis",
                        "total": "25043.11"
                    }
                ]
            }

            Se o bloco for completo, preencha com as informações relevantes. Exemplo mais detalhado:

            {
                "rendimentos": [
                    {
                        "codigo": "06",
                        "tipo_rendimento": "RENDIMENTOS TRIBUTÁVEIS RECEBIDOS DE PESSOA JURÍDICA PELO TITULAR",
                        "descricao": "Rendimentos de aplicações financeiras",
                        "nome_fonte_pagadora": "Empresa XYZ S.A.",
                        "cnpj_fonte_pagadora": "00.000.000/0000-00",
                        "beneficiario": "João da Silva",
                        "cpf": "000.000.000-00",
                        "rendimentos_recebidos_pj": "12345.67"
                    }
                ]
            }

            Regras:
            - Normalize os valores (use ponto como separador decimal)
            - Remova R$, espaços extras, quebras de linha e símbolos indesejados
            - Não inclua campos vazios nem chaves irrelevantes
            - Para rendimentos mensais agrupados por tipo (como "Aluguéis", "Outros", "Exterior"), use apenas o total anual e crie um objeto com "descricao" e "total"
        `,
        promptEstruturacao: `
            Objetivo:
            Extraia todos os rendimentos a partir de um array de objetos (linhas do OCR) e retorne um JSON estruturado como array de objetos, seguindo a interface Renda.

            Interface Renda:
            {
                tipo_renda: "APOSENTADORIA" | "SALÁRIO" | "PRO-LABORE" | "OUTROS" | "APLICAÇÃO",
                renda_bruta_mensal: number,
                descricao: string,
                renda_fixa_variavel: "Renda variável" | "Renda fixa"
            }

            Instruções:
            - A entrada é um array de objetos (linhas extraídas do OCR).
            - Sempre retorne um array (mesmo que vazio).
            - O retorno deve conter apenas o JSON, sem nenhum texto extra.

            Identificação de rendimentos:

            1. RENDIMENTOS TRIBUTÁVEIS RECEBIDOS DE PESSOA JURÍDICA PELO TITULAR
            - Considere apenas rendimentos do CPF titular.
            - Ignore instituições financeiras (Sicoob, Bradesco, Itaú, Sicredi, Caixa, BB, PREV, COOP),
                exceto se houver 13º salário ou aplicações (LCA, LCI, CRA, CRI, poupança).
            - Se o CNPJ for da FRGS ou INSS → classifique como "APOSENTADORIA".
            - Se não for instituição financeira e não tiver 13º salário → classifique como "PRO-LABORE".

            2. RENDIMENTOS TRIBUTÁVEIS RECEBIDOS DE PESSOA FÍSICA E DO EXTERIOR PELO TITULAR
            - Busque rendimentos de: aluguéis, trabalho não assalariado, outros e exterior.
            - Use o valor total anual (somatório dos meses) e divida por 12 para obter "renda_bruta_mensal".

            3. RENDIMENTOS ISENTOS E NÃO TRIBUTÁVEIS
            - Inclua aplicações financeiras: LCA, LCI, CRA, CRI, poupança.
            - Também considere os seguintes rendimentos isentos, com base no código e descrição resumida:
                01. Bolsas de estudo sem contraprestação
                02. Bolsas para médico-residente e Pronatec
                05 a 08. Ganhos de capital até limites definidos
                09. Lucros e dividendos
                10. Parcela isenta de aposentadoria de 65+
                11. Reforma/aposentadoria por moléstia grave
                12. Aplicações financeiras (LCA, LCI, CRA, CRI, poupança)
                13. Lucros de MEI ou Simples (exceto pró-labore, aluguel, serviços)
                18. Bonificação em ações
                20, 21. Ganhos em ações ou ouro até limite mensal
                23, 24. Transporte (90% carga, 40% passageiros)
                99. Outros rendimentos isentos

            Regras de extração:
            - Valores devem ter sempre duas casas decimais, sem arredondar.
            - Divida o valor anual por 12 para "renda_bruta_mensal".
            - "descricao" deve conter o nome da fonte pagadora.
            - Nunca use null.
            - Preencha campos ausentes com:
            - "" (string)
            - 0.00 (número)

            Classificação de "renda_fixa_variavel":
            - Renda fixa: SALÁRIO, PRO-LABORE, APOSENTADORIA, BOLSAS DO GOVERNO, PENSÃO ALIMENTÍCIA, BUREAU EXTERNO.
            - Todos os demais tipos → "Renda variável".
        `
    },
    irpfBens:{
        promptExtracao:`
            Objetivo: A partir do conteúdo extraído por OCR da seção de Bens e Direitos de uma declaração do IRPF, retorne um JSON estruturado com as informações de cada bem identificado.
            Estrutura esperada para cada objeto:

            {
                "grupo": string,                        // Ex: "01 - Bens Imóveis"
                "codigo": string,                       // Ex: "11 - Apartamento"
                "discriminacao": string,               // Texto completo da descrição do bem
                "situacao_ano_anterior": number,       // Valor no ano anterior
                "situacao_ano_atual": number,          // Valor no ano atual
                "titularidade": string,                // "Titular" ou "Dependente"
                
                // Informações adicionais para imóveis (caso identificadas na descrição)
                "logradouro": string,
                "numero": string,
                "bairro": string,
                "municipio": string,
                "uf": string,
                "data_aquisicao": string,              // Formato: "dd/mm/aaaa"
                "area_total": string                   // Ex: "72,5 m²" (como extraído)
            }

            Instruções:
            
            - Sempre retorne um array, mesmo que vazio.
            - Normalize os valores numéricos com ponto como separador decimal (ex: 123456.78).
            - Remova "R$" e outros símbolos monetários.
            - Se algum dado não estiver disponível, preencha com:
                - "" para strings
                - 0.00 para números
            - Para imóveis, tente extrair da discriminação dados como logradouro, número, bairro, município, UF, data de aquisição e área total.
            - "titularidade" deve ser identificado com base na expressão: "Bem pertencente ao titular" ou "ao dependente".

            Exemplo de saída:

            [
                {
                    "grupo": "01 - Bens Imóveis",
                    "codigo": "11 - Apartamento",
                    "discriminacao": "Apartamento situado na Rua Exemplo, nº 123, Bairro Centro, Município de Porto Alegre/RS, adquirido em 15/03/2020, com área total de 72,5 m².",
                    "situacao_ano_anterior": 250000.00,
                    "situacao_ano_atual": 260000.00,
                    "titularidade": "Titular",
                    "logradouro": "Rua Exemplo",
                    "numero": "123",
                    "bairro": "Centro",
                    "municipio": "Porto Alegre",
                    "uf": "RS",
                    "data_aquisicao": "15/03/2020",
                    "area_total": "72,5 m²"
                }
            ]
        `,
        promptEstruturacao:`
            Objetivo: analise informaçoes recebidas em um array de objetos e retorne um JSON (array de objetos do tipo Bem[]).
            interface Bem 
                tipo:  
                    | "IMÓVEL" 
                    | "MÓVEL";
                tipo_localizacao: 
                    | "RURAL" 
                    | "URBANO";
                tipo_uso:  
                    | "RURAL" 
                    | "COMERCIAL" 
                    | "INDUSTRIAL" 
                    | "RESIDENCIAL";
                tipo_bem: 
                    | "RURAL" 
                    | "LOJA" 
                    | "PREDIO" 
                    | "SALA" 
                    | "TERRENO" 
                    | "APARTAMENTO" 
                    | "CASA" 
                    | "VEÍCULO";
                valor_bem: number;
                area_total: number;
                unidade_medida:    
                    | "HECTARE"  
                    | "METRO QUADRADO" 
                    | "";
                uf: string
                municipio: string;
                descricao: string;

            Obs. Não traga nenhum texto ou caracter além do objeto JSON.

            Regras de Extração:
            - "descricao" deve ser resumido em no máximo 10 palavras
            - Se no ano corrente o valor do bem é zerado, não considere jamais.
            - Procure em todas as linhas do array, e encontre bens (Exemplo: imóveis rurais e urbanos, carros, motocicletas, caminhões, semoventes (animais manejo), embarcação, aeronave)
            - Não oculte nenhum bem, traga todos que estiverem no array.
            - Se não tiver certeza do valor de uma chave do json, traga o valor null
            - O campo "area_total" nunca pode ser zero.
            - Quando é um imóvel rural "area_total" será sempre "HECTARE", nunca "METRO QUADRADO"  .
            - Quando é um imóvel rural, o "tipo_bem", "tipo_uso" e "tipo_localizacao"  sempre será "RURAL".
            - Quando é um bem móvel (qualquer bem que pode ser transportado de um lugar para outro sem alterar sua essência) e não conseguir realizar classificação dele nos chaves do JSON, traga valor null
            - Nenhum valor pode ser arredondado. Sempre exibir com duas casas decimais.
            - "municipio" será sempre formatado com a primeira letra maiúscula exemplo "Tangará da Serra", nunca "tangará da serra" ou "tangará Da Serra"
            - Nunca deve ser retornado null
            - Campos ausentes devem ser preenchidos somente e nada alem de:
                - "" para strings (ex.: "cidade": "").
                - 0.00 para valores numéricos.
        `
    }
    ,
    documentoIdentificacao: `
        Você é um assistente altamente especializado em extração e estruturação de dados a partir de textos extraídos via OCR de documentos de identificação. Sua tarefa é identificar e estruturar as informações relevantes no formato JSON, garantindo precisão e conformidade com os padrões exigidos.

        Formato de Saída (JSON):
        {
            "nome_completo": "Nome do contribuinte",
            "cpf": "XXX.XXX.XXX-XX",
            "nome_pai": "Nome do pai",
            "nome_mae": "Nome da mãe",
            "tipo_documento_identificacao": "RG",
            "data_nascimento": "dd/mm/yyyy",
            "data_emissao": "dd/mm/yyyy",
            "data_validade": "dd/mm/yyyy",
            "orgao_expedidor": "SSP",
            "uf_expedidor": "SP",
            "numero_documento_identificacao": "123456",
            "sexo": "MASCULINO" ou "FEMININO"
        }
        
        Obs. Não traga nenhum texto ou caracter além do objeto JSON.
        
        Regras de Extração:
            - Se o documento for uma CNH:
            - O órgão expedidor deve ser "DETRAN".
            - O campo "numero_documento_identificacao" deve conter o número de registro.
            - As datas de emissão e validade devem ser extraídas corretamente.
            - Ignorar data de primeira habilitação

            - Campos ausentes:
            - Caso alguma informação não esteja presente, o valor deve ser uma string vazia, por exemplo: "uf_expedidor": "".

            - Filtragem de dados irrelevantes:
            - Extraia apenas informações essenciais, ignorando textos desnecessários.

            - Formatação correta:
            - O CPF deve estar no formato "XXX.XXX.XXX-XX".
            - Datas devem seguir o padrão "dd/mm/yyyy".
            - Valores numéricos devem ser formatados corretamente, sem separadores de milhar (exemplo: 12345.67 e não 12,345.67).

            - Inferência do campo "sexo":
            - Se o documento não possuir a informação explícita, determine o sexo com base no "nome_completo":
                - Se for um nome tipicamente masculino → "MASCULINO".
                - Se for um nome tipicamente feminino → "FEMININO".

        Validação de Tipos:
            Os dados extraídos devem seguir a seguinte estrutura:

            interface DadosPessoais {
                tipo_documento_identificacao:
                    | "CARTEIRA DE IDENTIDADE"
                    | "CARTEIRA DE IDENTIDADE MILITAR"
                    | "CARTEIRA DE IDENTIDADE PROFISSIONAL"
                    | "CARTEIRA DE TRABALHO E PREVIDÊNCIA SOCIAL - CTPS"
                    | "CARTEIRA NACIONAL DE HABILITAÇÃO CNH"
                    | "CERTIDÃO DE NASCIMENTO"
                    | "PASSAPORTE"
                    | "PROTOCOLO DE SOLICITAÇÃO DE RNE"
                    | "REGISTRO NACIONAL DE ESTRANGEIRO - RNE"
                    | "REGISTRO ÚNICO DE IDENTIDADE CIVIL RIC";
                nome_completo: string;
                cpf: string;
                nome_pai: string;
                nome_mae: string;
                data_nascimento: string;
                data_emissao: string;
                data_validade: string;
                orgao_expedidor: string;
                uf_expedidor: string;
                numero_documento_identificacao: string;
                sexo: "MASCULINO" | "FEMININO";
            }

        Certifique-se de seguir todas essas regras e garantir que os dados extraídos estejam corretos, consistentes e bem formatados.
    `
}

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
                        | "COMERCIAL" 
                        | "RESIDENCIAL" 
                        | "RURAL";
                    cep: string;
                    logradouro: string;
                    tipo_logradouro:
                        | "RUA"
                        | "AEROPORTO"
                        | "AVENIDA"
                        | "CAMPO"
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
    irpfRendimentos: `
    Objetivo: Retorne um JSON estruturado com todos os rendimentos citados no OCR.
    
    Dicas:
    - Cada rendimento, é estruturado conforme a interface Renda
    - Existirão vários rendimentos, logo o retorno será sempre um array de objetos, mesmo que não encontre nenhuma renda.
    - OCR é um objeto com um array de várias posições, cada posição é uma linha do documento extraído.
    - Os rendimentos estão listados na tabela que contém uma coluna chamada  "NOME DA FONTE PAGADORA", essa coluna pode aparecer em várias posições      


    interface Renda {
    tipo_renda: "APOSENTADORIA" | "SALÁRIO" | "PRO-LABORE" | "OUTROS" | "APLICAÇÕES FINANCEIRAS";
    renda_bruta_mensal: number;
    descricao: string;
    renda_fixa_variavel: "Renda variável" | "Renda fixa";
    }
    Obs. Não traga nenhum texto ou caracter além do objeto JSON.
    Regras de extração:
        - Apenas rendimentos do CPF titular devem ser considerados.
        - Instituições financeiras (ex.: Sicoob, Bradesco, Itaú, Sicredi, Caixa, BB, PREV, COOP) devem ser ignoradas, exceto se contiverem 13º salário.
        - Se o rendimento for proveniente de um CNPJ da FRGS ou INSS, a chave "tipo_renda" deverá ser "APOSENTADORIA".
        - Nenhum valor pode ser arredondado. Sempre exibir duas casas decimais.
        - Dividir o rendimento sempre por 12 para chegar no valor mensal e preecher a chave "renda_bruta_mensal"
        - O campo "descricao" deve conter o nome da fonte pagadora conforme extraído do OCR.
        - Campos ausentes devem ser preenchidos somente e nada alem de:
                  - "" para strings (ex.: "cidade": "").
                  - 0.00 para valores numéricos.

Classificação de tipo de renda:
- Se a renda for de um dos tipos abaixo, deve ser classificada como "Renda fixa":
  - SALÁRIO
  - PRO-LABORE
  - APOSENTADORIA
  - BOLSAS DO GOVERNO
  - PENSÃO ALIMENTÍCIA
  - BUREAU EXTERNO
- Caso contrário, será classificada como "Renda variável".
 `,
    irpfBens: `
 Objetivo: Extrair informações de bens do OCR do IRPF e retorno um JSON (array de objetos do tipo Bem[]).
     interface Bem {
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
            - Procure em todas as linhas do array, e encontre bens (Exemplo: imóveis rurais e urbanos, carros, motocicletas, caminhões, semoventes (animais manejo), embarcação, aeronave)
            - Não oculte nenhum bem, traga todos que estiverem no array.
            - Se não tiver certeza do valor de uma chave do json, traga o valor null
            - O campo "area_total" nunca pode ser zero.
            - Quando é um imóvel rural "area_total" será sempre "HECTARE", nunca "METRO QUADRADO"  .
            - Quando é um imóvel rural, o "tipo_bem", "tipo_uso" e "tipo_localizacao"  sempre será "RURAL".
            - Quando é um bem móvel (qualquer bem que pode ser transportado de um lugar para outro sem alterar sua essência) e não conseguir realizar classificação dele nos chaves do JSON, traga valor null
            - Nenhum valor pode ser arredondado. Sempre exibir com duas casas decimais.
            - "municipio" será sempre formatado com a primeira letra maiúscula exemplo "Tangará da Serra", nunca "tangará da serra" ou "tangará Da Serra"
            - Campos ausentes devem ser preenchidos somente e nada alem de:
                  - "" para strings (ex.: "cidade": "").
                  - 0.00 para valores numéricos.

    `,
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

console.info("Iniciando o script Sicoob Zeev");
const SicoobZeev = {
    validadores: {
        validarCPFCNPJ: function validarCPFCNPJ(documento) {
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

        validarCPF: function validarCPF(cpf) {
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

        validarCNPJ: function validarCNPJ(cnpj) {
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
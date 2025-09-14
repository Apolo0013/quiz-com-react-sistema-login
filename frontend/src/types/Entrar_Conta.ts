//type usado em:
// ---> O parametro que o backend receber pae
// -> frontend\src\componentes\entrar_conta\cadastrar.tsx
// -> frontend\src\componentes\entrar_conta\logar.tsx
export type typeNomeESenha = { nome: string, senha: string }

//type usado em:
// ---> O parametro que o backend receber pae
// -> frontend\src\componentes\entrar_conta\cadastrar.tsx
//usando na resposta cadastra
export type typeReturnErrorBackend = {
    sucesso: boolean
    error: 'nome_em_uso' | 'nenhum' | 'error_ao_registrar'
}

//type usado em:
// ---> O parametro que o backend receber pae
// -> frontend\src\componentes\entrar_conta\logar.tsx
//usando na resposta cadastra
export type typeReturnErrorBackendLogar = {
    sucesso: boolean,
    error: "user_nao_registrado" | 'nenhum'
}


//type usados em:
// -> frontend\src\componentes\entrar_conta\utils-entrar_conta.tsx
export type typeVerificarEntradas = {
    nome: string,
    senha: string,
    senhanovamente?: string,
    ElNome: HTMLInputElement,
    ElSenha: HTMLInputElement,
    ElSenhaNovamnete?: HTMLInputElement,
    ElError: HTMLDivElement
}
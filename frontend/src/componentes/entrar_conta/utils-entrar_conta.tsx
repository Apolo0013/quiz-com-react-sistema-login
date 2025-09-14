import { useNavigate } from 'react-router-dom'
import { type typeVerificarEntradas } from "../../types/Entrar_Conta"

export function VerificarEntradas(
    {
        nome,
        senha,
        senhanovamente,
        ElNome,
        ElSenha,
        ElSenhaNovamnete,
        ElError
    }: typeVerificarEntradas): boolean {
    
    //length dos valor
    const nomelen: number = nome.length
    const senhalen: number = senha.length
    const senhanovamentelen: number | undefined = senhanovamente?.length
    //se nome estive vazio
    if (nomelen === 0) {
        AddError({text: 'Nome obrigatório.', ElError: ElError})
        AddErrorInput(ElNome)
        return false
    }
    // se senha estive vazia
    if (senhalen === 0) {
        AddError({text: 'Senha obrigatória.', ElError: ElError})
        AddErrorInput(ElSenha)
        return false
    }  
    // se senha nomvente, estive vazia
    if (ElSenhaNovamnete && senhanovamentelen === 0) {
        AddError({text: 'Confirmação de senha obrigatória.', ElError: ElError})
        AddErrorInput(ElSenhaNovamnete)
        return false
    }
    // se senha e senha novamente sao iguais
    if (ElSenhaNovamnete && senha !== senhanovamente) {
        AddError({text: 'As senhas não coincidem.', ElError:  ElError})
        AddErrorInput(ElSenha)
        AddErrorInput(ElSenhaNovamnete)
        return false
    }
    // se nao estive error
    //limpando a div error pae.
    AddError({limpar: true})
    return true

}

//essa funcao vai se usada pra add alert error pae.
type typeparamAddError = {
    text?: string,
    ElError?: HTMLDivElement | null,
    limpar?: boolean
}
export function AddError({ text, ElError, limpar }: typeparamAddError): void {
    //antes de tudo, se limpar for true vamos limpar a div ElError
    if (ElError && limpar) {
        ElError.classList.remove('show-error-entradas')
        ElError.textContent = ''
    }
    //ele text e ElError, nao receber nada, retornamos ou seja quebramos o afuncao
    if (!text || !ElError) {return}
    ElError.textContent = text
    ElError.classList.add('show-error-entradas')
}

//funcao que vai add a class nos input, assim referenciadndo o mesmo
export function AddErrorInput(El: HTMLInputElement | null) {
    //verificando se o El nao é null, se for vamos quebrar a funcao.
    if (!El) {return}
    //Se essa class (warn-input) estive ja no Elemento, retorne.
    const listclassel: string[] = [...El.classList]
    if ( listclassel.length > 0 && listclassel.every(valor => valor === 'warn-input')) { return }
    console.log('Passou')
    El.classList.add('warn-input')
    //quando a animacao do warn-input retire a class.
    El.addEventListener('animationend', () => {El.classList.remove('warn-input')})
}

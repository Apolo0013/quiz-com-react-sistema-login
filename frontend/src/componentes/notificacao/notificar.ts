type typeFuncaoNotifica = {
    sucesso: ({ text, duracao }: TypeNotificaoFuncao) => void,
    error: ({text, duracao}: TypeNotificaoFuncao) => void
}

type TypeNotificaoFuncao = {
    text: string,
    duracao?: number
}

export const Notifica: typeFuncaoNotifica = {
    sucesso: () => {},
    error: () => {}
}
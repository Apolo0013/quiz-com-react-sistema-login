//type usados
// -: Usado para se referir so HTMLInputElement
// -> frontend\src\componentes\entrar_conta\logar.tsx

import type { RefObject } from "react"

// -> frontend\src\componentes\entrar_conta\cadastrar.tsx
export type elinput = HTMLInputElement

//type usados
// -: Usado para se referir so a um ref que guardar as dificuldades e temas
// ->frontend\src\componentes\quiz-componentes\inicio-quiz\selecionar_tema\selecionar_tema.tsx
// -> frontend\src\componentes\quiz-componentes\inicio-quiz\dificuldade\dificuldade.tsx
export type InfoOpcaoType = {
    tema: InfoOpcaoTypeTema
    dificuldade: InfoOpcaoTypeDificuldade
}
//
export type InfoOpcaoTypeTema = "Geografia" | "História" | "Ciências" | "Matemática" | "Cinema" | "Fisica" | "Quimica" | "Literatura" | "Tecnologia" | "Logica" | ''


export type InfoOpcaoTypeDificuldade = "facil" | "medio" | "dificil" | ''


export type TypeGetRefTemaEDificuldade = {
    RefGetInfo: RefObject<InfoOpcaoType>,
    RefConteiner: RefObject<HTMLDivElement | null>
}

//Retornos do Backend, quiz///////////////////////////////////////
//Alterntiva type, sera usado quanto para quiz normal e quiz math
export type QuizAlternativas = {
    a: string,
    b: string,
    c: string,
    d: string
}

//Type Objetivas
//Type para os quiz normal objetiva
export type ObjetivaQuizNormal = {
    pergunta: string,
    alternativas: QuizAlternativas,
    resposta_certa: string
}
//Type objetiva quiz math
type ObjetivaQuizMath = {
    pergunta: string,
    alternativas: QuizAlternativas,
    resposta_certa: string,
    formula: string,
    assunto: string
}

//Type descubrar nome. Quanto o quiz normal e math, vao usar o mesmo
export type Descubrar_PalavrasQuiz = {
    palavra: string,
    dica: string
}

//Retornos backend
//Retorno do backend para quiz normal
export type ReturnBackendQuizNormal = {
    objetiva: ObjetivaQuizNormal[],
    descubrar_Palavras: Descubrar_PalavrasQuiz[]
}

export type ReturnBackendQuizMath = {
    objetiva: ObjetivaQuizMath[],
    descubrar_PalavrasL: Descubrar_PalavrasQuiz[]
}
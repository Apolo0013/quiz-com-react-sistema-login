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
export type InfoOpcaoTypeTema = "Geografia" | "História" | "Ciências" | "Matemática" | "Cinema" | "Música" | "Esportes" | "Literatura" | "Tecnologia" | "Logica" | ''


export type InfoOpcaoTypeDificuldade = "facil" | "medio" | "dificil" | ''


export type TypeGetRefTemaEDificuldade = {
    RefGetInfo: RefObject<InfoOpcaoType>,
    RefConteiner: RefObject<HTMLDivElement | null>
}
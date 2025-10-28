import type { Dispatch, SetStateAction } from "react"

export type typeInfoEntrar = {
    Logado: boolean,
    Nome: string,
    Pontos: number
}

//Retorto do backend
//nome
//pontos
export type typeinforplayer = {
    nome: string,
    pontos: number
}

type typeContextSetInfoLogin = Dispatch<SetStateAction<typeInfoEntrar>>

export type typeContextGlobal = {
    info_entrar: typeInfoEntrar,
    SetInfoContext: typeContextSetInfoLogin
}


import type { Dispatch, SetStateAction } from "react"

export type typeInfoEntrar = {
    Logado: boolean,
    Nome: string
}

type typeContextSetInfoLogin = Dispatch<SetStateAction<typeInfoEntrar>>


export type typeContextGlobal = {
    info_entrar: typeInfoEntrar,
    SetInfoContext: typeContextSetInfoLogin
}



//Usada para Projeto rotas
import { useContext } from "react"
import { InfoContext } from "./context"
import type { typeContextGlobal } from "./types/ContextLogin"
import { Navigate } from "react-router-dom"

function ProtejerRota({ children }: { children: React.ReactNode }) {
    const { info_entrar } = useContext<typeContextGlobal | null>(InfoContext)!

    return info_entrar.Logado ? children : <Navigate to='/home/entrar/login' replace></Navigate>
}

export default ProtejerRota
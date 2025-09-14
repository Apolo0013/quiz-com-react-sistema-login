import './info_entrar_main.scss'
//componentes
import Info_Conectado from './info_conectado/info_conectado'
import Info_DesConectado from './info_desconectado/info_desconectado'
//react
import { useContext, useEffect, useState, type JSX } from 'react'
//context
import { InfoContext } from '../../../context'
//type
import { type typeInfoEntrar } from '../../../types/ContextLogin'

function Main_Info_Entrar() {
    const [StateComInfo, SetComInfo] = useState<JSX.Element>()
    //context
    const info = useContext(InfoContext)
    useEffect(() => {
        const info_entrar: typeInfoEntrar = info!.info_entrar
        if (info_entrar.Logado) {
            SetComInfo(<Info_Conectado nome_user={info_entrar.Nome}/>)
        }
        else {
            SetComInfo(<Info_DesConectado/>)
        }
    }, []) 

    return (
        <div className="wraper-conteiner-info-main">
            <div className="conteiner-info-main">
                {StateComInfo}
            </div>
        </div>
    )
}

export default Main_Info_Entrar
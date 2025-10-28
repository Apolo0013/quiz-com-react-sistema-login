// Componentes, com tem como papel, mostrar o menu do user.
// EX: se ele estive logado, vamos mostrar o nome, por enquanto apenas o nome.
// se nao estive logado, vamos mostrar o mesmo um botao, pra registrar, que vai redirencionar o mesmo para area de login.
import { useContext } from 'react'
import './info_conectado.scss'
import type { typeContextGlobal } from '../../../../types/ContextLogin'
import { InfoContext } from '../../../../context'

function Info_Conectado({ nome_user }: { nome_user: string }) {
    const { info_entrar } = useContext<typeContextGlobal | null>(InfoContext)!
    return (
        <div className="conteiner-info-conectado">
            <h3 className='NomeUser-info-conectado'>{info_entrar.Nome}</h3>
            <div className='info-conectado-points'>
                <p>Pontos</p>
                <p>{info_entrar.Pontos}</p>
            </div>
        </div>
    )
}

export default Info_Conectado
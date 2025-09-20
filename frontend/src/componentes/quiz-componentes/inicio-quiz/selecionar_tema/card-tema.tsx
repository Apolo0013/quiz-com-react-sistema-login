import './card-tema.scss'
//imagem
import Fds from '../../../../assets/imagens/info_entrar/fds.svg'
import { useRef, type MouseEvent } from 'react'
//types
type propsCardTema = {
    Nome_Tema: string
}

function Card_Tema({ Nome_Tema }: propsCardTema) {
    return (
        <div className="conteiner-card-tema">
            <div className='show-name-card-tema'>{Nome_Tema}</div>
            <img src={Fds} alt="" />
        </div>
    )
}

export default Card_Tema
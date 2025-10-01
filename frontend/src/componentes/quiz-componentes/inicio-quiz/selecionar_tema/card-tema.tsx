import './card-tema.scss'
import { type Dispatch, type SetStateAction, type MouseEvent } from 'react'
//types
import { type InfoOpcaoTypeTema } from '../../../../types/RefTypes'

type propsCardTema = {
    Nome_Tema: InfoOpcaoTypeTema,
    img_path: string,
    SetTema: Dispatch<SetStateAction<InfoOpcaoTypeTema>>
    EventClick: (e: MouseEvent<Element>) => void
}

function Card_Tema({ Nome_Tema, img_path, SetTema, EventClick}: propsCardTema) {
    return (
        <div className="conteiner-card-tema" onClick={(e) => {
            SetTema(Nome_Tema) //pegando o tema e salvando no ref que vai manda isso pro backend
            EventClick(e)
        }}>
            <div className='show-name-card-tema'>{Nome_Tema}</div>
            <img src={img_path} alt="" />
        </div>
    )
}

export default Card_Tema
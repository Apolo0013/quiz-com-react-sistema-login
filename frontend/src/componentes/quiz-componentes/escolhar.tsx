import './escolhar.scss'
//Componentes
import Head_Quiz_Inicio from './inicio-quiz-escolha/header-quiz-inicio/head_quiz-inicio'
import Selecionar_Tema from './inicio-quiz-escolha/selecionar_tema/selecionar_tema'
import Dificuldade_Quiz from './inicio-quiz-escolha/dificuldade/dificuldade'
//types
import { type InfoOpcaoType } from '../../types/RefTypes'
import { useEffect, useRef, useState, type RefObject } from 'react'

type PropsEscolharTemaEDificuldade = {
    RefInfoOpcaoGet: RefObject<InfoOpcaoType>,
    RefConteinerTema: RefObject<HTMLDivElement | null>,
    RefConteinerDificuldade: RefObject<HTMLDivElement | null>,
    Start: () => void
}

function EscolharTemaEDificuldade({ RefInfoOpcaoGet, RefConteinerTema, RefConteinerDificuldade, Start }: PropsEscolharTemaEDificuldade) {
    //
    const [InfoOpcao, SetInfoOpcao] = useState<InfoOpcaoType>({
        tema: '',
        dificuldade: ''
    })

    useEffect(() => {
        console.log(InfoOpcao)
        RefInfoOpcaoGet.current = InfoOpcao
        console.log(RefInfoOpcaoGet.current)
    }, [InfoOpcao])

    return (
        <div className="conteiner-main-escolhar">
            <Head_Quiz_Inicio/>
            <Selecionar_Tema GetInfo={SetInfoOpcao} RefConteiner={RefConteinerTema} />
            <Dificuldade_Quiz GetInfo={SetInfoOpcao} RefConteiner={RefConteinerDificuldade}/>
            <div className="conteiner-botao-comeca-quiz-main">
                <button className='Botao-Comeca-quiz-main' onClick={Start}>Começa</button>
            </div>
        </div>
    )
}

export default EscolharTemaEDificuldade
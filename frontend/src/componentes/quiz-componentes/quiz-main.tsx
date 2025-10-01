import './quiz-main.scss'
//componentes
import Main_Info_Entrar from '../entrar_conta/info_entrar_main/info_entrar_main'
import Head_Quiz_Inicio from './inicio-quiz/header-quiz-inicio/head_quiz-inicio'
import Selecionar_Tema from './inicio-quiz/selecionar_tema/selecionar_tema'
import Dificuldade_Quiz from './inicio-quiz/dificuldade/dificuldade'
import { useRef } from 'react'
//Types
import { type InfoOpcaoType, type InfoOpcaoTypeDificuldade, type InfoOpcaoTypeTema } from '../../types/RefTypes'
//utils ts
import { ScrollTarget } from '../../utils/utils'
//Notifica
import { Notifica } from '../notificacao/notificar'

function Quiz_Main() {
    function Start() {
        if (
            !RefInfoOpcao.current ||
            !RefConteinerDificuldade.current ||
            !RefConteinerTema.current
        ) { return }
        //Info das opcao
        const tema: InfoOpcaoTypeTema = RefInfoOpcao.current.tema
        const dificuldade: InfoOpcaoTypeDificuldade = RefInfoOpcao.current.dificuldade
        console.log(RefInfoOpcao.current)
        if (tema == '') {
            Notifica.error({text: "Escolha um Tema..."})
            ScrollTarget(RefConteinerTema.current)
        }
        else if (dificuldade == '') {
            Notifica.error({text: "Escolha uma Dificuldade"})
            ScrollTarget(RefConteinerDificuldade.current)
        }
        else {
            console.log('fds')
        }
    }

    //Ref que vai guardar as informacoes das opcao como dificuldade e Tema
    const RefInfoOpcao = useRef<InfoOpcaoType>({
        tema: '',
        dificuldade: ''
    })
    //Ref Conteines | Seleciona tema | Dificuldade |
    const RefConteinerTema = useRef<HTMLDivElement | null>(null)
    const RefConteinerDificuldade = useRef < HTMLDivElement | null>(null)
    return (
        <div className="conteiner-quiz-main">
            <Main_Info_Entrar />
            <Head_Quiz_Inicio/>
            <Selecionar_Tema RefGetInfo={RefInfoOpcao} RefConteiner={RefConteinerTema} />
            <Dificuldade_Quiz RefGetInfo={RefInfoOpcao} RefConteiner={RefConteinerDificuldade}/>
            <div className="conteiner-botao-comeca-quiz-main">
                <button className='Botao-Comeca-quiz-main' onClick={Start}>Começa</button>
            </div>
        </div>
    )
}

export default Quiz_Main
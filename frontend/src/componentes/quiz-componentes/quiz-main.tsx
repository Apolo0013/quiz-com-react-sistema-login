import './quiz-main.scss'
//componentes
import Main_Info_Entrar from '../entrar_conta/info_entrar_main/info_entrar_main'
import Head_Quiz_Inicio from './inicio-quiz/header-quiz-inicio/head_quiz-inicio'
import Selecionar_Tema from './inicio-quiz/selecionar_tema/selecionar_tema'
import Dificuldade_Quiz from './inicio-quiz/dificuldade/dificuldade'
import { useEffect, useRef } from 'react'
//Types
import {
    type InfoOpcaoType,
    type InfoOpcaoTypeDificuldade,
    type InfoOpcaoTypeTema,
    type ReturnBackendQuizNormal,
    type ReturnBackendQuizMath
} from '../../types/RefTypes'
//utils ts
import { ScrollTarget } from '../../utils/utils'
//Notifica
import { Notifica } from '../notificacao/notificar'
import ObjetivaQuiz from './Jogar/objetiva'
import Handler_Quiz from './Jogar/handler'

function Quiz_Main() {
    async function GetQuizBackEnd(dados: InfoOpcaoType) {
        try {
            const request = await fetch('http://localhost:5239/Quiz/Pegar', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            })
            //Aqui teremos dois tipo de retorno. |
            //Quiz normal                        |
            //Quiz Math                          | 
            /////////////////////////////////////| 
            // Se o tema for matematica, fisica e quimica
            if (dados.tema == 'Fisica' || dados.tema == 'Matemática' || dados.tema == 'Quimica') {
                console.log('matematica')
                const resposta: ReturnBackendQuizMath = await request.json()
                console.log(resposta)
                return resposta
            }
            //Se o tema for os tema normais:
            else {
                const resposta: ReturnBackendQuizNormal = await request.json()
                return resposta
            }   
        }
        catch (error) {
            console.log(error)
        }
    }

    async function Start() {
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
            GetQuizBackEnd(RefInfoOpcao.current)
        }
    }

    //Ref que vai guardar as informacoes das opcao como dificuldade e Tema
    const RefInfoOpcao = useRef<InfoOpcaoType>({
        tema: 'Matemática',
        dificuldade: 'facil'
    })
    //Ref Conteines | Seleciona tema | Dificuldade |
    const RefConteinerTema = useRef<HTMLDivElement | null>(null)
    const RefConteinerDificuldade = useRef<HTMLDivElement | null>(null)
    //
    useEffect(async () => {
        console.log( await GetQuizBackEnd(RefInfoOpcao.current))
    }, [])
    return (
        <div className="conteiner-quiz-main">
            <Handler_Quiz/>
        </div>
    )
}

/*
<Main_Info_Entrar />
            <Head_Quiz_Inicio/>
            <Selecionar_Tema RefGetInfo={RefInfoOpcao} RefConteiner={RefConteinerTema} />
            <Dificuldade_Quiz RefGetInfo={RefInfoOpcao} RefConteiner={RefConteinerDificuldade}/>
            <div className="conteiner-botao-comeca-quiz-main">
                <button className='Botao-Comeca-quiz-main' onClick={Start}>Começa</button>
            </div>
*/

export default Quiz_Main
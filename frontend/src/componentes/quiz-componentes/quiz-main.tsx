import './quiz-main.scss'
//componentes
import Main_Info_Entrar from '../entrar_conta/info_entrar_main/info_entrar_main'
import EscolharTemaEDificuldade from './escolhar'
import Handler_Quiz from './Jogar/handler'
//
import { useEffect, useRef, useState, type JSX } from 'react'
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
import { useLocation } from 'react-router-dom'

function Quiz_Main() {
    async function GetQuizBackEnd(): Promise<ReturnBackendQuizMath | ReturnBackendQuizNormal | null> {
        //Dados
        const dados = RefInfoOpcao.current
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
                const resposta = await request.json() as ReturnBackendQuizMath
                return resposta
            }
            //Se o tema for os tema normais:
            else {
                const resposta = await request.json() as ReturnBackendQuizNormal
                return resposta
            }   
        }
        catch (error) {
            console.log(error)
            return null
        }
    }

    async function Start() {
        if (
            !RefInfoOpcao.current ||
            !RefConteinerDificuldade.current ||
            !RefConteinerTema.current
        ) { return }
        //Tema e Dificuldade selecionado
        const tema: InfoOpcaoTypeTema = RefInfoOpcao.current.tema
        const dificuldade: InfoOpcaoTypeDificuldade = RefInfoOpcao.current.dificuldade
        //Se tema estive vazio, ou seja nao foi selecionado
        if (tema == '') {
            Notifica.error({text: "Escolha um Tema..."})
            ScrollTarget(RefConteinerTema.current)
        }
        //Se a dificuldade estive vazio, ou seja nao foi selecionado
        else if (dificuldade == '') {
            Notifica.error({text: "Escolha uma Dificuldade"})
            ScrollTarget(RefConteinerDificuldade.current)
        }
        else {
            //Se o tema for matematica, fisica ou quimica
            if (tema == 'Fisica' || tema == 'Quimica' || tema == 'Matemática') {
                //Pegando o quiz do backend
                const Conteudo = await GetQuizBackEnd() as ReturnBackendQuizMath
                //Caso tenha dado error, ele vai retorna nada :)
                if (!Conteudo) return 
                SetConteiner(<Handler_Quiz
                    Tema={tema}
                    Tipo="math"
                    DateQuizMath={Conteudo}
                />)
            }
            else {
                const Conteudo = await GetQuizBackEnd() as ReturnBackendQuizNormal
                if (!Conteudo) return
                SetConteiner(
                    <Handler_Quiz
                        Tema={tema}
                        Tipo='normal'
                        DateQuizNormal={Conteudo}
                    />
                )
            }
        }
    }

    //Ref que vai guardar as informacoes das opcao como dificuldade e Tema
    const RefInfoOpcao = useRef<InfoOpcaoType>({
        tema: '',
        dificuldade: ''
    })
    //Ref Conteines | Seleciona tema | Dificuldade |
    const RefConteinerTema = useRef<HTMLDivElement | null>(null)
    const RefConteinerDificuldade = useRef<HTMLDivElement | null>(null)
    //State ondem vai ele vai controlar os conteiner dentro do conteiner-quiz-main
    const [StateConteiners, SetConteiner] = useState<JSX.Element  | null>(null)
    //location(rota)
    const location = useLocation()
    useEffect(() => {
        SetConteiner(<EscolharTemaEDificuldade
            RefInfoOpcaoGet={RefInfoOpcao}
            RefConteinerTema={RefConteinerTema}
            RefConteinerDificuldade={RefConteinerDificuldade}
            Start={Start}
        />)        
    }, [])
    return (
        <div className="conteiner-quiz-main" key={location.key}>
            <Main_Info_Entrar/>
            {StateConteiners}
        </div>
    )
}

/*

*/

export default Quiz_Main
//Handler: ele vai controlar os componentes objetiva e descubrar_palavra
import './handler.scss'
//componentes
import ObjetivaQuiz from './objetiva/objetiva'
//Type
import {
    type ReturnBackendQuizNormal,
    type ObjetivaQuizNormal,
    type ObjetivaQuizMath,
    type Descubrar_PalavrasQuiz,
    type InfoOpcaoTypeTema,
    type ReturnBackendQuizMath
} from '../../../types/RefTypes'
import { useEffect, useRef, useState, type Dispatch, type JSX, type SetStateAction } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'

//Utils
import { randint } from '../../../utils/utils'
import Descubrar_PalavraQuiz from './descubrar_palavra/descubrar_palavra'
import Carregando_Tela_Entrar from '../../entrar_conta/carregando-tela'
import EscolharTemaEDificuldade from '../escolhar'

//type props
type PropsHandlerQuiz = {
    Tema: InfoOpcaoTypeTema
    Tipo: 'normal' | 'math',
    //Uns do dois serao usada.
    //Se o usuario que um tema normal:
    DateQuizNormal?: ReturnBackendQuizNormal,
    //Se o usuario que um tema matematico:
    DateQuizMath?: ReturnBackendQuizMath,
}


function Handler_Quiz({Tipo, DateQuizMath, DateQuizNormal}: PropsHandlerQuiz) {
    //Desativar e Ativar conteiner handler.
    //Essa funcao sera usada pra simular uma troca de conteiner. 
    const desativarconteiner = () => RefConteinerHandler.current!.classList.add('conteiner-disabled') 
    const ativarconteiner = () => RefConteinerHandler.current!.classList.remove('conteiner-disabled')
    //Funcao responsavel por passa de conteiner quiz
    function StartQuiz() {
        //Essa funcao é a Responsavel por troca de quiz. quantos quiz objetiva e descubrar_palavra
        //Sorteando uma
        const target = ['objetiva', 'descubrar_palavra'][randint(0, 1)] as 'objetiva' | 'descubrar_palavra'
        desativarconteiner()
        //Esperando um minuto pra troca.
        //Porque: O tempo que conteiner da quiz objetiva, sobe pra cima, e nois troca la memo.
        setTimeout(() => {
            //ativando conteiner
            ativarconteiner()
            if (target == 'objetiva' && !RefIndexObjetivaEnd.current) {
                //Aqui temos dois caminhos, quiz normal ou math
                if (Tipo == 'math') {
                    //Confiar nao é null
                    //Provalmente ele vai nunca vai retorna aqui.
                    if (!DateQuizMath) return
                    //
                    const info: ObjetivaQuizMath = DateQuizMath.objetiva[RefIndexObjetiva.current]
                    //Setando o conteiner
                    SetQuiz(<ObjetivaQuiz
                        key={RefKey.current}
                        pergunta={info.pergunta} //Pegunta do quiz
                        alternativas={info.alternativas} // Alternativas
                        resposta_certa={info.resposta_certa}//Resposta certa
                        assunto={info.assunto} // Assunto: x + y (adicao)
                        formula={info.formula} // Formula pro usuario usar
                        StartQuiz={StartQuiz} // CallBack
                    />)
                    //Verificando o indice atual do objetiva
                    RefIndexObjetiva.current++ //add +1 indice(proximo quiz)
                    //Caso ele tenha ultrapassado o numero indices que tem no objetiva:
                    if (DateQuizMath.objetiva.length == RefIndexObjetiva.current) {
                        //Opa, as pergunta da objetiva ja foram esgostados
                        RefIndexObjetivaEnd.current = true
                    }
                }
                else if (Tipo == 'normal') {
                    //Confiar nao é null pae.
                    if (!DateQuizNormal) return
                    //Pegando as informacoes
                    const info: ObjetivaQuizNormal = DateQuizNormal.objetiva[RefIndexObjetiva.current]
                    //Passando para o componente.
                    SetQuiz(
                        <ObjetivaQuiz
                        key={RefKey.current}
                        pergunta={info.pergunta} //Pergunta
                            alternativas={info.alternativas} // Alternativas
                        resposta_certa={info.resposta_certa}                        StartQuiz={StartQuiz} // CallBack
                        />)
                    //Agora vamos Verificar se passou do indices
                    RefIndexObjetiva.current++
                    if (DateQuizNormal.objetiva.length == RefIndexObjetiva.current) {
                        //Passou o maximo do indide do objetiva
                        RefIndexObjetivaEnd.current = true
                    }
                }
            }
            else if (target == 'descubrar_palavra' && !RefIndexDescubrarPalavraEnd.current) {
                //Aqui vamos pegar o quiz
                let info: Descubrar_PalavrasQuiz[] = []
                //Os quizzes de math e normal, sao a mesma coisa, so mudar la no objetiva aqui nao. Entao apenas so pegamos oq tive disponivels...
                //Se for quiz do tipo math, vamos pegar o quiz de descubrar palavra do DateQuizMath, pq o  DateQuizNormal nao existir.
                if (Tipo == 'math') info = DateQuizMath!.descubrar_palavra
                //Caso aocontrario, o tipo seja normal o DateQuizMath nao existir é null. Vamos pegar do DateQuizNormal.
                else if (Tipo == 'normal') info = DateQuizNormal!.descubrar_Palavras
                //Pegando o quiz em si.
                const {dica, palavra}: Descubrar_PalavrasQuiz = info[RefIndexDescubrarPalavra.current]
                //Chamando o componente...
                SetQuiz(<Descubrar_PalavraQuiz dica={dica} palavra={palavra} StartQuiz={StartQuiz}  key={RefKey.current}/>)
                //Se RefIndexDescubrar_Palavra estrapolou a quantidade de indices.
                console.log(info)
                RefIndexDescubrarPalavra.current++
                if (info.length == RefIndexDescubrarPalavra.current) {
                    //true: olha estrapolou acabou o
                    RefIndexDescubrarPalavraEnd.current = true
                }
            }
            //nao todos os quizes foram ja usado. chegamos ao fim pae.
            else if (RefIndexDescubrarPalavraEnd.current && RefIndexObjetivaEnd.current) {
                //Aqui os quizes acabou pae.
                desativarconteiner() // desativando tudo, pra evitar outra chamadas dee funcoes
                SetQuiz(<Carregando_Tela_Entrar diametro={30} text="Fim de Jogo. Aguarde" />)
                setTimeout(() => {
                    nv('/quiz/jogar', {replace: true})
                }, 1000)
            }
            //Add +1 na key
            RefKey.current++
        }, 1000)
        //
        
    }

    const [StateQuiz, SetQuiz] = useState<JSX.Element | null>(null)
    //Index Quiz, os indices das perguntas, nois saber que pergunta esta sendo usada.
    const RefIndexObjetiva = useRef<number>(0)
    const RefIndexDescubrarPalavra = useRef<number>(0)
    //Index Ultrapassou: essa variavel vai dizer acabou as pergunta?
    const RefIndexObjetivaEnd = useRef<boolean>(true)
    const RefIndexDescubrarPalavraEnd = useRef<boolean>(true)
    //Ref Conteiner Handler
    const RefConteinerHandler = useRef<HTMLDivElement | null>(null)
    //Navigate pae
    const nv: NavigateFunction = useNavigate()
    //Key para os componetes 
    const RefKey = useRef<number>(0)
    useEffect(() => {
        StartQuiz()
    }, [])
    return (
        <div className="conteiner-handler" ref={RefConteinerHandler}>
            {StateQuiz}
        </div>
    )
}

export default Handler_Quiz
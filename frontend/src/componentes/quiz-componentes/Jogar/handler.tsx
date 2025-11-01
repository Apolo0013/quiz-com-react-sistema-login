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
import { useEffect, useRef, useState, type MouseEvent, type JSX, useContext, } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'

//Utils
import { randint } from '../../../utils/utils'
import Descubrar_PalavraQuiz from './descubrar_palavra/descubrar_palavra'
import Carregando_Tela_Entrar from '../../entrar_conta/carregando-tela'
import Somar_Pontos from './somar_pontos'
import { InfoContext } from '../../../context'
import type { typeContextGlobal } from '../../../types/ContextLogin'

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


function Handler_Quiz({ Tipo, DateQuizMath, DateQuizNormal }: PropsHandlerQuiz) {
    //Desativar e Ativar conteiner handler.
    //Essa funcao sera usada pra simular uma troca de conteiner. 
    const desativarconteiner = () => RefConteinerHandler.current!.classList.add('conteiner-disabled')
    const ativarconteiner = () => RefConteinerHandler.current!.classList.remove('conteiner-disabled')
    // Add no final da partida
    //Funcao que add pontos pae.
    async function AddPontos() {
        //info para manda pro backend
        const pontos: number = RefSomarPontos.current
        const nome: string = info_entrar.Nome
        try {
            const request = await fetch("http://localhost:5239/Quiz/User/Pontos", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Pontos: pontos, Nome: nome }),
                credentials: 'include'
            })
            //Callback alguma pra exercuta depois de add os pontos para o usuario
            type ReturnErrorAddPontos = {
                error: "10 tentativas" | "nada", 
            }
            //Essa funcao retorna se deu certo ou nao add os pontos 
            const resposta: ReturnErrorAddPontos = await request.json()
            //Aqui o backend ele tenta 10 vezes add, ou seja ele tentou 10 coloca os pontos mas nao deu certo
            console.log(resposta)
            if (resposta.error == '10 tentativas') {
                console.log('10 tentativas feita')
            }
            //aqui ocorreu tudo bem, pontos add no banco de dados e fds
            else if (resposta.error == 'nada') {
                console.log(pontos)
                SetInfoContext(prev => ({
                    Logado: prev.Logado,
                    Nome: prev.Nome,
                    Pontos: prev.Pontos + pontos
                }))
            }
            //Navegando para tela inicial do quiz
            nv('/quiz/jogar?carregador=' + Date.now(), { replace: true })
        }
        catch (error) {
            console.log(error)
        }
    }


    //Funcao responsavel por passa de conteiner quiz
    function StartQuiz() {
        //Essa funcao é a Responsavel por troca de quiz. quantos quiz objetiva e descubrar_palavra
        //Sorteando uma
        //Antes de sortea, vamos verificar se acabou pro caras gld!
        //Como assim. Ta falando do que?
        //Quando aqui no target é sorteado um tipo de quiz no qual o mesmo ja foi, ou seja acabou os quizes dele pae
        //Sorteando normalmente
        let target = 
            ['objetiva', 'descubrar_palavra'][randint(0, 1)] as 'objetiva' | 'descubrar_palavra' | 'nada' // Blz, aqui vai cair uns do dois
        //Opa se target for obejtiva e os quiz dele estive acabado?
        //vamos manda ele fica com descubrar, mas se ele tambem estive acabado
        if (
            target == 'objetiva'
            &&
            RefIndexObjetivaEnd.current // se nao tive quizes sobrando
            &&
            !RefIndexDescubrarPalavraEnd.current // se estive quizes sobrando
        ) target = 'descubrar_palavra' 
        else if (
            target == 'descubrar_palavra'
            &&
            RefIndexDescubrarPalavraEnd.current // se nao tive quizes sobrando/cabou
            &&
            !RefIndexObjetivaEnd.current // se estive quizes sobrando
        ) { target = 'objetiva' }
        else if (RefIndexDescubrarPalavraEnd.current && RefIndexObjetivaEnd.current) target = 'nada'
    
        desativarconteiner()
        //Esperando um minuto pra troca.
        //Porque: O tempo que conteiner da quiz objetiva, sobe pra cima, e nois troca la memo.
        setTimeout(() => {
            //Add +1 na key
            RefKey.current++
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
                        SetSomarPontos={SetSomarPontos}
                        RefSomarPontos={RefSomarPontos}

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
                            resposta_certa={info.resposta_certa} StartQuiz={StartQuiz} // CallBack
                            SetSomarPontos={SetSomarPontos} // guardar para exibir
                            RefSomarPontos={RefSomarPontos} // aguardar para manda.
                            
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
                const { dica, palavra }: Descubrar_PalavrasQuiz = info[RefIndexDescubrarPalavra.current]
                //Chamando o componente...
                SetQuiz(<Descubrar_PalavraQuiz
                    dica={dica}
                    palavra={palavra}
                    StartQuiz={StartQuiz}
                    SetSomarPontos={SetSomarPontos}
                    RefSomarPontos={RefSomarPontos}
                    key={RefKey.current} />)
                //Se RefIndexDescubrar_Palavra estrapolou a quantidade de indices.
                RefIndexDescubrarPalavra.current++
                if (info.length == RefIndexDescubrarPalavra.current) {
                    //true: olha estrapolou acabou o
                    RefIndexDescubrarPalavraEnd.current = true
                }
            }
            //nao todos os quizes foram ja usado. chegamos ao fim pae.
            else if (target == 'nada') {
                //Aqui os quizes acabou pae.
                desativarconteiner() // desativando tudo, pra evitar outra chamadas dee funcoes
                SetQuiz(<Carregando_Tela_Entrar diametro={30} text="Fim de Jogo. Aguarde" />)
                //Add o pontos no backend
                AddPontos()
            }
        }, 1000)
    }

    const [StateQuiz, SetQuiz] = useState<JSX.Element | null>(null)
    //Index Quiz, os indices das perguntas, nois saber que pergunta esta sendo usada.
    const RefIndexObjetiva = useRef<number>(0)
    const RefIndexDescubrarPalavra = useRef<number>(0)
    //Index Ultrapassou: essa variavel vai dizer acabou as pergunta?
    const RefIndexObjetivaEnd = useRef<boolean>(false)
    const RefIndexDescubrarPalavraEnd = useRef<boolean>(false)
    //Ref Conteiner Handler
    const RefConteinerHandler = useRef<HTMLDivElement | null>(null)
    //Navigate pae
    const nv: NavigateFunction = useNavigate()
    //Ref e State que vai aguardar somar de pontos no total
    //Ref para guardar e nao reniciar
    const RefSomarPontos = useRef<number>(0)
    //State
    const [StateSomarPontos, SetSomarPontos] = useState<number>(0)
    //Key para os componetes 
    const RefKey = useRef<number>(0)
    //Contexto
    const {info_entrar, SetInfoContext} = useContext <typeContextGlobal | null>(InfoContext)!

    console.log('Render ID:', Math.random());

    useEffect(() => {
        StartQuiz()
    }, [])
    //=============================================================
    //Move o conteiner que mostrar o acumulado de pontos
    //X e Y
    type XY = {X: number, Y: number}
    const [StateXYAcumulado, SetXYAcumulado] = useState<XY>({ X: 100, Y: 100 })
    //Pressionando ele pae?
    const RefPressConteinerAcumuladorPontos = useRef<boolean>(false)
    //Ref do elemento de la pae
    const RefConteinerPontosACM = useRef<HTMLDivElement | null>(null)

    return (
        <div className="conteiner-handler" ref={RefConteinerHandler}
            //ele sempre vai se chamado quando eu move o mouse
            onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
                //Caso o usuario esteja pressiona no conteiner, para move-lo...
                if (!RefPressConteinerAcumuladorPontos.current || !RefConteinerPontosACM.current) return
                const { X, Y } = { X: e.clientX, Y: e.clientY }
                //Rect do componentes
                const rect = RefConteinerPontosACM.current!.getBoundingClientRect()
                const {width, height} = {width: rect.width, height: rect.height}
                SetXYAcumulado({
                    X: X - (width / 2),
                    Y: Y - (height / 2)
                })
            }} 
        >
            <Somar_Pontos
                StatePontos={StateSomarPontos} // State que vai carregar os pontos acumulador com a passa da partida
                StateXYAcumulador={StateXYAcumulado}  // o state que vai carregador o eixo X e Y
                RefPress={RefPressConteinerAcumuladorPontos} // Sera o press que sabera quando ou nao mudar o este componente de lugar. 
                RefConteiner={RefConteinerPontosACM} // Ref para este componentes, para o pai pode manipular pae.
                />
            {StateQuiz}
        </div>
    )
}

export default Handler_Quiz
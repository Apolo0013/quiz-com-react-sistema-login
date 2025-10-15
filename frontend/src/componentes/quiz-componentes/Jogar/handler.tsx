//Handler: ele vai controlar os componentes objetiva e descubrar_palavra
import './handler.scss'
//componentes
import ObjetivaQuiz from './objetiva'
//Type
import {
    type ReturnBackendQuizNormal,
    type ObjetivaQuizNormal,
    type ObjetivaQuizMath,
    type Descubrar_PalavrasQuiz,
    type InfoOpcaoTypeTema,
    type ReturnBackendQuizMath
} from '../../../types/RefTypes'
import { useEffect, useRef, useState, type JSX } from 'react'
//Utils
import { randint } from '../../../utils/utils'
//type props
type PropsHandlerQuiz = {
    Tema: InfoOpcaoTypeTema
    Tipo: 'normal' | 'math'
}


function Handler_Quiz({Tema, Tipo}: PropsHandlerQuiz) {
    //Desativar e Ativar conteiner handler.
    //Essa funcao sera usada pra simular uma troca de conteiner. 
    const desativarconteiner = () => RefConteinerHandler.current!.classList.add('conteiner-disabled') 
    const ativarconteiner = () => RefConteinerHandler.current!.classList.remove('conteiner-disabled')
    //
    function StartQuiz() {
        //Essa funcao é a Responsavel por troca de quiz. quantos quiz objetiva e descubrar_palavra
        //Sorteando uma
        const target = ['objetiva', 'descubrar_palavra'][randint(0, 0)] as 'objetiva' | 'descubrar_palavra'
        desativarconteiner()
        //Esperando um minuto pra troca.
        //Porque: O tempo que conteiner da quiz objetiva, sobe pra cima, e nois troca la memo.
        setTimeout(() => {
            //ativando conteiner
            ativarconteiner()
            if (target == 'objetiva') {
                //Aqui temos dois caminhos, quiz normal ou math
                if (Tipo == 'math') {
                    const info: ObjetivaQuizMath = RefInfo.current.objetiva[RefIndexObjetiva.current]
                    SetQuiz(<ObjetivaQuiz
                        pergunta={info.pergunta} //Pegunta do quiz
                        alternativas={info.alternativas} // Alternativas
                        assunto={info.assunto} // Assunto: x + y (adicao)
                        formula={info.formula} // Formula pro usuario usar
                        StartQuiz={StartQuiz} // CallBack
                    />)
                }
                else if (Tipo == 'normal') {    
                    //Pegando as informacoes
                    const info: ObjetivaQuizNormal = RefInfo.current.objetiva[RefIndexObjetiva.current]
                    //Passando para o componente.
                    SetQuiz(
                        <ObjetivaQuiz
                        pergunta={info.pergunta} //Pergunta
                        alternativas={info.alternativas} // Alternativas
                        StartQuiz={StartQuiz} // CallBack
                    />)
                }
                //Add +1 nom index
                RefIndexObjetiva.current++
                //Se refIndexObjetiva chegou ao final do lista.
                if (RefInfo.current.objetiva.length == RefIndexObjetiva.current) {
                    //Estrapolou pare, para ai barao.
                    RefIndexObjetivaEnd.current = true
                }
            }
            else if (target == 'descubrar_palavra') {
                //
                //const info: Descubrar_PalavrasQuiz = RefInfo.current.descubrar_Palavras[RefIndexObjetiva.current]
                //
                //SetQuiz(</>)
                //Se RefIndexDescubrar_Palavra estrapolou a quantidade de indices.
                RefIndexDescubrarPalavra.current++
                if (RefInfo.current.descubrar_palavra.length == RefIndexDescubrarPalavra.current) {
                    //true: olha estrapolou acabou o
                    RefIndexDescubrarPalavraEnd.current = true
                }
            }
        }, 1000)
        //
        
    }

    /*
    const RefInfo = useRef<ReturnBackendQuizNormal>({
        "objetiva": [
            {
                "pergunta": "Qual é a maior ilha do mundo?",
                "alternativas": {
                    "a": "Groenlândia",
                    "b": "Madagáscar",
                    "c": "Borneo",
                    "d": "Sumatra"
                },
                "resposta_certa": "A"
            },
            {
                "pergunta": "Qual país tem o maior número de fusos horários?",
                "alternativas": {
                    "a": "Rússia",
                    "b": "Canadá",
                    "c": "Estados Unidos",
                    "d": "França"
                },
                "resposta_certa": "D"
            },
            {
                "pergunta": "Qual número completa a sequência: 2, 4, 6, 8, ?",
                "alternativas": {
                    "a": "10",
                    "b": "12",
                    "c": "9",
                    "d": "11"
                },
                "resposta_certa": "A"
            },
            {
        "pergunta": "Se hoje é segunda-feira, que dia será daqui a 3 dias?",
        "alternativas": {
            "a": "Quarta-feira",
            "b": "Sexta-feira",
            "c": "Quinta-feira",
            "d": "Terça-feira"
        },
        "resposta_certa": "c"
    },
    {
        "pergunta": "Qual número completa a sequência: 1, 3, 5, 7, ?",
        "alternativas": {
            "a": "9",
            "b": "10",
            "c": "8",
            "d": "7"
        },
        "resposta_certa": "a"
    },
    {
        "pergunta": "Se João é maior que Pedro, e Pedro é maior que Ana, quem é o menor?",
        "alternativas": {
            "a": "João",
            "b": "Pedro",
            "c": "Ana",
            "d": "Não dá para saber"
        },
        "resposta_certa": "c"
    },
    {
        "pergunta": "Se 3 + 2 = 5, então 5 - 3 = ?",
        "alternativas": {
            "a": "2",
            "b": "3",
            "c": "5",
            "d": "1"
        },
        "resposta_certa": "a"
    },
    {
        "pergunta": "Se todos os gatos têm cauda, e Miau é um gato, Miau tem cauda?",
        "alternativas": {
            "a": "Sim",
            "b": "Não",
            "c": "Depende",
            "d": "Não sei"
        },
        "resposta_certa": "a"
    },
    {
        "pergunta": "Qual palavra não pertence ao grupo: Maçã, Banana, Laranja, Cadeira?",
        "alternativas": {
            "a": "Maçã",
            "b": "Banana",
            "c": "Laranja",
            "d": "Cadeira"
        },
        "resposta_certa": "d"
    },
    {
        "pergunta": "Qual figura completa a sequência: ◼, ◻, ◼, ?",
        "alternativas": {
            "a": "◻",
            "b": "◼",
            "c": "▲",
            "d": "○"
        },
        "resposta_certa": "a"
    },
    {
        "pergunta": "Se A é verdadeiro e B é falso, qual é o resultado de A E B?",
        "alternativas": {
            "a": "Verdadeiro",
            "b": "Falso",
            "c": "Indefinido",
            "d": "Verdadeiro ou falso"
        },
        "resposta_certa": "b"
    }
        ],
        "descubrar_Palavras": [
            {
                "palavra": "OASIS",
                "dica": "Área fértil em meio ao deserto"
            },
            {
                "palavra": "VULCÃO",
                "dica": "Montanha que pode expelir lava"
            },
            {
                "palavra": "ESTREITO",
                "dica": "Faixa de água que conecta dois oceanos ou mares"
            },
            {
                "palavra": "ILHA",
                "dica": "Porção de terra cercada de água por todos os lados"
            },
            {
                "palavra": "ESTEPES",
                "dica": "Planalto coberto por vegetação de gramíneas"
            },
            {
                "palavra": "ARQUIPELAGO",
                "dica": "Conjunto de ilhas próximas umas das outras"
            },
            {
                "palavra": "CACHOEIRA",
                "dica": "Água que despenca de uma altura"
            },
            {
                "palavra": "PENÍNSULA",
                "dica": "Porção de terra cercada de água em três lados"
            }
        ]
    })
    */

    const RefInfo = useRef<ReturnBackendQuizMath>({
    "objetiva": [
        {
            "pergunta": "Em uma multiplicação, quanto é 17 × 12?",
            "alternativas": {
                "a": "206",
                "b": "209",
                "c": "212",
                "d": "204"
            },
            "resposta_certa": "D",
            "formula": "X * Y",
            "assunto": "Operação básica"
        },
        {
            "pergunta": "Qual é o triplo de 18?",
            "alternativas": {
                "a": "63",
                "b": "59",
                "c": "55",
                "d": "54"
            },
            "resposta_certa": "D",
            "formula": "3 * X",
            "assunto": "Operação básica"
        },
        {
            "pergunta": "Qual é o dobro de 17?",
            "alternativas": {
                "a": "34",
                "b": "35",
                "c": "39",
                "d": "43"
            },
            "resposta_certa": "A",
            "formula": "2 * X",
            "assunto": "Operação básica"
        }
    ],
    "descubrar_palavra": [
        {
            "palavra": "TRIPLO",
            "dica": "Resultado de multiplicar por três"
        },
        {
            "palavra": "OPERACAO",
            "dica": "Ação matemática como somar ou dividir"
        },
        {
            "palavra": "UNIDADE",
            "dica": "Representa uma quantidade individual"
        },
        {
            "palavra": "CONTA",
            "dica": "Outro nome dado a uma operação matemática"
        },
        {
            "palavra": "CALCULO",
            "dica": "Processo de resolver uma operação"
        },
        {
            "palavra": "PAR",
            "dica": "Número divisível por 2"
        },
        {
            "palavra": "NUMERO",
            "dica": "Símbolo usado para representar quantidade"
        }
    ]
})

    const [StateQuiz, SetQuiz] = useState<JSX.Element | null>(null)
    //Index Quiz, os indices das perguntas, nois saber que pergunta esta sendo usada.
    const RefIndexObjetiva = useRef<number>(0)
    const RefIndexDescubrarPalavra = useRef<number>(0)
    //Index Ultrapassou: essa variavel vai dizer acabou as pergunta?
    const RefIndexObjetivaEnd = useRef<boolean>(false)
    const RefIndexDescubrarPalavraEnd = useRef<boolean>(false)
    //Ref Conteiner Handler
    const RefConteinerHandler = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        Tipo = 'math'
        StartQuiz()
    }, [])
    return (
        <div className="conteiner-handler" ref={RefConteinerHandler}>
            {StateQuiz}
        </div>
    )
}

export default Handler_Quiz
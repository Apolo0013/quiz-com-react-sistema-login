import './objetiva.scss'
import { useRef, useState, type Dispatch, type JSX, type RefObject, type SetStateAction } from 'react'
//componentes
import Alternativas_Objetivas from './alternativas-objetiva'
//Types
import { type QuizAlternativas } from '../../../../types/RefTypes'
import Pontos_Quiz from '../+pontos/pontos'

//Type Props
type PropsObjetivaQuiz = {
    pergunta: string,
    alternativas: QuizAlternativas,
    //Passa pro componente Alternativas
    resposta_certa: string,
    formula?: string,
    assunto?: string
    //Pra passa pro alternativas-objetivas
    StartQuiz: () => void,
    SetSomarPontos: Dispatch<SetStateAction<number>>,
    RefSomarPontos: RefObject<number>
}


function ObjetivaQuiz({ pergunta, alternativas, resposta_certa, formula, assunto, StartQuiz, SetSomarPontos, RefSomarPontos}: PropsObjetivaQuiz) {
    //Ref do conteiner Main
    const RefConteiner = useRef<HTMLDivElement | null>(null)
    //State para os pontos
    const [StateAnimacaoPontos, SetAnimacaoPontos] = useState<JSX.Element | null>(null)
    return (
        <div className='conteiner-objetiva-quiz-wraper Show-Quiz' ref={(el) => {
            if (el) RefConteiner.current = el
        }}
            onAnimationEnd={() =>
                RefConteiner.current!.classList.remove('DesShow-Quiz')}>
            
            <div className="conteiner-objetiva-quiz">
                {
                    //State que vai chama o componentes que +pontos
                    StateAnimacaoPontos
                }
                <div className="conteiner-pergunta-objetiva">
                    <div className="text-question-menciona">
                        <p className='Interrogacao-question-quiz'>?</p>
                        <h3>Pergunta. . .</h3>
                    </div>
                    <p className='quiz-texto-pergunta'>
                        {pergunta}
                    </p>
                </div>
                { 
                    formula ? <div className="quiz-math-formula"><p>{formula}</p></div> : null
                }
                { 
                    assunto ? <div className="quiz-math-assunto"><p>{assunto}</p></div> : null
                }
                <Alternativas_Objetivas
                    alternativas={alternativas}
                    resposta_certa={resposta_certa}
                    StartQuiz={(addpontos: number) => {
                        if (!RefConteiner.current) return
                        StartQuiz()
                        //Alem dessa funcao vamos add mais
                        // essa funcao é chamado quando o usuario escolhe um alternativas gld.
                        // ele faz ele subir pra cima e sumi
                        //Add o total de pontos acumulado
                        SetSomarPontos(prev => prev + addpontos) // somando para mostrar
                        RefSomarPontos.current += addpontos
                        //Antes vamos add animacao de pontuacao
                        SetAnimacaoPontos(<Pontos_Quiz
                            pontos={addpontos}
                            left={1} // Eixo: X
                            top={30} // Eixo: Y
                        />)
                        //2100ms antes de chama animacao de subir
                        setTimeout(() => {
                            //Retirando o elemento Pontos+, ja esta feito o seu servico por aqui.
                            SetAnimacaoPontos(null)
                            //Add animacao
                            RefConteiner.current!.classList.add('DesShow-Quiz')
                        }, 2100)
                        //Quando animacao dele removemos a class dele?
                        //-La no elemento diretamente
                    }} />
            </div>
        </div>
    )
}

export default ObjetivaQuiz
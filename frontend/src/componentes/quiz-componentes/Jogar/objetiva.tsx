import './objetiva.scss'
import { useEffect, useRef, type RefObject } from 'react'
//componentes
import Alternativas_Objetivas from './alternativas-objetiva'
//Types
import { type QuizAlternativas } from '../../../types/RefTypes'

//Type Props
type PropsObjetivaQuiz = {
    pergunta: string,
    alternativas: QuizAlternativas,
    formula?: string,
    assunto?: string
    //Pra passa pro alternativas-objetivas
    StartQuiz: () => void
}


function ObjetivaQuiz({ pergunta, alternativas, StartQuiz }: PropsObjetivaQuiz) {
    const RefConteiner = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
    }, [])
    return (
        <div className='conteiner-objetiva-quiz-wraper Show-Quiz' ref={RefConteiner}>
            <div className="conteiner-objetiva-quiz">
                <div className="conteiner-pergunta-objetiva">
                    <div className="text-question-menciona">
                        <p className='Interrogacao-question-quiz'>?</p>
                        <h3>Pergunta. . .</h3>
                    </div>
                    <p className='quiz-texto-pergunta'>
                        {pergunta}
                    </p>
                </div>
                <div className="quiz-math-formula"><p>x + y</p></div>
                <div className='quiz-math-assunto'><p>Adicao</p></div>
                <Alternativas_Objetivas alternativas={alternativas} StartQuiz={() => {
                    StartQuiz()
                    //Alem dessa funcao vamos add mais
                    // essa funcao é chamado quando o usuario escolhe um alternativas gld.
                    // ele faz ele subir pra cima e sumi
                    RefConteiner.current!.classList.add('DesShow-Quiz')
                    //Quando animacao dele removemos a class dele
                    RefConteiner.current!.addEventListener('animationend', () => {
                        RefConteiner.current!.classList.remove('DesShow-Quiz')
                    })
                }} />
            </div>
        </div>
    )
}

export default ObjetivaQuiz
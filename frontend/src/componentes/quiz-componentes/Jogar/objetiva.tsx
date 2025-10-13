import './objetiva.scss'
import { useRef } from 'react'
//componentes
import Alternativas_Objetivas from './alternativas-objetiva'
//Types
import { type QuizAlternativas } from '../../../types/RefTypes'

//Type Props
type PropsObjetivaQuiz = {
    pergunta: string,
    alternativas: QuizAlternativas,
    //Pra passa pro alternativas-objetivas
    StartQuiz: () => void
}


function ObjetivaQuiz({pergunta, alternativas, StartQuiz}: PropsObjetivaQuiz) {
    return (
        <div className='conteiner-objetiva-quiz-wraper'>
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
                <Alternativas_Objetivas alternativas={alternativas} StartQuiz={StartQuiz} />
            </div>
        </div>
    )
}

export default ObjetivaQuiz
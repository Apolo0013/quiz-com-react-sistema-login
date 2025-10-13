import { useEffect, useRef} from 'react'
import './alternativas-objetiva.scss'
//Types
import { type QuizAlternativas } from '../../../types/RefTypes'

type PropsAlternativaObjetivas = {
    alternativas: QuizAlternativas,
    //Pra passa de quiz pae.
    StartQuiz: () => void
}


function Alternativas_Objetivas({alternativas, StartQuiz}: PropsAlternativaObjetivas) {
    function TrocaPosicaoDeagrade() {
        if (!RefConteiner.current) return
        //Filhos
        const ListaCards: HTMLElement[] = [...RefConteiner.current.children] as HTMLElement[]
        //Embaralhando o grus
        const Lista: number[] = [10, 45, 235, 200].sort(() => Math.random() - 0.5)
        for (let index = 0; index < 4; index++) {
            ListaCards[index].style.background = `linear-gradient( ${Lista[index]}deg, #6a00f4, #0072ff)`
        }
    }
    //Ref conteiner
    const RefConteiner = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        TrocaPosicaoDeagrade()
    }, [])
    return (
        <div className="conteiner-alternativas" ref={RefConteiner}>
            <div className="Alternativas-Objetivas-Escolhar" onClick={StartQuiz}>
                <div className='Alternativas-Letras'>A</div>
                <p>{alternativas.a}</p>
            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={StartQuiz}>
                <div className='Alternativas-Letras'>B</div>
                <p>{alternativas.b}</p>
            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={StartQuiz}>
                <div className='Alternativas-Letras'>C</div>
                <p>{alternativas.c}</p>

            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={StartQuiz}>
                <div className='Alternativas-Letras'>D</div>
                <p>{alternativas.d}</p>
            </div>
        </div>
    )
}

export default Alternativas_Objetivas
import { useEffect, useRef, type MouseEvent} from 'react'
import './alternativas-objetiva.scss'
//Types
import { type QuizAlternativas } from '../../../../types/RefTypes'

type PropsAlternativaObjetivas = {
    alternativas: QuizAlternativas,
    resposta_certa: string,
    //Pra passa de quiz pae.
    StartQuiz: (addpontos: number) => void
}


function Alternativas_Objetivas({alternativas, resposta_certa,StartQuiz}: PropsAlternativaObjetivas) {
    function CallBackEfeitoErradoECerto(e: MouseEvent<HTMLDivElement>) {
        //Aqui nessa funcao vamos usar para chama a funcao callback vinda do Handler e add os efeitos 
        if (!RefConteiner.current) return
        //Pontos
        let pontos: number = 0
        //Letra do elemento clicado
        const letra = e.currentTarget.dataset.letra as string
        //se for a resposta certa,  o usuario receberar 1000 pontos
        if (letra == resposta_certa) pontos = 1000
        //caso ao contrario, ele recebera apenas 100
        else pontos = 100
        //=================================================================
        //Pegandos os glds
        const ABCDDIV = [...RefConteiner.current.children] as HTMLElement[]
        //Desativando eles
        //Desativando as alternativas, evitando double clicks.
        ABCDDIV.map((div) => (
            div.classList.add('disabled-alternativas')
        ))
        //Add os efeitos
        for (const div of ABCDDIV) {
            const letra = div.dataset.letra as string
            //Se a letra presente no id dele for a certa, significa que a resposta esta certa, entao add  o efeito que correto na div
            if (letra == resposta_certa) {
                div.classList.add('Alternativa-Certa')
            }
            //caso ao contrario: efeito que a resposta esta errada o.
            else {
                div.classList.add('Alternativa-Errada')
            }
        }
        //2,5 segundos para o efeito de cima terminar
        setTimeout(() => {
            //Ativando as div que estava desativadas
            //E Reativando as alternativas
            //Daqui a 2 segundos é pra ele subir, assim nois reativar eles.
            setTimeout(() => {
                ABCDDIV.map((div) => (
                    //Removendo a class responsavel por desativar.
                    div.classList.remove('disabled-alternativas')
                ))
            }, 2000)
            //CallBack vindo do Handler.tsx
            StartQuiz(pontos)
            //Depois disso tudo, vamos remover as class responsavel por da o efeito de correto e errado
            ABCDDIV.map((div) => (
                div.classList.remove('Alternativa-Certa', 'Alternativa-Errada')
            ))
        }, 2500)
    }


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
            <div className="Alternativas-Objetivas-Escolhar" onClick={CallBackEfeitoErradoECerto} data-letra="A">
            <div className='Alternativas-Letras'>A</div>
            <p>{alternativas.a}</p>
            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={CallBackEfeitoErradoECerto} data-letra="B">
                <div className='Alternativas-Letras'>B</div>
                <p>{alternativas.b}</p>
            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={CallBackEfeitoErradoECerto} data-letra="C">
                <div className='Alternativas-Letras'>C</div>
                <p>{alternativas.c}</p>

            </div>
            <div className="Alternativas-Objetivas-Escolhar" onClick={CallBackEfeitoErradoECerto} data-letra="D">
                <div className='Alternativas-Letras'>D</div>
                <p>{alternativas.d}</p>
            </div>
        </div>
    )
}

export default Alternativas_Objetivas
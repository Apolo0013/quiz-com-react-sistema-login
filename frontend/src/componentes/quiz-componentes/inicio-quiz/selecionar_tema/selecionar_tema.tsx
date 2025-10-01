import './selecionar_tema.scss'
//componentes
import Card_Tema from './card-tema'
//imagens
import ImgGeografia from '../../../../assets/imagens/quiz-main-tema/geografia.svg'
import ImgCiencia from '../../../../assets/imagens/quiz-main-tema/ciencia.svg'
import ImgHistoria from '../../../../assets/imagens/quiz-main-tema/historia.svg'
import ImgMatematica from '../../../../assets/imagens/quiz-main-tema/matematica.svg'
import ImgCinema from '../../../../assets/imagens/quiz-main-tema/cinema.svg'
import ImgMusica from '../../../../assets/imagens/quiz-main-tema/musica.svg'
import ImgEsporte from '../../../../assets/imagens/quiz-main-tema/sport.svg'
import ImgLiteratura from '../../../../assets/imagens/quiz-main-tema/literatura.svg'
import ImgTech from '../../../../assets/imagens/quiz-main-tema/tech.svg'
import ImgLogica from '../../../../assets/imagens/quiz-main-tema/logica.svg'
//
import { useEffect, useRef, useState, type MouseEvent} from 'react'
//
import { type TypeGetRefTemaEDificuldade, type InfoOpcaoTypeTema } from '../../../../types/RefTypes'


function Selecionar_Tema({ RefGetInfo, RefConteiner}: TypeGetRefTemaEDificuldade) {
    function Seleciona(e: MouseEvent<Element>) {
        if (!RefTemaOpcao.current) return
        const filhos: Element[] = [...RefTemaOpcao.current.children]
        for (const div of filhos) {
            div.classList.remove('selecionado-botao-dificuldade-e-tema')
        }
        const el: Element = e.currentTarget
        if (!el) return
        el.classList.add('selecionado-botao-dificuldade-e-tema')
    }   


    const [Tema, SetTema] = useState<InfoOpcaoTypeTema>("")
    //Ref do conteiner opcao-tema// ondem esta os card do tema pae.
    const RefTemaOpcao = useRef<HTMLDivElement | null>(null)
    

    useEffect(() => {
        RefGetInfo.current.tema = Tema
    }, [Tema])
    return (
        <div className="opcao-tema-quiz-main" ref={RefConteiner}>
            <h1>Selecione um tema</h1>
            <div className='opcao-tema' ref={RefTemaOpcao}>
                <Card_Tema Nome_Tema="Geografia" SetTema={SetTema} img_path={ImgGeografia}  EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="História" SetTema={SetTema} img_path={ImgHistoria} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Ciências" SetTema={SetTema} img_path={ImgCiencia} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Matemática" SetTema={SetTema} img_path={ImgMatematica} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Cinema" SetTema={SetTema} img_path={ImgCinema} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Música" SetTema={SetTema} img_path={ImgMusica} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Esportes" SetTema={SetTema} img_path={ImgEsporte} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Literatura" SetTema={SetTema} img_path={ImgLiteratura} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Tecnologia" SetTema={SetTema} img_path={ImgTech} EventClick={Seleciona}/>
                <Card_Tema Nome_Tema="Logica" SetTema={SetTema} img_path={ImgLogica} EventClick={Seleciona}/>
            </div>
        </div>
    )
}

export default Selecionar_Tema
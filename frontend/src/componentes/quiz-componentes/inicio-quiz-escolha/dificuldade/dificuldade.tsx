import { useRef } from 'react'
import './dificuldade.scss'
//type
import {type InfoOpcaoType, type InfoOpcaoTypeDificuldade, type TypeGetRefTemaEDificuldade } from '../../../../types/RefTypes'

function Dificuldade_Quiz({ GetInfo, RefConteiner } : TypeGetRefTemaEDificuldade) {
    function EscolheDificuldade(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) { 
        //retirar a selecionado-botao-dificuldade de todos
        function RetirarClassSlcAll() {
            if (!RefConteinerBotao.current) { return }
            const ListEl: Element[] = [...RefConteinerBotao.current!.children]
            for (const el of ListEl) {
                el.classList.remove("selecionado-botao-dificuldade-e-tema")
            }
        }
        //
        const el: HTMLButtonElement = e.currentTarget
        if (!el) { return }
        ///se ele encontrar a class seleciona, no elemento que ele clicou. Vamos retirar a class. e retirar a dificuldade do ref responsavel por guardara essa informacao.
        if ([...el.classList].includes('selecionado-botao-dificuldade-e-tema')) {
            //retirando a class.
            el.classList.remove('selecionado-botao-dificuldade-e-tema')
            //retirando do ref
            GetInfo((prev: InfoOpcaoType) => ({tema: prev.tema, dificuldade: ''}))
        }
        else {
            //desativando todos.
            RetirarClassSlcAll()
            //add a class que deixa o botao ativado
            el.classList.add('selecionado-botao-dificuldade-e-tema')
            //Pegando a opcao selecionado.
            const dataset: DOMStringMap = el.dataset
            if (!dataset || !dataset.target) {return}
            const opcao = dataset.target as InfoOpcaoTypeDificuldade
            //add
            GetInfo((prev: InfoOpcaoType) => ({tema: prev.tema, dificuldade: opcao}))
        }
    }

    const RefConteinerBotao = useRef<HTMLDivElement | null>(null)
    //

    return (
        <div className="conteiner-dificuldade-quiz-main" ref={RefConteiner}>
            <h1>Escolha a Dificuldade</h1>
            <div className="conteiner-dificuldade-botao" ref={RefConteinerBotao}>
                <button data-target="facil" onClick={(e) => EscolheDificuldade(e)}>Fácil</button>
                <button data-target="medio" onClick={(e) => EscolheDificuldade(e)}>Médio</button>
                <button data-target="dificil" onClick={(e) => EscolheDificuldade(e)}>Difícil</button>
            </div>
        </div>
    )
}

export default Dificuldade_Quiz
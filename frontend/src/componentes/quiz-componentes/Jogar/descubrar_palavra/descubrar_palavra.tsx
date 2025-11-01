import './descubrar_palavra.scss'
//componentes
import Card_Letra from './card-letra'
import { useEffect, useRef, useState, type Dispatch, type JSX, type MouseEvent, type RefObject, type SetStateAction} from 'react'
//Utils
import { alfabeto, embaralhar, randint } from '../../../../utils/utils'
import Pontos_Quiz from '../+pontos/pontos'
//Types
type PropsDescubrar_Palavra = {
    palavra: string,
    dica: string
    StartQuiz: () => void
    SetSomarPontos: Dispatch<SetStateAction<number>>
    RefSomarPontos: RefObject<number>
}

function Descubrar_PalavraQuiz({ palavra, dica, StartQuiz, SetSomarPontos, RefSomarPontos}: PropsDescubrar_Palavra) {
    function CallBackStartQuiz(addpontos: number) {
        //==
        if (!RefConteinerMain.current) return
        //Somando no state que mostrar o pontos acumulados
        //se for maior que zero
        if (addpontos > 0) {
            //Add no state, para mostrar pro usuario pae.
            SetSomarPontos(prev => prev + addpontos)
            //Ref para nao reniciar
            RefSomarPontos.current += addpontos
        }
        //Animacao de +pontos
        SetAnimacaoPontos(<Pontos_Quiz
            pontos={addpontos}
            left={5}
            top={3}
        />)
        // 1600ms é a durecao da animacao, quando ela acabar o state vai guardar null
        setTimeout(() => {
            //tirando o conteiner dela.
            SetAnimacaoPontos(null)
            // So depois vamos add aniamcao do conteiner subir pra cima
            //Trava o conteiner, pro usuario fazer mais nada.
            RefConteinerGame.current?.classList.add('disabled-all')
            setTimeout(() => {
                //Voltando
                RefConteinerMain.current!.classList.add("DesShow-Quiz")
                //Finalmente Chama.
                //CallBack
                //trocando de quiz.
                StartQuiz()
                RefConteinerGame.current?.classList.remove('disabled-all')
            }, 1000)
        }, 2100)
        
    }

    function Deleta<T>(Lista: T[], index: number) {
        return Lista.filter((_, i) => i !== index)
    }


    function ErrouPalavraEffect() {
        //Verificar se o conteiner nao é null
        if (!RefConteinerGame.current) return
        //Dando SetError em geral
        setTimeout(() => {
            for (const funcao of RefFuncErrorCardList.current) if (funcao) funcao(true)
            //0.6s espera antes de transmitir o warn
        }, 600)
        //Esperar 2s antes
        setTimeout(() => {
            //destivando conteiner ondem esta os cards
            RefConteinerGame.current!.classList.add('disabled-all')
            //Reniando as variavel
            //RefPalavraFeita.current = []
            //Descupado os espacos vazios
            for (const info of Object.values(RefPosicaoVazios.current)) {
                info.ocupado = false
            }
            ///
            //index: vou usar pra da tempo de animacao
            let index: number = 1
            //os cards letra vamos leva ele pro canto deles.
            for (const div of Object.values(RefsCardsLetra.current)) {
                const ID = div.dataset.id as string
                //Oha se id dessa esta dentro do Ref que guardar as palavra que estao no cards vazio, pq essa div, esta la pae.
                if (RefPalavraFeita.current.some(valor => valor.id == ID)) {
                    //Pegando a posicao.
                    //Lembrando que essa funcao retorna a posicao disponivel e ocupar ela. assim evitando 2 cards em 1 posicao
                    const pos: XY = OcuparPosicao(RefPosicaoLetras.current)
                    //Add as posicao
                    setTimeout(() => {
                        div.style.left = pos.x + 'px'
                        div.style.top = pos.y + 'px'
                    }, index * 50)
                }
                //Add +1  no index
                index++
            }
            //Reniciando a variavel que guardar a palavra feita.
            RefPalavraFeita.current = []
            //Reativando o conteinter
            setTimeout(() => {
                RefConteinerGame.current!.classList.remove('disabled-all')
            }, 2000)
        }, 2000)
    }


    //Essa funcao vai criar os cards:
    //Vazio: ondem vao se preenchida pelo cards letras
    //Letra: ondem o usuario vai usar pra forma a palavra
    function CriarCards(palavra: string) {
        //Criando os cards
        //Cards vazios
        let listacards: JSX.Element[] = []
        for (let key = 0; key <= palavra.length - 1; key++) {
            listacards.push(<Card_Letra
                Vazio={true}
                Clica={false}
                RefGetRefs={RefsCardsVazios}
                key={Number(key)}
            />)
        }
        //add a lista no state
        SetPalavraCompletar(listacards)
        //Cards ondem teram as  letras pae.
        //alfaberto
        let clonealfaberto: string[] = alfabeto
        //Lista das letras
        let ListaLetras: string[] = [...palavra.toUpperCase().split('')]
        //sorteando
        for (let index = 0; index <= randint(2, 4); index++) {
            //sorteando alguam indice
            const sort: number = randint(0, clonealfaberto.length - 1)
            //add a letra sorteada
            ListaLetras.push(clonealfaberto[sort])
            //deleta pra nao aparece mais ele
            clonealfaberto = Deleta(clonealfaberto, sort)
        }
        //embaralhando ela.
        ListaLetras = embaralhar(ListaLetras)
        //add ela no state
        //re-aproveitando a lista criada la tras
        listacards = []
        let key: number = 0
        for (const letra of ListaLetras) {
            listacards.push(<Card_Letra
                onClick={HandlerMove}
                Letra={letra}
                Clica={true}
                RefGetRefs={RefsCardsLetra}
                ref={(ref) => {
                    if (ref) RefFuncErrorCardList.current[RefFuncErrorCardList.current.length] = ref
                }}
                key={key}
            />)
            key++
        }
        //add no state
        SetPalavraJogar(listacards)
    }

    function PegandoPosicaoCards() {
        if (!RefConteinerGame.current) return
        //posicao pai, que vai relativo a posicao dos cards
        //const parentpos: XY = {x: RefConteinerGame.current!.offsetLeft, y: RefConteinerGame.current!.offsetTop}
        //Reniciando os objetos
        RefPosicaoVazios.current = {}
        RefPosicaoLetras.current = {}
        //Pegando as posicao do espacos vazio pae.
        let index: number = 0
        for (const div of RefsCardsVazios.current) {
            RefPosicaoVazios.current[`pos${index}`] = {
                XY: {
                    //"+" ele impedir ele virar string, e continua  number
                    x: div.offsetLeft,
                    y: div.offsetTop
                },
                ocupado: false
            }
            index++
        }
        //Renicinado o index de cima pae. re-aproveita pae.
        index = 0
        //Pegando as posicao dos cards da letra gld.
        for (const div of RefsCardsLetra.current) {
            RefPosicaoLetras.current[`pos${index}`] = {
                ocupado: true,
                //Calculando a posicao relativa dele
                XY: {
                    x: div.offsetLeft,
                    y: div.offsetTop
                }
                //XY: { x: div.offsetLeft, y: div.offsetTop }
            }
            index++
        }
    }


    //Handler, o controlador das funcoes resposnvel por move os cards.
    //e: é o elemento clicado
    //SetError: funcao que vai ativar a class error la no card
    function HandlerMove(e: MouseEvent<HTMLDivElement>, SetError: (state: boolean) => void) {
        //Jogo acabou?
        if (RefGameEnd.current) return
        //pergando a div
        const div = e.currentTarget
        //Pegando o id da div, para indentifica ela.
        const ID = div.dataset.id as string
        //Se id da div estive na ref que guardar a informacoes da palavra.
        if (RefPalavraFeita.current.some(valor => valor.id == ID)) {
            MoveVazioTOLetra(div)
        }
        else {
            //Antes de tudo. vamos verificar se ja tem o max de cards nos cards vazio
            if (palavra.length == RefPalavraFeita.current.length) {
                SetError(true)
                return
            }
            //Movendos os cards
            MoveLetraTOVazio(div)
            //fazendo a palavra, 
            const palavra_string: string = RefPalavraFeita.current
                .map(valor => valor.letra) // so vai guardar a letra
                .join('') // no final o map vai retorna: ['a', 'b', 'c'], o join vai tranforma em 'abc'
            // vamos verificar se depois de add + card, ja esta cheia:
            //Isso que dizer: Olha ele ja completou um palavra vamos verificar
            //Se a palavra que o usuario formou é igual a palavra sorteada
            if (palavra.length == RefPalavraFeita.current.length) {
                //Blz ele acertou a palavra
                if (palavra_string.toUpperCase() == palavra.toUpperCase()) {
                    //Usuario acertou a frase pae.
                    RefGameEnd.current = true
                    //Ganhou!!!
                    CallBackStartQuiz(1000)
                }
                //Caso ao contrario
                else {
                    //Errou
                    ErrouPalavraEffect()
                    //Vamos subtrair a chance
                    SetChancePoints(prev => prev - 1)
                    //Verificamos o valor novo do state la no useEffect
                }
            }
        }
    }


    //Funcao que move os cards das letra para o vazio
    function MoveLetraTOVazio(el: HTMLDivElement) {
        if (!el) return
        //Posicao que o card vai ocupar
        const posmove: XY = OcuparPosicao(RefPosicaoVazios.current)
        //Desocupando a posicao
        DesOcuparPosicao(RefPosicaoLetras.current, el)
        //Add o posicao X e Y
        el.style.left = posmove.x + 'px'
        el.style.top = posmove.y + 'px'
        //Add a palavra dentro da lista
        const Letra = el.dataset.letra as string
        const ID = el.dataset.id as string
        RefPalavraFeita.current.push({
            id: ID,
            letra: Letra
        })
    }

    //a funcao responsavel por move o cards do vazio para letra
    function MoveVazioTOLetra(el: HTMLDivElement) {
        if (!el) return
        //Ocupar a posicao
        const pos: XY = OcuparPosicao(RefPosicaoLetras.current)
        //Desocupar
        DesOcuparPosicao(RefPosicaoVazios.current, el)
        //Colocando ele na posicao pae.
        el.style.left = pos.x + 'px'
        el.style.top = pos.y + 'px'
        //Retirando do ref palavra feita
        const ID = el.dataset.id as string
        const index = RefPalavraFeita.current.findIndex(valor => valor.id == ID)
        RefPalavraFeita.current = Deleta(RefPalavraFeita.current, index)
    }

    //Funcao
    //Retorna: Posicao do que sera ocupada
    //Oque mudar: Mudar o valor do ref(um objeto) ocupada para true(esta ocupada)
    function OcuparPosicao(Lista: TypeXYAndOcupe): XY {
        let pos: XY = { x: 0, y: 0 }
        for (const info of Object.values(Lista)) {
            if (!info.ocupado) {
                info.ocupado = true
                pos = info.XY
                return pos
            }
        }
        return pos
    }

    //Funcao
    //retorna nada.
    //oq mudar: Desacupar a ultima posicao do elemento, troca do ocupado para true.
    function DesOcuparPosicao(Lista: TypeXYAndOcupe, el: HTMLDivElement) {
        //atualizando posicao dessa elemento fala que esta desacupado
        //Pegando a posicao anterior dessa div.
        const posbefore: XY = { x: el.offsetLeft, y: el.offsetTop }
        //Pegando o index/numerado da posicao que essa div esta.
        const indexpos = Object.values(Lista).findIndex(valor => valor.XY.x == posbefore.x && valor.XY.y == posbefore.y)
        //Colocando posicao para se indentifica como desacupada.
        Lista[`pos${indexpos}`].ocupado = false
    }

    //===============================================================================
    //States
    //Cards para a palavras que tentaram se descubrida o
    const [StatePalavraCompletar, SetPalavraCompletar] = useState<JSX.Element[]>([])
    //Cards com letras pra colocas dentro da palavras
    const [StatePalavraJogar, SetPalavraJogar] = useState<JSX.Element[]>([])
    //===============================================================================
    //Refs
    //Type x e y ambos recebem number
    type XY = { x: number, y: number }
    //Type para objeto que receber XY
    //Type que receber o XY e ocupado boolean
    type TypeXYAndOcupe = { [key: string]: { XY: XY, ocupado: boolean } }
    //Refs que vai guardar as posicoes dos cards vazio pae.
    const RefPosicaoVazios = useRef<TypeXYAndOcupe>({})
    //Refs que vai guardar as posicoes dos cards letras
    const RefPosicaoLetras = useRef<TypeXYAndOcupe>({})
    //Porque voce criolo vai pegar as posicoes dos  mesmo?
    //Simples, com isso nois consegue fazer animacao de troca.
    //+++====
    //Variavel que vai dizer se o jogo acarbou ou nao.
    const RefGameEnd = useRef<boolean>(false)
    //+++====
    //Palavra se formando. As letra que estao no espaco vazio, vamos combinar assim fazendo dele uma palavra, e ai sim verificando se esta certa.
    //Tambem ondem nois vai guardar as informacoes das div que estao la gld.
    type InfoPalavraFeita = {
        //Letra que essa porra guardar
        letra: string,
        // id que o div carregar junto que ele, isso vai ajuda nois a saber quem esta la.
        id: string
    }
    const RefPalavraFeita = useRef<InfoPalavraFeita[]>([])
    //===============================================================================
    //Ref elementos
    //Para pegar os ref dos cards
    const RefsCardsVazios = useRef<HTMLDivElement[]>([])
    const RefsCardsLetra = useRef<HTMLDivElement[]>([])
    //===============================================================================
    //Ref do conteiner main.
    const RefConteinerMain = useRef<HTMLDivElement | null>(null);
    //Ref do conteiner game
    const RefConteinerGame = useRef<HTMLDivElement | null>(null)
    //state das chances
    const [StateChancePoints, SetChancePoints] = useState<number>(3)
    //Ref vai guardar as funcao que da o warn de error do card, vindo direto do filho
    const RefFuncErrorCardList = useRef<((state: boolean) => void)[]>([])
    //State para guardar a animacao de +pontos
    const [StateAnimacaoPontos, SetAnimacaoPontos] = useState < JSX.Element | null>(null)

    //UseEffect para verificar a quantidade de chance
    useEffect(() => {
        //E verificar
        //Se Chance for igual a 0, ja era pae, perdeu.
        if (StateChancePoints == 0) {
            RefGameEnd.current = true
            //callback pra sair daqui
            CallBackStartQuiz(100)
        }
    }, [StateChancePoints])


    useEffect(() => {
        CriarCards(palavra)
    }, [])

    useEffect(() => {
        if (!RefConteinerGame.current || RefsCardsLetra.current.length == 0) return
        //Antes de da abslute para os card vou fixa o height do conteiner para ele nao voltar ao normal.
        //Oq acontece aqui: eu pego as posicoes de dele ja com flex em acao, assim definido o lugar deles.
        if (RefConteinerGame.current!.offsetHeight >= 600) {
            const heightfinal: string = RefConteinerGame.current!.offsetHeight + 'px'
            RefConteinerGame.current!.style.height = heightfinal
        }
        //Um setimeout antes de pegar as posicoes, pq quando no add o altura ele mudar alguns px
        setTimeout(() => {
            //Pegando as posicoes dos cards
            PegandoPosicaoCards()
            //Add as posicao pegar depois pae.
            let index = 0
            for (const div of RefsCardsLetra.current) {
                const xy: XY = RefPosicaoLetras.current[`pos${index}`].XY
                div.style.position = 'absolute'
                div.style.left = xy.x + 'px'
                div.style.top = xy.y + 'px'
                index++
            }
        }, 1000)


    }, [StatePalavraCompletar, StatePalavraJogar])

    return (
        <div className="conteiner-descubrar-palavra-main Show-Quiz" ref={RefConteinerMain}
            onAnimationEnd={() => {
                RefConteinerMain.current?.classList.remove('DesShow-Quiz')
            }}
        >
            <div className="conteiner-descubrar-palavra">
                <div className="conteiner-pergunta-descubrar-palavra-quiz">
                    <h2 className='title-descubrar-palavra'>DESCUBRA A PALAVRA. . .</h2>
                    <div className="descubrar-palavra-dica">
                        <p>Dica</p>
                        <p>{dica}</p>
                    </div>
                </div>
                <div className="conteiner-descubrar-game" ref={RefConteinerGame}>
                    {
                        //State usada pra seta um elemento que faz uma animacao
                        StateAnimacaoPontos
                    }
                    <span className='descubrar-game-chance'><p>{StateChancePoints}/3</p></span>
                    <span className='descubrar-palavra-pular-quiz'><button
                        onClick={() => CallBackStartQuiz(0)}
                    >Pular</button></span>
                    <div className="conteiner-nome-grid-quiz-completa"  >
                        {StatePalavraCompletar}
                    </div>
                    <div className='conteiner-nome-grid-quiz-jogar' >
                        {StatePalavraJogar}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Descubrar_PalavraQuiz
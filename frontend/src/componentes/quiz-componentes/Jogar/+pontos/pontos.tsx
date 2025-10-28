//Pontos
//Basimente ele sera a animacao de acertos
import "./pontos.scss"
type PropsPontos = {
    pontos: number,
    //a posicao dele, sera relativa de acordo com vontade de cada componentes.
    left: number,
    top: number
}

function Pontos_Quiz({pontos, left, top}: PropsPontos ) {
    return (
        <div className="conteinter-pontos-quiz" style={{left: left + "%", top: top + "%"}}>
            <h3>{"+" + pontos}</h3>
        </div>
    )
}

export default Pontos_Quiz
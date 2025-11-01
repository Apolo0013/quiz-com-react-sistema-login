import type { RefObject } from 'react'
import './somar_pontos.scss' 
type PropsSomarPontos = {
    StatePontos: number,
    StateXYAcumulador: { X: number, Y: number },
    RefPress: RefObject<boolean>,
    RefConteiner: RefObject<HTMLDivElement | null>
}

function Somar_Pontos({ StatePontos, StateXYAcumulador, RefPress, RefConteiner}: PropsSomarPontos) {

    return (
        <div className='Conteiner-Acumalacao-pontos'
            ref={RefConteiner}
            style={{
                left: StateXYAcumulador.X + "px",
                top: StateXYAcumulador.Y + "px"
            }}
            onMouseDown={() => RefPress.current = true}
            onMouseUp={() => RefPress.current = false}
        >
            <p>Pontos Acumulados</p>
            <p>{StatePontos}</p>
        </div>
    )
}

export default Somar_Pontos
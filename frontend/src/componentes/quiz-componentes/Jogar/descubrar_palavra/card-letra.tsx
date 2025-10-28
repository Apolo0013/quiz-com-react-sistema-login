import { forwardRef, useImperativeHandle, useState, type RefObject} from 'react'
import './card-letra.scss'
//
type PropsoCard_Letra = { 
    RefGetRefs: RefObject<HTMLDivElement[]>,
    Letra?: string,
    Vazio?: boolean,
    Clica?: boolean,
    onClick?: (e: React.MouseEvent<HTMLDivElement>, SetError: (state: boolean) => void) => void,
}

const Card_Letra = forwardRef<(state: boolean) => void, PropsoCard_Letra>((props, ref) => {
    //Pegando o ref diretamente. pq: REACT...
    function SetRef(el: HTMLDivElement | null) {
        if (el && !props.RefGetRefs.current.includes(el)) {
            props.RefGetRefs.current[props.RefGetRefs.current.length] = el  
        }        
    }

    function gerarId() {
        return Math.random().toString(36).substring(2, 9);
    }

    const SetError = (state: boolean) => SetClassError(state ? 'card-error' : '')

    const [StateClassError, SetClassError] = useState < 'card-error' | ''>('')
    //ID unico, diretamente nao pq o fdp rederizar
    const [ID, _] = useState<string>(gerarId())
    
    useImperativeHandle(ref, () => (SetError))

    return (
        <div className={`conteiner-card-letra ${props.Vazio ? 'card-vazio' : ''} ${props.Clica ? 'clicavel' : ''} ${StateClassError}`}
            //se a funcao for nula no caso
            onClick={(e) => props.onClick && props.onClick(e, SetError)}
            data-letra={props.Letra}
            data-id={ID} //tem que ter essa porra aqui, pq o filho tem letra repetidas
            ref={el => SetRef(el)}
            onAnimationEnd={() => SetError(false)}
        >
            {props.Letra ? <h2>{props.Letra}</h2> : null}
        </div>
    )
})

export default Card_Letra
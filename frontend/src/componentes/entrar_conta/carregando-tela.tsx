// esse componentes vai fica na tela de entradas, vai exbir uma tela de load.

import './carregando-tela.scss'

function Carregando_Tela_Entrar({diametro ,text}: {diametro?: number,text?: string}) {
    return (
        <div className="conteiner-carregando-tela-entrar">
            <span
                style={
                {
                    height: diametro ? diametro + "%" : "20%"   
                }}
            ></span>
            <h1 className='Texto-Carregando'
                //se o texto for null, vamos ocultar h1(ou seja sem messagem...)
                style={
                    {
                        display: !text ? "none" : 'block',
                    }
                }>{text}</h1>
        </div>
    )
}

export default Carregando_Tela_Entrar
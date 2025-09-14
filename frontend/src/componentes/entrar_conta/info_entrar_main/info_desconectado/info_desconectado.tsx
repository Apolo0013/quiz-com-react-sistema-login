import { useNavigate } from 'react-router-dom'
import './info_desconectado.scss'

function Info_Desconectado() {
    const nv = useNavigate()
    return (
        <div className="conteiner-info-desconectado">
            <h3>Entrar</h3>
            <div className="info-desconectado-opcao-botao">
                <button onClick={() => nv('/home/entrar/login')}>Logar</button>
                <button onClick={() => nv('/home/entrar/cadastrar')}>Cadastrar</button>
            </div>
        </div>
    )
}

export default Info_Desconectado
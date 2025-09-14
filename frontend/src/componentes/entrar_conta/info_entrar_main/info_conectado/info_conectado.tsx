// Componentes, com tem como papel, mostrar o menu do user.
// EX: se ele estive logado, vamos mostrar o nome, por enquanto apenas o nome.
// se nao estive logado, vamos mostrar o mesmo um botao, pra registrar, que vai redirencionar o mesmo para area de login.
import './info_conectado.scss'

function Info_Conectado({nome_user}: {nome_user: string}) {
    return (
        <div className="conteiner-info-conectado">
            <h3 className='NomeUser-info-conectado'>{nome_user}</h3>
            <div className='info-conectado-points'>
                <p>Pontos</p>
                <p>1000</p>
            </div>
        </div>
    )
}

export default Info_Conectado
import './quiz-main.scss'
//componentes
import Main_Info_Entrar from '../entrar_conta/info_entrar_main/info_entrar_main'
import Head_Quiz_Inicio from './inicio-quiz/header-quiz-inicio/head_quiz-inicio'
import Selecionar_Tema from './inicio-quiz/selecionar_tema/selecionar_tema'

function Quiz_Main() {
    return (
        <div className="conteiner-quiz-main">
            <Main_Info_Entrar />
            <Head_Quiz_Inicio/>
            <Selecionar_Tema/>
        </div>
    )
}

export default Quiz_Main
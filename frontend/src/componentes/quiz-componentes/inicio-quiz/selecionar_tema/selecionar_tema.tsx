import './selecionar_tema.scss'
//componentes
import Card_Tema from './card-tema'

function Selecionar_Tema() {
    return (
        <div className="opcao-tema-quiz-main">
            <h1>Selecione um tema</h1>
            <div className='opcao-tema'>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
                <Card_Tema Nome_Tema='Matematica'/>
            </div>
        </div>
    )
}

export default Selecionar_Tema
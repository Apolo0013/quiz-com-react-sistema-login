import { useNavigate } from 'react-router-dom'
import './home.scss'
//react 
import { useContext, useEffect } from 'react'
//Context
import { InfoContext } from '../context'
//Componentes
import Main_Info_Entrar from './entrar_conta/info_entrar_main/info_entrar_main'

function Home() {
    const nv = useNavigate()
    const Info  = useContext(InfoContext)
    useEffect(() => {
        
    })
    return (
        <div className="wraper-conteiner-home">
            <Main_Info_Entrar/>
            <div className="conteiner-home">
                <h1 className='home-titulo'>Bem-vindo ao Quiz!</h1>
                <p className='home-subtitulo'> Teste seus conhecimentos respondendo perguntas divertidas.</p>
                <button className='home-button-iniciar' onClick={
                    () => {
                        if (!Info?.info_entrar.Logado) {
                            nv('/home/entrar/login')
                        }
                        else {
                            nv('/quiz/jogar')
                        }
                    }}>Inciar</button>
            </div>
        </div>
    )
}

export default Home
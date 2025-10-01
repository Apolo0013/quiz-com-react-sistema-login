//////////////////////////////////////////////////////////////////
// React Versao 18
//////////////////////////////////////////////////////////////////


import "./App.scss"
//Rotas
import { Routes, Route, Navigate } from 'react-router-dom'
//Componentes
import Cadastrar from "./componentes/entrar_conta/cadastrar/cadastrar"
import Logar from "./componentes/entrar_conta/logar/logar"
import Home from "./componentes/home"
import Info_Entrar_Main from "./componentes/entrar_conta/info_entrar_main/info_entrar_main"
import Quiz_Main from "./componentes/quiz-componentes/quiz-main"

//Notificacao
import Notificacao from "./componentes/notificacao/notificacaoProvider"
//Context
import { InfoContext } from "./context"
import { useEffect, useState } from "react"
//type
import { type typeInfoEntrar } from "./types/ContextLogin"


function AppMain() {
    async function UserLogadoCookie() {
        try {
            const request = await fetch('http://localhost:5239/AutoLogin', {
                method: 'GET',
                credentials: 'include'
            })
            type typeReturnUserLogadoCookie = {
                userName: string,
                error: boolean,
                info: string
            }
            // error for false que dizer que nao ouve error.
            // ou seja tem um token do usuario la, que quer dizer que ele fez login anteriomente.
            const resposta: typeReturnUserLogadoCookie = await request.json()
            console.log(resposta)
            if (!resposta.error) {
                SetInfoEntrar({
                    Logado: true,
                    Nome: resposta.userName
                })
                console.log('valor add')
            }
            else {
                // Por padrao ele sera assim, mas vamos garanti que ele estara quando o usuario nao estive o login automatico.  
                SetInfoEntrar({
                    Logado: false,
                    Nome: ''
                })
            }
        }
        catch (error) {
            console.log('Erro funcao User')
            console.log(error)
            //se deu algo errado manteremos o valor padrao
            SetInfoEntrar({
                Logado: false,
                Nome: ''
            })
        }
    }

    //funcao vai vai deletar o cookie do client.
    async function SairConta() {
        try {
            const request = await fetch('http://localhost:5239/SairConta', {
                method: 'GET',
                credentials: "include"
            })
            // a resposta do backend sempre sera essa.
            const resposta: { sucesso: boolean, error: 'nenhum' } = await request.json()
            console.log(resposta)
        }
        catch (error) {
            console.log('Error funcao SairConta')
            console.log(error)
        }
    }

    const [StateInfoEntrar, SetInfoEntrar] = useState<typeInfoEntrar>({
            Logado: true,
            Nome: 'Bucetinha.com.br.chupa.cu'
        }) 

    useEffect(() => {
        //UserLogadoCookie()
    }, [])

    useEffect(() => {
        console.log(StateInfoEntrar)
    }, [StateInfoEntrar])
    return (
        <InfoContext.Provider value={{
            info_entrar: StateInfoEntrar,
            SetInfoContext: SetInfoEntrar
        }}>        
            <div className="App-Main">
                {/*Componentes global*/}
                <Notificacao/>
                {/*Rotas*/}
                <Routes>
                    <Route path='*' element={<Navigate to='/home' replace />}></Route>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/home/entrar/login' element={<Logar />}></Route>
                    <Route path='/home/entrar/cadastrar' element={<Cadastrar />}></Route>
                    <Route path='/quiz/jogar' element={<Quiz_Main/>}></Route>
                </Routes>
            </div>
        </InfoContext.Provider>
    )
}

export default AppMain
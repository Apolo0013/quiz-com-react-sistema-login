//CSS
import '../entrar.scss'
import './logar.scss'
//react
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState, type JSX } from 'react'
//utils
import { AddError, AddErrorInput, VerificarEntradas } from '../utils-entrar_conta'
//Types
import { type elinput } from '../../../types/RefTypes'
import { type typeReturnErrorBackendLogar } from '../../../types/Entrar_Conta'
import { InfoContext } from '../../../context'
//notificacao
import { Notifica } from '../../notificacao/notificar'
//componentes
import Carregando_Tela_Entrar from '../carregando-tela'
import type { typeContextGlobal } from '../../../types/ContextLogin'


function Login() {
    async function EntrarResquest(dados: { nome: string, senha: string, lembrar_login: boolean }) {
        //Esta rodando
        SetRunLogin(true)
        try {
            const request = await fetch('http://localhost:5239/Entrar/Logar', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
                credentials: 'include'
            })
            //Esparando para converte em json
            const resposta: typeReturnErrorBackendLogar = await request.json()
            if (resposta.error === 'user_nao_registrado') {
                // add error na div  error.
                AddError({ text: "Nenhum registro encontrado para essa conta.", ElError: RefError.current })
                // add error nos input nome e senha
                AddErrorInput(RefInputNome.current)
                AddErrorInput(RefInputSenha.current)
                //aviso rapidao
                Notifica.error({ text: 'Não registrado.', duracao: 2 })
                return
            }
            else if (resposta.error == "date_error") {
                // add error na div  error.
                AddError({ text: "Algo deu errado com banco de dados.", ElError: RefError.current })
                // add error nos input nome e senha
                AddErrorInput(RefInputNome.current)
                AddErrorInput(RefInputSenha.current)
                //aviso rapidao
                Notifica.error({ text: 'falha em entrar contato com banco de dados.', duracao: 2 })
                return
            }
            else if (resposta.error === 'nenhum') {
                Notifica.sucesso({ text: 'Logado com sucesso.' })
                //Deu tudo certo, o usuario entrou na conta.
                //agora o valor global Logado sera true
                //info nao esta sendo Mandado backendp
                SetInfoContext({
                    Logado: true,
                    Nome: resposta.info.nome,
                    Pontos: resposta.info.pontos
                })
                //Direcionando o mesmo para o quiz
                nv("/home/quiz/jogar")
                return
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            SetRunLogin(false)
        }
    }

    function Entrar() {
        EntrarResquest({nome: 'nao sei', senha: '123', lembrar_login: true})
        return 
        // verificando se nenhum, ref é null
        if (!RefError.current || !RefInputNome.current || !RefInputSenha.current || !RefCheckBoxLembrarLogin.current) { return }
        // pegandos o valor do RefInput
        const nomevalue: string = RefInputNome.current!.value
        const senhavalue: string = RefInputSenha.current!.value
        // verificando as entradas pae
        // se for false -> tem alguam errada nas entradas
        // se for true -> ta tudo certo com as entradas
        const sucess: boolean = VerificarEntradas({
            nome: nomevalue,
            senha: senhavalue,
            ElNome: RefInputNome.current,
            ElSenha: RefInputSenha.current,
            ElError: RefError.current
        })
        if (sucess) {
            EntrarResquest({ nome: nomevalue, senha: senhavalue, lembrar_login: RefCheckBoxLembrarLogin.current })
        }
    }

    //State que vai contralar o componentes <Carregando_Tela_Entrar/>
    const [StateLoadComponente, SetLoadComponente] = useState<JSX.Element | ''>('')
    
    //a variavel que vai carregar o valor bool, falando se a  requsicao de fazer login ta em andamento. ou nao pae.
    const [StateRunLogin , SetRunLogin] = useState<boolean>(false)
    //Navigate
    const nv = useNavigate()
    // ref da div error
    const RefError = useRef<HTMLDivElement | null>(null)
    // refs input
    const RefInputNome = useRef<elinput>(null)
    const RefInputSenha = useRef<elinput>(null)
    //ref do checkbox, para lembrar o login ou nao pae.
    const RefCheckBoxLembrarLogin = useRef<elinput | null>(null)
    //Context
    //pegando o valor Logado.
    const {info_entrar, SetInfoContext} = useContext<typeContextGlobal | null>(InfoContext)!
    //Estamos chamando um effect com valor "Logado", ele quando trocamos de rota, esse valor sera atualizando para o valor.
    // EX: chamar o context denovo, por padrao InfoLogin temo "Logado" false, mas ele vai atualizando depois de um tempo. 
    useEffect(() => {
        if (info_entrar.Logado) {nv('/home')}
    }, [info_entrar.Logado])
    
    useEffect(() => {
        //Esta em processo de requisicao.
        if (StateRunLogin) {
            SetLoadComponente(<Carregando_Tela_Entrar />)
        }
        //nao esta em processo de requisicao.
        else {
            SetLoadComponente('')
        }
    }, [StateRunLogin])
    return (
        <div className="wraper-conteiner-login">
            {StateLoadComponente}
            <div className="conteiner-entrar">
                <h1>Entrar</h1>
                <div className="entrar-entradas">
                    <div className="entrada">
                        <label htmlFor="nome">Nome</label>
                        <input ref={RefInputNome} type="text" id="nome" placeholder='Digite seu nome'/>
                    </div>
                    <div className="entrada">
                        <label htmlFor="senha">Senha</label>
                        <input ref={RefInputSenha} type="text" id='senha' placeholder='Digite sua senha'/>
                    </div>
                </div>
                <div className='Salva-Auto-Login'>
                    <input ref={RefCheckBoxLembrarLogin} type="checkbox" />
                    <p>Lembrar meu login</p>
                </div>
                <div ref={RefError} className="error-entradas">
                </div>
                <div className="botao-entrar">
                    <button onClick={Entrar}>Login</button>
                    <p>Não tem uma conta? <strong onClick={() => nv('/home/entrar/cadastrar')}>Cadastrar</strong></p>
                </div>
            </div>
        </div>
    )
}

export default Login
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState, type JSX, type RefObject } from 'react'
//styles
import './cadastrar.scss'
import '../entrar.scss'
//utils
import { VerificarEntradas, AddError, AddErrorInput } from '../utils-entrar_conta'
//types
import { type elinput } from '../../../types/RefTypes'
import { type typeNomeESenha, type typeReturnErrorBackend } from '../../../types/Entrar_Conta'
//Context
import { InfoContext } from '../../../context'
//Notificacao
import { Notifica } from '../../notificacao/notificar'
import Carregando_Tela_Entrar from '../carregando-tela'

function Cadastrar() {
    async function RegistrarResquest(dados: typeNomeESenha) {
        //esta em uma requisicao
        SetRunCadastrar(true)
        try {
            const resquest = await fetch("http://localhost:5239/Entrar/RegistrarUser", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            })
            //transformando a resposta em dicionario/object
            const resposta: typeReturnErrorBackend = await resquest.json()
            if (resposta.error === 'nenhum') {
                //vamos limpar a div error, mesmo nao tendo error pae.
                AddError({ limpar: true })
                //Notificando o mesmo que o registro foi um sucesso
                Notifica.sucesso({text: 'Registrado com sucesso.'})
                return
            }
            else if (resposta.error === 'nome_em_uso') {
                AddError({ text: "Esse nome de usuário já está em uso.", ElError: RefError.current})
                //add o warn no input nome
                AddErrorInput(RefInputNome.current)               
                return 
            }
            else if (resposta.error === 'error_ao_registrar') {
                AddError({text: "Ocorreu um erro ao registrar. Tente novamente.", ElError: RefError.current})
                return
            }
        }
        catch (error) {
            console.log("Error funcao RegistrarResquest")
            console.log(error)
        }
        finally {
            setTimeout(() => SetRunCadastrar(false), 5000)
        }
    }

    
    function Registrar() {
        RegistrarResquest()
        return
        //Verificando se os ref nao sao null
        if (!RefInputNome.current || !RefInputSenha.current || !RefInputSenhaNovamente.current || !RefError.current) { return }
        //valores dos input paizao
        const nomevalue: string = RefInputNome.current!.value
        const senhavalue: string = RefInputSenha.current!.value
        const senhanovamentevalue: string = RefInputSenhaNovamente.current!.value
        //verificando entradas
        const sucess: boolean = VerificarEntradas({
            nome: nomevalue,
            senha: senhavalue,
            senhanovamente: senhanovamentevalue,
            ElNome: RefInputNome.current,
            ElSenha: RefInputSenha.current,
            ElSenhaNovamnete: RefInputSenhaNovamente.current,
            ElError: RefError.current
        })
        if (sucess) {
            RegistrarResquest({nome: nomevalue, senha: senhavalue})
            return
        }
    }

    // State para mostrar a tela de load pae.
    const [StateLoadComponente, SetLoadComponente] = useState<JSX.Element | ''>('')
    // State que vai guardar a variavel que diz se esta em uma requisicao ou nao/
    const [StateRunCadastrar, SetRunCadastrar] = useState<boolean>(false)
    const nv = useNavigate()
    //ref da div que sinalizar o error paizao
    const RefError = useRef<HTMLDivElement | null>(null)
    //Ref entradas
    const RefInputNome = useRef<elinput>(null)
    const RefInputSenha = useRef<elinput>(null)
    const RefInputSenhaNovamente = useRef<elinput>(null)
    //Context
    //const infologin = useContext(InfoLogin)
    useEffect(() => {
        if (StateRunCadastrar) {
            SetLoadComponente(<Carregando_Tela_Entrar/>)
        }
        else {
            SetLoadComponente('')
        }
    }, [StateRunCadastrar])
    return (
        <div className="wraper-conteiner-cadastrar">
            {StateLoadComponente}
            <div className="conteiner-entrar">
                <h1>Cadastrar</h1>
                <div className="entrar-entradas">
                    <div className="entrada">
                        <label htmlFor="nome">Nome</label>
                        <input ref={RefInputNome} type="text" id="nome" placeholder='Digite seu nome'/>
                    </div>
                    <div className="entrada">
                        <label htmlFor="senha">Senha</label>
                        <input ref={RefInputSenha} type="text" id='senha' placeholder='Digite seu nome'/>
                    </div>
                    <div className="entrada">
                        <label htmlFor="senha novamente">Confirme a senha</label>
                        <input ref={RefInputSenhaNovamente} type="text" id='senha novamente' placeholder='Digite sua novamente'/>
                    </div>
                </div>
                <div className='error-entradas' ref={RefError}>
                </div>
                <div className="botao-entrar">
                    <button onClick={Registrar}>Cadastrar</button>
                    <p>Você já tem conta? <strong onClick={() => nv('/home/entrar/login')}>Entrar</strong></p>
                </div>
            </div>
        </div>
    )
}

export default Cadastrar
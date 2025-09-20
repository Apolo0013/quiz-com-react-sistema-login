import './info_entrar_main.scss'
//componentes
import Info_Conectado from './info_conectado/info_conectado'
import Info_DesConectado from './info_desconectado/info_desconectado'
//react
import { useContext, useEffect, useRef, useState, type JSX } from 'react'
//context
import { InfoContext } from '../../../context'
//type
import { type typeInfoEntrar } from '../../../types/ContextLogin'
//imagens
import ImgLeftArrow from '../../../assets/imagens/info_entrar/left-arrow.svg'

function Main_Info_Entrar() {
    function ClickShowOrHide() {
        //Garantido que os ref nao sao null.
        if (!RefConteinerWraperInfo.current || !RefImgShowWraper.current) { return }
        //
        if (RefClickShowEHide.current) {
            //
            RefImgShowWraper.current!.style.transform = 'scaleX(-1)'
            //rect, pegamos a largura do elemento wraper
            const { width } = RefConteinerWraperInfo.current!.getBoundingClientRect()
            //Add o transform nele pra ele se esconder pae.
            RefConteinerWraperInfo.current!.style.transform = `translateX(-${width}px)`
            //Mudando o valor do Ref que indentifica o estado atual do conteiner.
            //Para false: olha ele esta escondido
            RefClickShowEHide.current = false
        }
        else {
            //
            RefImgShowWraper.current!.style.transform = 'scaleX(1)'
            //Add o transform que faz o mesmo fica a mostrar.
            RefConteinerWraperInfo.current.style.transform = 'translateX(0px)'
            //Mudando o valor ref que indedntifca o estado atual do conteiner.
            //Para true: ele esta a mostrar.
            RefClickShowEHide.current = true
        }
    }


    //Refs
    //Refs elementos
    const RefImgShowWraper = useRef<HTMLImageElement | null>(null)
    const RefConteinerWraperInfo = useRef<HTMLDivElement | null>(null)
    //Ref variavels
    // False, ele esta escondido
    // True ele esta a mostrar.
    const RefClickShowEHide = useRef<boolean>(false)
    //
    const [StateComInfo, SetComInfo] = useState<JSX.Element>()
    //context
    const info = useContext(InfoContext)
    useEffect(() => {
        ClickShowOrHide()
        //
        const info_entrar: typeInfoEntrar = info!.info_entrar
        console.log(info)
        if (info_entrar.Logado) {
            SetComInfo(<Info_Conectado nome_user={info_entrar.Nome}/>)
        }
        else {
            SetComInfo(<Info_DesConectado/>)
        }
    }, []) 

    return (
        <div className="wraper-conteiner-info-main" ref={RefConteinerWraperInfo}>
            <div className="conteiner-info-main">
                {StateComInfo}
            </div>
            <span className="show-conteiner-info-main" onClick={ClickShowOrHide}>
                <img ref={RefImgShowWraper} src={ImgLeftArrow} alt="Left Arrow" />
            </span>
        </div>
    )
}

export default Main_Info_Entrar
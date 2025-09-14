import './notificacaoProvider.scss'
//react
import { useEffect, useRef } from 'react'
//Notofica
import { Notifica } from './notificar'



function Notificacao() {
    function SetStyle(style: string) {
        //garanti que RefCOnteinerNotificao nao é null
        if (!RefConteinerNotificacao.current) { return }
        let styleSet: string = ''
        if (style === 'sucesso') {
            styleSet = 'style-aviso-sucesso'
        }
        else if (style === 'error') {
            styleSet = 'style-aviso-error'
        }
        RefConteinerNotificacao.current.classList.add(styleSet)
    }


    function NotificaWarn(text: string, style: 'error' | 'sucesso', duracao: number = 3) {
        function RetirarAllStyle() {
            //Retirando todos o style presente.
            RefConteinerNotificacao.current?.classList.remove("style-aviso-error")
            RefConteinerNotificacao.current?.classList.remove("style-aviso-sucesso")
        }

        //se RefConteinerNotificacao for null, pq ele ainda nao se referencio ao elemento pae.
        if (!RefConteinerNotificacao.current || !RefParagrafoNotificacao.current) { return }
        //add style
        SetStyle(style)
        //Alterando o texto
        RefParagrafoNotificacao.current!.textContent = text
        //
        RefConteinerNotificacao.current.classList.remove('class-anine-aviso-desshow')
        RefConteinerNotificacao.current?.classList.add('class-anime-aviso-show')
        setTimeout(() => {
            RefConteinerNotificacao.current?.classList.remove('class-anime-aviso-show')
            RefConteinerNotificacao.current?.classList.add('class-anine-aviso-desshow')
            setTimeout(() => RetirarAllStyle(), 1000)
        }, duracao * 1000)
    }


    //conteiner aviso
    const RefConteinerNotificacao = useRef<HTMLDivElement | null>(null)
    //paragrafo da notificao
    const RefParagrafoNotificacao = useRef<HTMLParagraphElement | null>(null)
    useEffect(() => {
        Notifica.sucesso = ({text, duracao = 3}) => NotificaWarn(text, 'sucesso', duracao)
        Notifica.error = ({text, duracao = 3}) => NotificaWarn(text, 'error', duracao)
    }, [])
    return (
        <div className="conteiner-notificacao" ref={RefConteinerNotificacao}>
            <p ref={RefParagrafoNotificacao}></p>
        </div>
    )
}

export default Notificacao
namespace BackEnd.Type.DateQuiz
{    
    //Ondem nois vair retorna o quiz.
    //Matematica, Fisica e Quimica nois vai trata aqui.
    //Assim como os outro. Oq citei anteriormente sao excecao.
    //================================Type================================
    //Type: objetiva da math dados.objetiva[conteudo]
    using TypeObjetivaDateMath = System.Collections.Generic.List<ObjetivaQuizMathJson>;
    //Type: Descubrar palavrva, padrao pros tipo de quiz dados.descubrar_palavra[conteudo]
    using TypeDescubrarPalavraDate = System.Collections.Generic.List<Descubrar_PalavraDate>;
    //Type: conteudo do dados.objetiva[conteudo]
    using TypeObjetivaDate = System.Collections.Generic.List<ObjetivaQuizDate>;
    //====================================================================
    
    //Retorno do  JSON
    //Retorno do quiz normal objetiva e descubrar_palavra
    class DateJsonTipo
    {
        public TypeObjetivaDate objetiva { set; get; }
        public TypeDescubrarPalavraDate descobrir_palavra  {set; get;}
    }

    //Usada para pergunta objetivas para Quiz normal, sem ser tema com tem base a matematica
    class ObjetivaQuizDate
    {
        public string pergunta { set; get; } = "";
        public ObjetivaQuizDateAlternativas? alternativas { set; get; }
        public string resposta_certa { set; get; } = "";
    }

    //Retorno do json
    class DateJsonReturnType
    {
        public DateJsonTipo facil { set; get; }
        public DateJsonTipo medio { set; get; }
        public DateJsonTipo dificil { set; get; }
    }

    //GetQuizMath: retorno dele.
    //GetQuiz:retorno dele.
    class QuizType
    {
        public List<ObjetivaQuizDate> objetiva { set; get; }
        public List<Descubrar_PalavraDate> descubrar_Palavras { set; get; }
    }

    //===================Tipos do Quiz Math=======================
    //retorno do Json para tema que tem como base a metematica...
    class DateJsonTipoMath
    {
        public TypeObjetivaDateMath objetiva { set; get; }
        public TypeDescubrarPalavraDate descobrir_palavra { set; get; }
    }

    //Retorno do Json, para os tema como quimica, matematica e fisica.
    class ObjetivaQuizMathJson
    {
        public string tipo { get; set; } = "";
        public string pergunta { get; set; } = "";
        public string formula { get; set; } = "";
        public string assunto { set; get; } = "";
    }

    //Essa é o Quiz math objetiva final.
    class ObjetivaQuizDateMath
    {
        public string pergunta { set; get; } = "";
        public ObjetivaQuizDateAlternativas? alternativas { set; get; }
        public string resposta_certa { set; get; } = "";
        //essa formula terar um replace retirando as chaves {} dele ex:
        // {ρ} * {g} * {h} === p * g * h
        public string formula { set; get; } = "";
        public string assunto { set; get; } = "";
    }

    class QuizTypeMath
    {
        public List<ObjetivaQuizDateMath?> objetiva { set; get; }
        public List<Descubrar_PalavraDate?> descubrar_palavra { set; get; }
    }

    //Retonro do json Math
    class DateJsonReturnTypeMath
    {
        public DateJsonTipoMath facil { get; set; }
        public DateJsonTipoMath medio { set; get; }
        public DateJsonTipoMath dificil { set; get; }
    }

    //==============================================================
    //=======================Outros tipos===========================
    
    //Usada para tipoas as alternativas
    class ObjetivaQuizDateAlternativas
    {
        public string A { set; get; } = "";
        public string B { set; get; } = "";
        public string C { set; get; } = "";
        public string D { set; get; } = "";
    }

    //Tipo, do Descubrar palavra
    class Descubrar_PalavraDate
    {
        public string palavra { get; set; } = "";
        public string dica { get; set; } = "";
    }
}   
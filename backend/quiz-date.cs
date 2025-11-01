using System;
using System.Text.Json;
using System.Text.Encodings.Web;
using System.Collections.Generic;
using NCalc;
using System.Data;
using BackEnd.Utils;
using BackEnd.Type.DateQuiz;

//Outros tipos
//...

namespace BackEnd.Date.Quiz
{

    //Config JsonSerializer
    class Date_Quiz
    {
        public static JsonSerializerOptions configjson = new JsonSerializerOptions()
        {
            WriteIndented = true, // deixa bonito com identação
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
        //==============================================================================
        //Funcao que vai retorna o date quiz, Matematica, Quimica e fisica
        //Math, estou me refererindo a esses tema que tem como base a matematica.
        public static DateJsonTipoMath? GetQuizDateMath(string Dificuldade, string Tema)
        //path: vai receber uns da variavel Path
        //Como: Path_Quimica, Fisica e Matematica
        {
            string jsonstring = File.ReadAllText(GetPathRelative(@$"date quiz\{Tema}"));
            DateJsonReturnTypeMath dados = JsonSerializer.Deserialize<DateJsonReturnTypeMath>(jsonstring, configjson)!;
            if (dados == null) { return null; }
            //Pergunta
            DateJsonTipoMath Perguntas = null;
            //Pegandos as pergunta pae.
            switch (Dificuldade)
            {
                case FuncUtils.FACIL:
                    Perguntas = dados.facil;
                    break;
                case FuncUtils.MEDIO:
                    Perguntas = dados.medio;
                    break;
                case FuncUtils.DIFICIL:
                    Perguntas = dados.dificil;
                    break;
            }
            return Perguntas;
        }

        //Funcao que retorna o json com quiz normal, com quiz staticos, diferente dos math, que sao quiz dinamicos, que quase nunca serao iguais.
        public static DateJsonTipo? GetQuizDate(string Dificuldade, string Tema)
        {
            string jsonstring = File.ReadAllText(GetPathRelative(@$"date quiz\{Tema}"));

            DateJsonReturnType dados = JsonSerializer.Deserialize<DateJsonReturnType>(jsonstring)!;
            if (dados == null) return null;
            DateJsonTipo Perguntas = null;
            switch (Dificuldade)
            {
                case FuncUtils.FACIL:
                    Perguntas = dados.facil;
                    break;
                case FuncUtils.MEDIO:
                    Perguntas = dados.medio;
                    break;
                case FuncUtils.DIFICIL:
                    Perguntas = dados.dificil;
                    break;
            }
            return Perguntas;
        }

        public static string GetPathRelative(string path_relative)
        {
            //path_relative: receber string como "backend\date quiz\Fisica.json" 
            string BasePath = AppDomain.CurrentDomain.BaseDirectory;
            //Motivo para voltar duas casas: bin\Debug\net8.0\, estamos ignorando esse caminho na hora de exercuta.
            string path = Path.Combine(BasePath, @"..\..\..\", path_relative);
            return Path.GetFullPath(path);
        }
        
        //GetQuizMath
        public static QuizTypeMath? GetQuizMath(string Tema, string Dificuldade)
        //Tem como funcao retorna Quiz, so que adpitada para os tema que tem como base a matematica, como: quimica, fisica e matematica.
        {
            //Funcao: retorna as pergunta objetiva.
            DateJsonTipoMath Perguntas = GetQuizDateMath(Dificuldade, Tema)!;
            if (Perguntas == null) return null;
            //Sorteando Lista
            List<string> ListQuizSort = FuncUtils.SortQuizType();
            Console.WriteLine(JsonSerializer.Serialize(ListQuizSort));
            //Lista ondem vao contem os quizes seperados
            //A mais tarde ela serar subituida pelo (ListFinalObjetiva)
            List<ObjetivaQuizMathJson> ListaQuizObjetiva = new List<ObjetivaQuizMathJson>();
            //Por padrao ele nao serar modificada
            List<Descubrar_PalavraDate> ListaQuizDescubrar_Palavra = new List<Descubrar_PalavraDate>();
            //Pegando as perguntas
            foreach (string target in ListQuizSort)
            {
                if (target == FuncUtils.OBJETIVA)
                {
                    while (true)
                    {
                        //Sorteando o quiz paeeeeeeeeeeeeeeeeeeee.
                        ObjetivaQuizMathJson sortquiz = Perguntas.objetiva[FuncUtils.random.Next(0, Perguntas.objetiva.Count)];
                        //Se esse quiz ja foi sorteado vamos sorotea outro.
                        //Se o tipo da questao for diferente
                        if (!ListaQuizObjetiva.Any(info => info.tipo == sortquiz.tipo))
                        {
                            //Se ele nunca foi sorteado arroche.
                            ListaQuizObjetiva.Add(sortquiz);
                            break;
                        }

                    }
                }
                else if (target == FuncUtils.DESCUBRAR_PALAVRA)
                {
                    //aqui vamos diferencia pelo palavra, nao pode se repetidas pae.
                    while (true)
                    {
                        Descubrar_PalavraDate sortquiz = Perguntas.descobrir_palavra[FuncUtils.random.Next(0, Perguntas.descobrir_palavra.Count)];
                        //Se nao tive pergunta repetida.
                        if (!ListaQuizDescubrar_Palavra.Any(info => info.palavra == sortquiz.palavra))
                        {
                            ListaQuizDescubrar_Palavra.Add(sortquiz);
                            break;
                        }
                    }
                }
            }
            //Em Relacao ao Objetiva math, que sao diferente:
            // ObjetivaQuizDateMath //
            //Objetiva para Tema que tem base a matematica
            //Fisica, Matematica e Quimica.
            //Vao contem como valores
            //pergunta (string)
            //altenativas (ObjetivaQuizDateAlternativas)
            //resposta certa (string)
            //--- Importante para o usuario consiguir responde.
            //formula (string)
            //Assunto (string)
            ////////////////////////////////////////////////////
            /// Sabendo disso, vamos alterar a lista da objetiva, pq por padrao ele vem com tipo (ObjetivaQuizMathDate). Vamos tranforma para aquele que acabei de cita.
            /////////////////////////////////////////////////////
            List<ObjetivaQuizDateMath> ListFinalObjetiva = new List<ObjetivaQuizDateMath>();
            //ABCD
            List<string> ABCD = new List<string>() { "A", "B", "C", "D" };
            foreach (ObjetivaQuizMathJson info in ListaQuizObjetiva)
            {
                //Preparando pergunta
                //NumeroVar: vai guardar  os numero sorteado da continha.
                List<int> NumerosVar = new List<int>();
                //Sorteado numero e add no NumeroVar
                for (int i = 0; i < FuncUtils.GetCountChaves(info.pergunta); i++)
                {
                    NumerosVar.Add(FuncUtils.random.Next(10, 20));
                }
                //Pergunta preparada
                string Pergunta = FuncUtils.GetReplaceNumero(NumerosVar, info.pergunta);
                //===================
                //Preparando a resposat certa
                //Pegando o calculo. Ja subtituido eles pelo numeros sorteados
                string FormulaFormat = FuncUtils.GetReplaceNumero(NumerosVar, info.formula); // Ele vai sair ex: {ρ} * {g} * {h}" para 10 * 12 * 13
                //FormulaFormat = "6 / 2";
                Console.WriteLine(FormulaFormat);
                Expression expressao = new Expression(FormulaFormat);
                //caso a questao tenha PI
                expressao.Parameters["Pi"] = Math.PI;
                //Fazendo o caluclo
                object result = expressao.Evaluate()!;
                //Resposta certa
                string Resposta_Certa = "";
                //Valor Double temp
                double valor = Convert.ToDouble(result);
                //Preparando alternativas
                //Juntando com altenariva vamos pegar o calculo e resposta certa de acordo com numero sorteado gld.
                ObjetivaQuizDateAlternativas Alternativas = new ObjetivaQuizDateAlternativas();
                //Se ele for um numero int
                if (valor % 1 == 0)
                {
                    //Convertendo object para int
                    int result_int = Convert.ToInt32(result);
                    //Dando valores as alternativas
                    //List com as alternativas
                    List<int> AlternativasTemp = new List<int>()
                    {
                        result_int,
                        result_int + 10,
                        result_int + FuncUtils.random.Next(1, 3),
                        result_int + FuncUtils.random.Next(8, 10)
                    };
                    AlternativasTemp.Embaralhar();
                    //Resposta Certa pae
                    //Em ABCD, temos uma lista com A,B,C E D
                    //FindLastIndex: Vai procurar a resposta certa na lista ja embaralhada. Tem como como retorno o indice do mesmo.
                    //Como alternativas tem indices de 0 a 3, o  ABCD tambem tem, Assim revelando a resposta certa.
                    Resposta_Certa = ABCD[AlternativasTemp.FindLastIndex(x => x == result_int)];
                    //Colocando as Alternativas.
                    Alternativas.A = AlternativasTemp[0].ToString();
                    Alternativas.B = AlternativasTemp[1].ToString();
                    Alternativas.C = AlternativasTemp[2].ToString();
                    Alternativas.D = AlternativasTemp[3].ToString();
                }
                //senao ele é double
                else
                {
                    double result_double = Convert.ToDouble(result);
                    //Criando outro alternativas
                    List<double> AlternativasTemp = new List<double>()
                    {
                        result_double,
                        result_double + FuncUtils.random.Next(5, 7),
                        result_double + FuncUtils.random.Next(1, 3),
                        result_double + FuncUtils.random.Next(8, 10)
                    };
                    //Embaralhando a mesma
                    AlternativasTemp.Embaralhar();
                    //Pegando a alternativas certa.
                    Resposta_Certa = ABCD[AlternativasTemp.FindLastIndex(x => x == result_double)];
                    //Colocando as alternativas
                    Alternativas.A = AlternativasTemp[0].ToString("F1");
                    Alternativas.B = AlternativasTemp[1].ToString("F1");
                    Alternativas.C = AlternativasTemp[2].ToString("F1");
                    Alternativas.D = AlternativasTemp[3].ToString("F1");
                }



                ListFinalObjetiva.Add(
                    new ObjetivaQuizDateMath()
                    {
                        pergunta = Pergunta,
                        alternativas = Alternativas,
                        resposta_certa = Resposta_Certa,
                        assunto = info.assunto,
                        formula = info.formula
                            .Replace("{", "")
                            .Replace("}", "")
                    }
                );
            }
            ///Confiar, ele nao serao nulo.
            return new QuizTypeMath()
            {
                objetiva = ListFinalObjetiva!,
                descubrar_palavra = ListaQuizDescubrar_Palavra!
            };
        }

        public static QuizType? GetQuiz(string Tema, string Dificulade)
        {
            //Pegando dados do json
            //Dificulade e Tema
            DateJsonTipo dados = GetQuizDate(Dificulade, Tema)!;
            //Ele tem chance de retorna nulo, por alguam motivo, Entao:
            //Se dados for igual null returno null(olha algo de errado.)
            if (dados == null) return null;
            //Sorteado o tipo de quiz
            List<string> ListQuizSort = FuncUtils.SortQuizType();
            //Lista de Objetiva e Descubrar palavra
            List<ObjetivaQuizDate> ListaQuizObjetiva = new List<ObjetivaQuizDate>();
            List<Descubrar_PalavraDate> ListaQuizDescubrar_Palavra = new List<Descubrar_PalavraDate>();
            foreach (string target in ListQuizSort)
            {
                if (target == FuncUtils.OBJETIVA)
                {
                    //Pegando a pergunta
                    while (true)
                    {
                        //Sorteando um pergunta.
                        ObjetivaQuizDate sortquiz = dados.objetiva[FuncUtils.random.Next(0, dados.objetiva.Count - 1)];
                        //Vamos usar a pergunta como indentificador.
                        //Verificando se a pergunta sorteada, nao existir na lista que ondem fica as pergunta sorteadas.
                        if (!ListaQuizObjetiva.Any(info => info.pergunta == sortquiz.pergunta))
                        {
                            ListaQuizObjetiva.Add(sortquiz);
                            break;
                        }
                    }
                }
                else if (target == FuncUtils.DESCUBRAR_PALAVRA)
                {
                    //Pegando pergunta
                    while (true)
                    {
                        //Sorteando pergunta
                        Descubrar_PalavraDate sortquiz = dados.descobrir_palavra[FuncUtils.random.Next(0, dados.descobrir_palavra.Count - 1)];
                        //Aqui vamos uasr a palavra com indentificador do quiz.
                        //o quiz ainda nao exisir:
                        if (!ListaQuizDescubrar_Palavra.Any(info => info.palavra == sortquiz.palavra))
                        {
                            ListaQuizDescubrar_Palavra.Add(sortquiz);
                            break;
                        }
                    }
                }
            }

            return new QuizType()
            {
                objetiva = ListaQuizObjetiva,
                descubrar_Palavras = ListaQuizDescubrar_Palavra
            };
        }
    }
}

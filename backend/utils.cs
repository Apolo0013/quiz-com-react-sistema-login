using System;
using System.Collections.Generic;
using System.Text.Json;

namespace BackEnd.Utils {
    

    //BY: ChatGPT    
    public static class ListExtensions
    {
        private static Random random = new Random();

        public static void Embaralhar<T>(this IList<T> lista)
        {
            for (int i = lista.Count - 1; i > 0; i--)
            {
                int j = random.Next(i + 1);
                (lista[i], lista[j]) = (lista[j], lista[i]);
            }
        }
    }

    class FuncUtils
    {
        //Random
        public static Random random = new Random();
        //Palavras objetivas e descubrar_Palavras
        public const string OBJETIVA = "objetiva";
        public const string DESCUBRAR_PALAVRA = "descubra_palavra";
        //facil, medio e dificil
        public const string FACIL = "facil";
        public const string MEDIO = "medio";
        public const string DIFICIL = "dificil";


        public static void Main()
        {
            Console.WriteLine(GetReplaceNumero(new List<int>() { 1,2 }, "Em uma subtração, qual é o resultado de {X} - {Y}?"));
        }

        public static int GetCountChaves(string pergunta)
        //Ele tem como funcao quantas chaves {T} tem em um string.
        {
            //Contador
            int count = 0;
            for (int index = 0; index < pergunta.Length; index++)
            {
                //Pegando a letra
                string letra = (pergunta[index]).ToString();
                //Se a letra for uma chave, que dizer que estamos pegando um chave ou nao.
                if (letra == "{")
                {
                    //Verificar se ja chegamos no final da string.
                    bool End = false;
                    while (true)
                    {
                        //Letra
                        string nextletra = (pergunta[index]).ToString();
                        //Se for igual chave para direita. que dizer que chegamos ao fim do chave.
                        if (nextletra == "}")
                        {
                            count++;
                            break;
                        }
                        //Se index for igual o numero max dos indices da string "pergunta".
                        else if (index == pergunta.Length - 1)
                        {
                            //Vamos quebrar e Alterar o valor do para True(olha estamos no fim da string pode quebrar pae).
                            End = true;
                            break;
                        }
                        else index++;
                    }
                    if (End) break;
                }
            }
            return count;
        }

        public static string GetReplaceNumero(List<int> Numeros, string pergunta)
        //Ele subtituir, letra que estao  {A}, {B} e ...
        {
            Console.WriteLine(pergunta);
            int indexnumeros = 0;
            string TextFinal = "";
            for (int index = 0; index < pergunta.Length; index++)
            {
                string letraindex = pergunta[index].ToString(); // Letra da pergunta
                //Se letra é uma chave, entao sera algo pra nois subtituir
                if (letraindex == "{")
                {
                    //Quantos Indices devo pular?
                    while (true)
                    {
                        //Aqui estamos dentro do {} entao vamos pecorrer por eles.
                        letraindex = pergunta[index].ToString();
                        //se letraindex for igual a }(que se significa o fim da variavel).
                        //Perguntas 
                        //"Mas se ele é o final, nao devemos add +1 no indicao"
                        //Resposta: Nao. o for ja faz esse servico.
                        if (letraindex == "}") 
                        {
                            //Subtituir
                            TextFinal += Numeros[indexnumeros];
                            //Add +1 no indexnumeros, para o proximo numero da lista.
                            indexnumeros += 1;
                            break; 
                        }
                        //senao vamos add mais um indices
                        else
                        {
                            if (index + 1 > pergunta.Length - 1)
                            {
                                TextFinal += letraindex;
                                return TextFinal;
                            }
                            index++;
                        }
                        
                    }
                }
                //Caso ao contrario. Apenas add a letra que estava antes.
                else
                {
                    TextFinal += letraindex;
                }
            }
            return TextFinal;
        }

        //Essa funcao vai retorna O sorte em quiz objetiva e descubrar palavras
        public static List<string> SortQuizType()
        {
            List<string> ListQuizSort = new List<string>();
            while (true)
            {
                //Objetiva e descubra_Palavra
                for (int i = 0; i < 10; i++)
                {
                    ListQuizSort.Add(new List<string>() { OBJETIVA, DESCUBRAR_PALAVRA }[random.Next(0, 2)]);
                }
                //Se os indices tive OBJETIVA/DESCUBRAR_PALAVRA em todas os indices vamos sortea novamente.
                if (!ListQuizSort.All(x => x == OBJETIVA) || !ListQuizSort.All(x => x == DESCUBRAR_PALAVRA))
                {
                    return ListQuizSort;
                }
                else
                {
                    ListQuizSort.Clear();
                    //Continuar.
                }
            }
        }
    }
}







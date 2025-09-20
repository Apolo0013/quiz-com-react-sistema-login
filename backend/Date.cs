using System.Text;
using System.Text.Json;
//type
//using BackEnd.Type.BackInFront;
using BackEnd.Type.FrontInBack;

namespace BackEnd.Date.Manipular
{
    class DateJson
    {
        public static List<ParamDadosEntrar> PegarDados()
        {
            try
            {
                var jsonstr = File.ReadAllText("dados.json");
                var json = JsonSerializer.Deserialize<List<ParamDadosEntrar>>(jsonstr);
                if (json == null) return new List<ParamDadosEntrar>();
                return json;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error :" + ex.Message);
                //retornando um lista vazio afalando que deu error pae
                return new List<ParamDadosEntrar>();
            }
        }

        public static bool RegistrarUser(string nome, string senha)
        {
            // dados anterior
            List<ParamDadosEntrar> dadosafter = PegarDados();
            if (dadosafter.Count == 0) return false;
            dadosafter.Add(new ParamDadosEntrar { nome = nome, senha = senha });
            try
            {
                //indentando o json
                //opcao
                //opcao json
                var opcao = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };

                var jsonnew = JsonSerializer.Serialize(dadosafter, opcao);
                //add   
                File.WriteAllText("dados.json", jsonnew, Encoding.UTF8);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error funcao 'RegistrarUser'" + ex.Message);
                return false;
            }
        }


        public static bool ProcurarUserPeloNome(string nome)
        {
            // dados vindo do json
            List<ParamDadosEntrar> dados = PegarDados();
            // se a lista retorna uma lista vazio retorne
            if (dados.Count == 0) return false;
            foreach (var valor in dados)
            {
                if (valor.nome == nome)
                {
                    return true;
                }
            }
            return false;
        }


        public static bool UserEstaRegistrado(string nome, string senha)
        {
            List<ParamDadosEntrar> dados = PegarDados();
            //se vinhe uma lista vazia, retorne.
            if (dados.Count == 0) return false;
            foreach (ParamDadosEntrar info in dados)
            {
                // nome e senha recebido dos paramemtros, for igual a nome e senha de algum usuario dedntro do banco de dados. é pq essa usuario ja esta registrado.
                // e o usuario pode logar.
                if (info.nome == nome && info.senha == senha)
                {
                    return true;
                }
            }
            return false;
        }
    }

}
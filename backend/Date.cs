using System.Text;
using System.Text.Json;
//type
//using BackEnd.Type.BackInFront;
using BackEnd.Type.FrontInBack;
using BackEnd.Type.BackInFront;
using System.Text.Unicode;

namespace BackEnd.Date.Manipular
{
    class DateJson
    {
        public static JsonSerializerOptions opcao = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(UnicodeRanges.All)
                };

        public static async Task<List<TypeDateJson>?> PegarDados()
        {
            try
            {
                string jsonstr = await File.ReadAllTextAsync("dados.json");
                List<TypeDateJson> json = JsonSerializer.Deserialize<List<TypeDateJson>>(jsonstr, opcao)!;
                if (json == null) return null;
                return json;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error :" + ex.Message);
                //retornando um lista vazio afalando que deu error pae
                return null;
            }
        }

        public static async Task<bool> RegistrarUser(string nome, string senha, int pontos)
        {
            // dados anterior
            List<TypeDateJson>? dadosafter = await PegarDados()!;
            if (dadosafter is not null) return false;
            dadosafter!.Add(new TypeDateJson() { Nome = nome, Senha = senha, Pontos = pontos});
            try
            {
                //Serializando == tranformando em string
                string jsonnew = JsonSerializer.Serialize(dadosafter, opcao);
                //add   
                //Escrevedno
                await File.WriteAllTextAsync("dados.json", jsonnew, Encoding.UTF8);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error funcao 'RegistrarUser'" + ex.Message);
                return false;
            }
        }


        public static async Task<bool> ProcurarUserPeloNome(string nome)
        {
            // dados vindo do json
            List<TypeDateJson>? dados = await PegarDados()!;
            // se a lista retorna uma lista vazio retorne
            if (dados is not null) return false;
            //ele ele encontrar um com nome igual ao parametro nome, pq encontrou, retorna true, senao false
            return dados!.Any(x => x.Nome == nome);
        }


        public static async Task<bool> UserEstaRegistrado(string nome, string senha)
        {
            List<TypeDateJson>? dados = await PegarDados()!;
            //se vinhe uma lista vazia, retorne.
            if (dados is null) return false;
            return dados!.Any(x => x.Nome == nome && x.Senha == senha);
        }

        public static async Task<bool> SubtituirDados(TypeDateJson dados)
        //Essa funcao tem como responsabilidade de subtituir dados,
        //ele receber os dados ja alterado de um usuario e troca.
        //Lembrando que sao os mesmo usuario, dados, possivel de troca é a senha e o pontos, geral so pontos.
        {
            List<TypeDateJson>? date = await PegarDados()!;
            //Caso for null
            if (date is null) return false;
            //Pegando o index
            int indexuser = date.FindIndex(x => x.Nome == dados.Nome);
            //Alterando.
            date[indexuser] = dados;
            try
            {
                //Escrevendo no dados.json
                string jsonstring = JsonSerializer.Serialize(date, opcao);
                File.WriteAllText("dados.json", jsonstring, Encoding.UTF8);
                //Deu tudo certo pae
                return true;
            }
            //algo deu errado pae.
            catch { return false; }
        }
    }
}
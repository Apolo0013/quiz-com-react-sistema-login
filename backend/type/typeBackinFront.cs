using System.Text.Json.Serialization;

namespace BackEnd.Type.BackInFront
{
    class RespostaResultado
    {
        public bool Sucesso { get; set; }
        public string Error { get; set; } = "";
        public TypeInfoPlayer? Info { set; get; }
    }

    //Type Do Date.json
    public class TypeDateJson
    {
        [JsonPropertyName("nome")]
        public string Nome { set; get; } = "";
        [JsonPropertyName("senha")]
        public string Senha { set; get; } = "";
        [JsonPropertyName("pontos")]
        public int Pontos { set; get; }
    }

    //Retoro para o front
    //nome e pontos
    class TypeInfoPlayer
    {
        public string Nome { set; get; } = "";
        public int Pontos { set; get; }
    }
}
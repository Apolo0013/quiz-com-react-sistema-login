namespace BackEnd.Type.FrontInBack
{
    class ParamDadosEntrar
    {
        public string nome { get; set; } = "";
        public string senha { get; set; } = "";
        public bool lembrar_login { get; set; } = false;
    }


    class ParamGetTemaAndDificuldade
    {
        public string Tema { set; get; } = "";
        public string Dificuldade { get; set; } = "";
    }

    ///Quiz/User/Pontos
    /// Ele vai receber ID e o pontos para acrecentar
    class DadosPontosAcrecentar
    {
        public int Pontos { set; get; }
        public string Nome { set; get; } = "";
    }
}
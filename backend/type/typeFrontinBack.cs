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
}
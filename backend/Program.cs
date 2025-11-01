
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
//manipulacao arquivo
using BackEnd.Date.Manipular;
using BackEnd.Utils;
using BackEnd.Date.Quiz;
//type
using BackEnd.Type.BackInFront;
using BackEnd.Type.FrontInBack;
using System.Text.Json;
using BackEnd.Type.DateQuiz;




WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(opcao =>
    {
        opcao.AddPolicy("AllowAll",
            policy =>
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
        );
    });

var app = builder.Build();
//chave do cookie 
string key = "852wROKVwQgj64E8c7MOkZ1tyTQvySYtmdRb3SL7YDg";
//aplicao o CORS
app.UseCors("AllowAll");

app.MapPost("/Entrar/Logar", async (HttpContext ctx ,ParamDadosEntrar dados) =>
{
    //verificando se o usuario ja esta registrado
    bool UserRegistrado = await DateJson.UserEstaRegistrado(dados.nome, dados.senha);
    Console.WriteLine(UserRegistrado);
    //if (UserRegistrado || true)
    if (UserRegistrado)
    {
        // Se o usuario marcou a opcao de lembrar o login, vamos guardar as informacoes no cookie pae.
        if (dados.lembrar_login)
        {
            //Questao de seguranca 
            //Cookie
            var tokenHandler = new JwtSecurityTokenHandler();
            //Configurando Token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim("username", dados.nome)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            //Escrevendo e Criando token...
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);
            //Add o cookie
            ctx.Response.Cookies.Append("token", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // true se estive usando HTTPS
                SameSite = SameSiteMode.Strict
            });
        }
        //Pegar a informacoes do banco de dados
        List<TypeDateJson>? dateplayer = await DateJson.PegarDados()!;
        //player
        TypeDateJson? player = dateplayer!.FirstOrDefault(x => x.Nome == dados.nome);
        //Caso ele nao encotre algo de errado nao esta certo
        if ( player is null) Results.Ok(new RespostaResultado()
        {
            Sucesso = false,
            Error = "date_error"
        });
        //Pegando o Nome e os pontos
        TypeInfoPlayer infoplayer = new TypeInfoPlayer() { Nome = player!.Nome, Pontos = player!.Pontos };
        //retornando que deu tudo certo
        return Results.Json(new RespostaResultado { Sucesso = true, Error = "nenhum", Info = infoplayer});
    }
    //senao, que dizer que nao existi usuario registrado com essas informacoes
    else
    {
        Console.WriteLine("Nao tem nenhum usuario registrado com essa informacoes.");
        return Results.Json(new RespostaResultado { Sucesso = false, Error = "user_nao_registrado"});
    }
});

//Rota protejida
app.MapGet("/AutoLogin", async (HttpContext ctx) =>
{
    // tenta pegar o token, ondem contem o nome do usuario
    // se nao tive nada, é pq o usuario nunca se registrou pae.
    if (!ctx.Request.Cookies.TryGetValue("token", out var token))
    {
        return Results.Json(new { UserName = "", Error = true, info = "usuario nao logado ou sem token" });
    }

    //Acessando o Token e retornando o nome paizao
    var handler = new JwtSecurityTokenHandler();
    var jwtToken = handler.ReadJwtToken(token);
    var nome = jwtToken.Claims.First(c => c.Type == "username").Value;
    //-------
    //Pegando o index do usuario no jso
    List<TypeDateJson>? dados_json = await DateJson.PegarDados()!;
    //Pegando o index dele e pontos
    TypeDateJson? playerinfo = dados_json!.Find(x => x.Nome == nome);
    Console.WriteLine(JsonSerializer.Serialize(playerinfo));
    //Senao encontrar o ususario/player.
    if (playerinfo is null) return Results.Ok(new RespostaResultado()
    {
        Sucesso = false,
        Error = "not_found_user"
    });
    //se encontrou:
    return Results.Ok(new
    {
        UserName = nome,
        Pontos = playerinfo!.Pontos,
        Error = false,
        info = "usuario logado, token existente"
    });
});

//Deleta o cookiee, e sair da conta praticamente pae
app.MapGet("/SairConta", (HttpContext ctx) =>
{
    ctx.Response.Cookies.Delete("token");
    return Results.Json(new RespostaResultado { Sucesso = true, Error = "nenhum" });
});

//rota para registrar o usuario
app.MapPost("/Entrar/RegistrarUser", async (ParamDadosEntrar dados) =>
{
    //procurando o nome do usuario.
    // -> se encontrar entao o nome ja esta em uso.
    // -> se nao vamos registrar o mesmo
    bool NameRegistrer = await DateJson.ProcurarUserPeloNome(dados.nome);
    Console.WriteLine(NameRegistrer);
    if (NameRegistrer)
    {
        return Results.Json(new RespostaResultado { Sucesso = false, Error = "nome_em_uso" });
    }
    else
    {
        bool sucessoRegistrarUser = await DateJson.RegistrarUser(dados.nome, dados.senha, 0);
        if (sucessoRegistrarUser)
        {
            //deu tudo certo ao registrar
            return Results.Json(new RespostaResultado { Sucesso = sucessoRegistrarUser, Error = "nenhum" });
        }
        else
        {
            //Algo deu de errado ao tenta registrar.
            return Results.Json(new RespostaResultado { Sucesso = sucessoRegistrarUser, Error = "error_ao_registrar" });
        }
    }
});

//Rotas do quiz gld.
app.MapPost("Quiz/Pegar", async (ParamGetTemaAndDificuldade dados) =>
{
    //Por Algum motivo, Dificuldade e Tema for igual "" vamos return tentativas falha ou null
    if (dados.Tema == "" || dados.Dificuldade == "") return Results.Problem();

    //Nomes dos arquivo json de cada tema?
    //Porque disso?: por que no front end, os nomes do tema nao sao iguais aos nomes do arquivo json.
    const string Geografia = "Geografia.json";
    const string Historia = "História.json";
    const string Ciencia = "Ciências.json";
    const string Matematica = "Matemática.json";
    const string Cinema = "Cinema.json";
    const string Fisica = "Fisica.json";
    const string Quimica = "Quimica.json";
    const string Literatura = "Literatura.json";
    const string Tecnologia = "Tecnologia.json";
    const string Logica = "Logica.json";
    //dados vai receber:
    //string Tema,
    //string Dificuldade
    //    
    string? Dificuldade = default;
    string?Tema = default;
    //Pegando Dificuldade
    switch (dados.Dificuldade)
    {
        case "facil":
            Dificuldade = FuncUtils.FACIL;
            break;
        case "medio":
            Dificuldade = FuncUtils.MEDIO;
            break;
        case "dificil":
            Dificuldade = FuncUtils.DIFICIL;
            break;
    }

    //Pegando Tema pae.
    switch (dados.Tema)
    {
        case "Geografia":
            Tema = Geografia;
            break;
        case "História":
            Tema = Historia;
            break;
        case "Ciências":
            Tema = Ciencia;
            break;
        case "Matemática":
            Tema = Matematica;
            break;
        case "Cinema":
            Tema = Cinema;
            break;
        case "Fisica":
            Tema = Fisica;
            break;
        case "Quimica":
            Tema = Quimica;
            break;
        case "Literatura":
            Tema = Literatura;
            break;
        case "Tecnologia":
            Tema = Tecnologia;
            break;
        case "Logica":
            Tema = Logica;
            break;
    }

    Console.WriteLine(Dificuldade);

    if (Tema == Fisica || Tema == Matematica || Tema == Quimica)
    {
        //Nunca vao retorna null, confiar se retorno fudeu
        QuizTypeMath DateQuizMath = Date_Quiz.GetQuizMath(Tema, Dificuldade);
        //caso se ja null
        if (DateQuizMath is null) return Results.Ok(new RespostaResultado() { Sucesso = false, Error = "date_error" });
        return Results.Json(DateQuizMath);
    }
    else
    {
        QuizType DateQuiz = Date_Quiz.GetQuiz(Tema, Dificuldade);
        //caso seja null
        if (DateQuiz is null) return Results.Ok(new RespostaResultado() { Sucesso = false, Error = "date_error" });
        Console.WriteLine(JsonSerializer.Serialize(DateQuiz));
        return Results.Json(DateQuiz);
    }
});

//Rota que receber valor do  dados.
//Nome: ondem nois vai indentificar os mesmo
//Pontos: que vao sao acrecentrados.
app.MapPost("/Quiz/User/Pontos", async (DadosPontosAcrecentar dados) =>
{
    //10 tentantivas...
    for (int i = 0; i < 10; i++)
    {
        //pegando os dados do json atual.
        List<TypeDateJson>? date = await DateJson.PegarDados();
        //Se retorna nula pq algo deu errado
        if (date is null) continue;
        //Blz nao é nula.
        TypeDateJson? Info_User = date!.Find(x => x.Nome == dados.Nome);
        if (Info_User is null) continue;
        //Ja que pontos foi encontrado vamos apenas adicionar 
        //Acrecentando
        Info_User!.Pontos += dados.Pontos;
        //Vamos add...
        bool sucesso = await DateJson.SubtituirDados(Info_User);
        //Deu certo, entao vamos retorna que deu certo
        if (sucesso) return Results.Ok(new
        {
            Sucesso = true,
            Error = "nada"
        });
        //vixi barao, deu errado o, vai mais uma vez
        //quebrar, tenta denovo
        else continue;
    }
    //Se passou das 10 tentativas, de tenta add e algo deu errado...
    return Results.Ok(new RespostaResultado {Sucesso = false, Error="10 tentativas"});
});

app.Run();

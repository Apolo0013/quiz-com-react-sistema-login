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
//type
using BackEnd.Type.BackInFront;
using BackEnd.Type.FrontInBack;




var builder = WebApplication.CreateBuilder(args);
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

app.MapPost("/Entrar/Logar", (HttpContext ctx ,ParamDadosEntrar dados) =>
{
    //verificando se o usuario ja esta registrado
    bool UserRegistrado = DateJson.UserEstaRegistrado(dados.nome, dados.senha);
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
        //retornando que deu tudo certo
        return Results.Json(new RespostaResultado { Sucesso = true, Error = "nenhum" });
    }
    //senao, que dizer que nao existi usuario registrado com essas informacoes
    else
    {
        Console.WriteLine("Nao tem nenhum usuario registrado com essa informacoes.");
        return Results.Json(new RespostaResultado { Sucesso = false, Error = "user_nao_registrado" });
    }
});

//Rota protejida
app.MapGet("/AutoLogin", (HttpContext ctx) =>
{
    // tenta pegar o token, ondem contem o nome do usuario
    // se nao tive nada, é pq o usuario nunca se registrou pae.
    if (!ctx.Request.Cookies.TryGetValue("token", out var token))
    {
        return Results.Json(new {UserName = "", Error = true, info = "usuario nao logado ou sem token"});
    }

    //Acessando o Token e retornando o nome paizao
    var handler = new JwtSecurityTokenHandler();
    var jwtToken = handler.ReadJwtToken(token);
    var nome = jwtToken.Claims.First(c => c.Type == "username").Value;
    //Testa isso ai, e entenda essa porra
    return Results.Ok(new {UserName = nome, Error = false , info = "usuario logado, token existente"});
});

//Deleta o cookiee, e sair da conta praticamente pae
app.MapGet("/SairConta", (HttpContext ctx) =>
{
    ctx.Response.Cookies.Delete("token");
    return Results.Json(new RespostaResultado { Sucesso = true, Error = "nenhum" });
});

//rota para registrar o usuario
app.MapPost("/Entrar/RegistrarUser", (ParamDadosEntrar dados) =>
{
    //procurando o nome do usuario.
    // -> se encontrar entao o nome ja esta em uso.
    // -> se nao vamos registrar o mesmo
    bool NameRegistrer = DateJson.ProcurarUserPeloNome(dados.nome);
    Console.WriteLine(NameRegistrer);
    if (NameRegistrer)
    {
        return Results.Json(new RespostaResultado { Sucesso = false, Error = "nome_em_uso" });
    }
    else
    {
        bool sucessoRegistrarUser = DateJson.RegistrarUser(dados.nome, dados.senha);
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

app.Run();
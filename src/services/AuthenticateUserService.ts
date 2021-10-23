import axios from "axios";
/**
 * Receber code(string)
 * Recuperar o access token no github
 * verifica se o usuario existe no db
 * ----- Sim = gera token
 * ----- Nao = cria no db e gera token
 * Retornar token com infos dos user logado
 */

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const response = await axios.post(url, null, {
      params: {
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        client_id: process.env.GITHUB_CLIENT_ID,
        code,
      },
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  }
}

export { AuthenticateUserService };

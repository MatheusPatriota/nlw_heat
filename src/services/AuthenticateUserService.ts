import axios from "axios";
/**
 * Receber code(string)
 * Recuperar o access token no github
 * verifica se o usuario existe no db
 * ----- Sim = gera token
 * ----- Nao = cria no db e gera token
 * Retornar token com infos dos user logado
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse{
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenReponse } = await axios.post<IAccessTokenResponse>(
      url,
      null,
      {
        params: {
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          client_id: process.env.GITHUB_CLIENT_ID,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenReponse.access_token}`,
      },
    });

    return response.data;
  }
}

export { AuthenticateUserService };

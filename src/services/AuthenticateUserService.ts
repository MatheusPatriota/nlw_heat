import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
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

interface IUserResponse {
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

    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenReponse.access_token}`,
        },
      }
    );

    const { login, id, avatar_url, name } = response.data;

    const user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );

    return {token, user};
  }
}

export { AuthenticateUserService };

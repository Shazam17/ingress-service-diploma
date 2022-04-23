import * as jwt from 'jsonwebtoken';
import { InvalidToken } from './ErrorTypes';

export enum TOKEN_SECRET {
  REFRESH = 'secret_refresh',
  ACCESS = 'secret_access',
}

export interface JWTResponse {
  accessToken: string;
  refreshToken: string;
}

export class JWT {
  private static getAccessTokenTime(): number {
    return Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  }

  private static getRefreshTokenTime(): number {
    return Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  }

  public static jwtSign(data: object, time: number, secret: string): string {
    return jwt.sign(
      {
        exp: time,
        data,
      },
      secret,
    );
  }

  static getAuthTokensPair(userId: string): JWTResponse {
    const accessToken = JWT.jwtSign(
      { userId },
      JWT.getAccessTokenTime(),
      TOKEN_SECRET.ACCESS,
    );
    const refreshToken = JWT.jwtSign(
      { userId },
      JWT.getRefreshTokenTime(),
      TOKEN_SECRET.REFRESH,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  static refreshAccessToken(userId: string): string {
    return JWT.jwtSign(
      { userId },
      JWT.getAccessTokenTime(),
      TOKEN_SECRET.ACCESS,
    );
  }

  static verifyToken(token: string, secret: TOKEN_SECRET): string {
    try {
      const data = jwt.verify(token, secret);
      return data.data.userId;
    } catch (e) {
      throw new InvalidToken();
    }
  }
}

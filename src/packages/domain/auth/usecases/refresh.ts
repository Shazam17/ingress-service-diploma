import { UserRepository } from '../repositories/UsersRepository';
import { IsString } from 'class-validator';
import { JWT, JWTResponse, TOKEN_SECRET } from '../../../shared/jwt';
import { UserNotFound } from '../../../shared/ErrorTypes';

export class RefreshInput {
  @IsString()
  refreshToken: string;
}

export class Usecase {
  private users: UserRepository;

  constructor(userRepository: UserRepository) {
    this.users = userRepository;
  }

  async execute(input: RefreshInput): Promise<JWTResponse> {
    const userId = JWT.verifyToken(input.refreshToken, TOKEN_SECRET.REFRESH);

    const user = await this.users.getUserById(userId);

    if (!user) {
      throw new UserNotFound();
    }
    const newAccessToken = JWT.refreshAccessToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: input.refreshToken,
    };
  }
}

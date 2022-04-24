import { UserRepository } from '../repositories/UsersRepository';
import { IsEmail, IsString } from 'class-validator';
import {
  PasswordIncorrect,
  UserEmailNotVerified,
  UserNotFound,
} from '../../../shared/ErrorTypes';
import * as crypto from 'crypto';
import { JWT, JWTResponse } from '../../../shared/jwt';

export class LoginInput {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class Usecase {
  private users: UserRepository;

  constructor(userRepository: UserRepository) {
    this.users = userRepository;
  }

  async execute(input: LoginInput): Promise<JWTResponse> {
    const user = await this.users.getUserByEmail(input.email);

    if (!user) {
      throw new UserNotFound();
    }

    if (!user.verified) {
      throw new UserEmailNotVerified();
    }

    const hash = crypto
      .pbkdf2Sync(input.password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    const isPasswordCorrect = user.hash === hash;
    if (!isPasswordCorrect) {
      throw new PasswordIncorrect();
    }
    return JWT.getAuthTokensPair(user.id);
  }
}

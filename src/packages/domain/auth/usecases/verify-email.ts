import { UserRepository } from '../repositories/UsersRepository';
import { IsString } from 'class-validator';
import { JWT, TOKEN_SECRET } from '../../../shared/jwt';
import { UserNotFound } from '../../../shared/ErrorTypes';
import { RequestSuccess } from '../../../shared/ResponseTypes';

export class VerifyEmailInput {
  @IsString()
  verifyToken: string;
  constructor(token: string) {
    this.verifyToken = token;
  }
}

export class Usecase {
  private users: UserRepository;

  constructor(userRepository: UserRepository) {
    this.users = userRepository;
  }

  async execute(input: VerifyEmailInput): Promise<RequestSuccess> {
    const userId = JWT.verifyToken(
      input.verifyToken,
      TOKEN_SECRET.VERIFY_EMAIL,
    );

    this.users.setUserEmailVerified(userId);

    return new RequestSuccess({});
  }
}

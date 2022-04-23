import { UserRepository } from '../repositories/UsersRepository';
import { IsEmail, IsString } from 'class-validator';
import * as crypto from 'crypto';
import { UserIsAlreadyExists } from '../../../shared/ErrorTypes';
import { RequestSuccess } from '../../../shared/ResponseTypes';

export class RegisterInput {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  username: string;
}

export class Usecase {
  private users: UserRepository;

  constructor(userRepository: UserRepository) {
    this.users = userRepository;
  }

  async execute(input: RegisterInput) {
    const existUser = await this.users.getUserByEmail(input.email);

    if (existUser) {
      throw new UserIsAlreadyExists();
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(input.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    await this.users.createUser(input.username, input.email, salt, hash);

    return new RequestSuccess({});
  }
}

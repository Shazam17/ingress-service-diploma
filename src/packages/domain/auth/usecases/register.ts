import { UserRepository } from '../repositories/UsersRepository';
import { IsEmail, IsString } from 'class-validator';
import * as crypto from 'crypto';
import { UserIsAlreadyExists } from '../../../shared/ErrorTypes';
import { RequestSuccess } from '../../../shared/ResponseTypes';
import { JWT } from '../../../shared/jwt';
import { MailingService } from '../../../infrastructure/mailing/mailing-service';

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
  private mailing: MailingService;

  constructor(userRepository: UserRepository, mailingService: MailingService) {
    this.users = userRepository;
    this.mailing = mailingService;
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

    const user = await this.users.createUser(
      input.username,
      input.email,
      salt,
      hash,
    );
    const verifyEmailToken = JWT.getVerifyEmailToken(user.id);
    const url = `localhost:3000/verify-email/${verifyEmailToken}`;

    this.mailing.sendEmail(user.email, url);
    return new RequestSuccess({});
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PostgresUsersRepository } from '../packages/repositories/postgress/postgres-users-repository.service';
import {
  LoginInput,
  Usecase as LoginUsecase,
} from '../packages/domain/auth/usecases/login';
import {
  RegisterInput,
  Usecase as RegisterUsecase,
} from '../packages/domain/auth/usecases/register';
import { HandleRequest } from '../packages/shared/handler';
import {
  RefreshInput,
  Usecase as RefreshUsecase,
} from '../packages/domain/auth/usecases/refresh';
import {
  VerifyEmailInput,
  Usecase as VerifyEmailUsecase,
} from '../packages/domain/auth/usecases/verify-email';
import { MailingService } from '../packages/infrastructure/mailing/mailing-service';

@Controller()
@UseInterceptors(new HandleRequest())
export class AuthController {
  constructor(
    private usersRepository: PostgresUsersRepository,
    private mailingService: MailingService,
  ) {}

  @Post('/login')
  public login(@Body() body: LoginInput) {
    const usecase = new LoginUsecase(this.usersRepository);
    return usecase.execute(body);
  }

  @Post('/register')
  public register(@Body() body: RegisterInput) {
    const usecase = new RegisterUsecase(
      this.usersRepository,
      this.mailingService,
    );
    return usecase.execute(body);
  }

  @Post('/refresh')
  public refreshToken(@Body() body: RefreshInput) {
    const usecase = new RefreshUsecase(this.usersRepository);
    return usecase.execute(body);
  }

  @Get('/verify-email/:token')
  public verifyEmail(@Param('token') token: string) {
    const usecase = new VerifyEmailUsecase(this.usersRepository);
    return usecase.execute(new VerifyEmailInput(token));
  }
}

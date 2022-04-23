import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
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

@Controller()
@UseInterceptors(new HandleRequest())
export class AuthController {
  constructor(private usersRepository: PostgresUsersRepository) {}

  @Post('/login')
  public login(@Body() body: LoginInput) {
    const usecase = new LoginUsecase(this.usersRepository);
    return usecase.execute(body);
  }

  @Post('/register')
  public register(@Body() body: RegisterInput) {
    const usecase = new RegisterUsecase(this.usersRepository);
    return usecase.execute(body);
  }
}

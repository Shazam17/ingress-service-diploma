import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IntegrationsRepository } from '../packages/repositories/postgress/integrations-repository';
import {
  CreateIntegrationInput,
  CreateIntegrationUsecase,
} from '../packages/domain/settings/usecases/create-integration';
import {
  PushAuthInput,
  PushAuthUsecase,
} from '../packages/domain/settings/usecases/push-auth';
import {
  CanCommitCreateUsecase,
  CanCommitInput,
} from '../packages/domain/settings/usecases/can-commit-create';
import {
  CommitIntegrationCreateUsecase,
  CommitIntegrationInput,
} from '../packages/domain/settings/usecases/commit-create';
import {
  GetUserIntegrationsInput,
  GetUserIntegrationsUsecase,
} from '../packages/domain/settings/usecases/get-user-integrations';
import { UserModel } from '../packages/repositories/postgress/postgres-users-repository.service';

@Controller()
export class SettingsController {
  constructor(private integrations: IntegrationsRepository) {}

  @Post('/create-integration')
  createIntegration(@Body() input: CreateIntegrationInput) {
    const usecase = new CreateIntegrationUsecase(this.integrations);
    return usecase.execute(input);
  }

  @Post('/push-auth')
  pushAuth(@Body() input: PushAuthInput) {
    const usecase = new PushAuthUsecase(this.integrations);
    return usecase.execute(input);
  }

  @Post('/can-commit')
  canCommitCreate(@Body() input: CanCommitInput) {
    const usecase = new CanCommitCreateUsecase(this.integrations);
    return usecase.execute(input);
  }

  @Post('/commit-create')
  commitCreateIntegration(@Body() input: CommitIntegrationInput) {
    const usecase = new CommitIntegrationCreateUsecase(this.integrations);
    return usecase.execute(input);
  }

  @Get('/user-integrations')
  getUserIntegrationsList(@Body() user: UserModel) {
    const usecase = new GetUserIntegrationsUsecase(this.integrations);
    return usecase.execute({ userId: user.id });
  }

  @Post('/rename-integration')
  renameIntegration(@Body() input: object) {
    return true;
  }

  @Post('/delete-integration')
  deleteIntegration(@Body() input: object) {
    return true;
  }

  @Post('/stop-integration')
  stopIntegration(@Body() input: object) {
    return true;
  }

  @Post('/start-integration')
  startIntegration(@Body() input: object) {
    return true;
  }
}

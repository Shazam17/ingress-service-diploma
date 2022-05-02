import { Body, Controller, Post } from '@nestjs/common';
import { IntegrationsRepository } from '../packages/repositories/postgress/integrations-repository';
import {
  CreateIntegrationInput,
  CreateIntegrationUsecase,
} from '../packages/domain/settings/usecases/create-integration';
import {
  PushAuthInput,
  PushAuthUsecase,
} from '../packages/domain/settings/usecases/push-auth';
import { CanCommitCreateUsecase, CanCommitInput } from "../packages/domain/settings/usecases/can-commit-create";
import {
  CommitIntegrationCreateUsecase,
  CommitIntegrationInput
} from "../packages/domain/settings/usecases/commit-create";

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
}

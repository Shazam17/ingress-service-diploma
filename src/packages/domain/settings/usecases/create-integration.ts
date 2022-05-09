import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';
import { UserModel } from '../../../repositories/postgress/postgres-users-repository.service';

export class CreateIntegrationInput {
  user: UserModel;
  type: string;
}

export class CreateIntegrationUsecase {
  private integrations: IntegrationsRepository;

  constructor(integrations: IntegrationsRepository) {
    this.integrations = integrations;
  }

  async execute(input: CreateIntegrationInput) {
    return this.integrations.createIntegration(input.user.id, input.type);
  }
}

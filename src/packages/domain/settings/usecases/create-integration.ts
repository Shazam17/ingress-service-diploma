import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class CreateIntegrationInput {
  userId: string;
  type: string;
}

export class CreateIntegrationUsecase {
  private integrations: IntegrationsRepository;

  constructor(integrations: IntegrationsRepository) {
    this.integrations = integrations;
  }

  async execute(input: CreateIntegrationInput) {
    return this.integrations.createIntegration(input.userId, input.type)
  };
}

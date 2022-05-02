import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class CommitIntegrationInput {
  integrationId: string;
}

export class CommitIntegrationCreateUsecase {
  private integrations: IntegrationsRepository;

  constructor(integrations: IntegrationsRepository) {
    this.integrations = integrations;
  }

  async execute(input: CommitIntegrationInput) {
    return this.integrations.commitIntegrationCreate(input.integrationId);
  };
}

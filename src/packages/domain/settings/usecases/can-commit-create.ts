import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class CanCommitInput {
  integrationId: string;
}

export class CanCommitCreateUsecase {
  private integrations: IntegrationsRepository;

  constructor(integrations: IntegrationsRepository) {
    this.integrations = integrations;
  }

  async execute(input: CanCommitInput) {
    return this.integrations.canCommitCreate(input.integrationId);
  };
}

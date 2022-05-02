import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class PushAuthInput {
  integrationId: string;
  value: string;
}

export class PushAuthUsecase {
  private integrations: IntegrationsRepository;

  constructor(integrations: IntegrationsRepository) {
    this.integrations = integrations;
  }

  async execute(input: PushAuthInput) {
    return await this.integrations.pushAuthState(
      input.integrationId,
      input.value,
    );
  }
}

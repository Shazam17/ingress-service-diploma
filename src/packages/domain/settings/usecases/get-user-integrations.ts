import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class GetUserIntegrationsInput {
  userId: string;
}

export class GetUserIntegrationsUsecase {
  constructor(private integrations: IntegrationsRepository) {}

  execute(input: GetUserIntegrationsInput) {
    return this.integrations.getUsersIntegrations(input.userId);
  }
}

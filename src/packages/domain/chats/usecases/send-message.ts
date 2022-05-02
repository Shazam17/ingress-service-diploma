import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';
import { PostgresChatsRepository } from '../../../repositories/postgress/postgres-chats-repository';
import { IsString, IsUUID } from 'class-validator';

export class SendMessageInput {
  @IsString()
  message: string;
  @IsUUID(4)
  integrationId: string;
  @IsUUID(4)
  chatId: string;
}

export class SendMessageUsecase {
  constructor(
    private instances: IntegrationsRepository,
    private chats: PostgresChatsRepository,
  ) {}

  public execute(input: SendMessageInput) {
    return this.instances.sendMessage(
      input.integrationId,
      input.message,
      input.chatId,
    );
  }
}

import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';
import { PostgresChatsRepository } from '../../../repositories/postgress/postgres-chats-repository';
import { IsObject, IsString, IsUUID } from 'class-validator';
import { WebSocketAdapter } from '../../../infrastructure/sockets/webSocketAdapter';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../../../repositories/postgress/postgres-users-repository.service';

export class SendMessageInput {
  @IsString()
  message: string;
  @IsUUID(4)
  integrationId: string;
  @IsUUID(5)
  chatId: string;
  @IsObject()
  user: UserModel;
}

export class SendMessageUsecase {
  constructor(
    private instances: IntegrationsRepository,
    private chats: PostgresChatsRepository,
    private pubsub: WebSocketAdapter,
  ) {}

  public async execute(input: SendMessageInput) {
    const response = await this.instances.sendMessage(
      input.integrationId,
      input.message,
      input.chatId,
    );
    const message = await this.chats.createMessage(
      uuidv4(),
      input.integrationId,
      input.user.id,
      input.chatId,
      '',
      input.message,
    );
    const chat = await this.chats.getChatById(input.chatId);
    this.pubsub.sendToClient({ message, chat });
    return { success: true };
  }
}

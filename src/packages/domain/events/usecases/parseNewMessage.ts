import { IsObject, IsString } from 'class-validator';
import { PostgresChatsRepository } from '../../../repositories/postgress/postgres-chats-repository';
import { WebSocketAdapter } from '../../../infrastructure/sockets/webSocketAdapter';
import { RequestSuccess } from '../../../shared/ResponseTypes';
import { IntegrationsRepository } from '../../../repositories/postgress/integrations-repository';

export class InputChat {
  id: string;
  chatId: string;
  instanceId: string;
  createdAt: string;
  updatedAt: string;
}

export class InputMessage {
  id: string;
  fromUser: string;
  toUser: string;
  text: string;
  attachmentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export class ParseNewMessageInput {
  @IsObject()
  chat: InputChat;
  @IsObject()
  message: InputMessage;
  @IsString()
  type: string;
  @IsString()
  external_user_id: string;
  @IsString()
  instanceId: string;
}

export class Usecase {
  constructor(
    private chats: PostgresChatsRepository,
    private sockets: WebSocketAdapter,
    private integrations: IntegrationsRepository,
  ) {}

  async execute(input: ParseNewMessageInput) {
    try {
      console.log('new message');
      console.log(input);
      let chat = await this.chats.getChatById(input.chat.id);
      const integration = await this.integrations.getIntegration(
        input.external_user_id,
        input.instanceId,
      );

      if (!chat && integration) {
        chat = await this.chats.createUserChat(
          input.chat.id,
          input.type,
          integration.id,
        );
      }

      const userChat = await this.chats.addUserToChat(
        input.external_user_id,
        input.chat.id,
      );

      const message = await this.chats.createMessage(
        input.message.id,
        input.message.fromUser,
        input.message.toUser,
        input.chat.id,
        '',
        input.message.text,
      );
      this.sockets.sendToClient({ message, chat });
      return new RequestSuccess({});
    } catch (e) {
      console.log(e);
    }
  }
}

import { IsObject, IsString } from 'class-validator';
import { PostgresUsersRepository } from '../../../repositories/postgress/postgres-users-repository.service';
import {
  ChatModel,
  MessageModel,
  PostgresChatsRepository,
} from '../../../repositories/postgress/postgres-chats-repository';
import { WebSocketAdapter } from '../../../infrastructure/sockets/webSocketAdapter';
import { RequestSuccess } from '../../../shared/ResponseTypes';

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
}

export class Usecase {
  constructor(
    private chats: PostgresChatsRepository,
    private sockets: WebSocketAdapter,
  ) {}

  async execute(input: ParseNewMessageInput) {
    try {
      console.log('new message');
      console.log(input);
      const chat = await this.chats.getChatById(input.chat.id);
      if (!chat) {
        await this.chats.createUserChat(input.chat.id, input.type);
      }

      const message = await this.chats.createMessage(
        input.message.id,
        input.message.fromUser,
        input.message.toUser,
        input.chat.id,
        '',
        input.message.text,
      );
      this.sockets.sendToClient(message);
      return new RequestSuccess({});
    } catch (e) {
      console.log(e);
    }
  }
}

import { PostgresChatsRepository } from '../../../repositories/postgress/postgres-chats-repository';
import { UserModel } from '../../../repositories/postgress/postgres-users-repository.service';
import { ChatNotFound } from '../../../shared/ErrorTypes';
import { IsNumber, IsUUID } from 'class-validator';

export class ChatHistoryInput {
  @IsUUID(4)
  id: string;
  @IsNumber()
  offset: number;
  @IsNumber()
  limit: number;
}

export class GetChatHistoryUsecase {
  constructor(private chats: PostgresChatsRepository) {}

  async execute(input: ChatHistoryInput) {
    const chat = await this.chats.getChatById(input.id);

    if (!chat) {
      throw new ChatNotFound();
    }

    return await this.chats.getMessagesByChat(
      chat.id,
      input.limit,
      input.offset,
    );
  }
}

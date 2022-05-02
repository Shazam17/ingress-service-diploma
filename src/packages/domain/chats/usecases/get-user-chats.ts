import { PostgresChatsRepository } from '../../../repositories/postgress/postgres-chats-repository';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class GetUserChatsInput {
  @IsUUID(4)
  userId: string;
  @IsNumber()
  offset: number;
  @IsNumber()
  limit: number;
  @IsString()
  channelType: string;
}

export class GetUserChatsUsecase {
  constructor(private chats: PostgresChatsRepository) {}

  async execute(input: GetUserChatsInput) {
    return this.chats.getUserChatsById(
      input.userId,
      input.offset,
      input.limit,
      input.channelType,
    );
  }
}

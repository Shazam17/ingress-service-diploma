import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ChatHistoryInput,
  GetChatHistoryUsecase,
} from '../packages/domain/chats/usecases/chat-history';
import { PostgresChatsRepository } from '../packages/repositories/postgress/postgres-chats-repository';
import {
  GetUserChatsInput,
  GetUserChatsUsecase,
} from '../packages/domain/chats/usecases/get-user-chats';

@Controller()
export class ChatsController {
  constructor(private chats: PostgresChatsRepository) {}

  @Get('/user-chats/:id')
  public getUserChats(@Param('id') userId: string,  @Query() query: Partial<GetUserChatsInput>) {
    const usecase = new GetUserChatsUsecase(this.chats);
    query.userId = userId;
    return usecase.execute(query as GetUserChatsInput);
  }

  @Get('/chat-history/:id')
  public getChatHistory(
    @Param('id') id: string,
    @Query() query: Partial<ChatHistoryInput>,
  ) {
    query.id = id;
    const usecase = new GetChatHistoryUsecase(this.chats);
    return usecase.execute(query as ChatHistoryInput);
  }

  @Post('/send-message')
  public sendMessage(@Body() body: object) {}
}

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
import {
  SendMessageInput,
  SendMessageUsecase,
} from '../packages/domain/chats/usecases/send-message';
import { IntegrationsRepository } from '../packages/repositories/postgress/integrations-repository';
import { UserModel } from '../packages/repositories/postgress/postgres-users-repository.service';
import { WebSocketAdapter } from '../packages/infrastructure/sockets/webSocketAdapter';

@Controller()
export class ChatsController {
  constructor(
    private chats: PostgresChatsRepository,
    private integrations: IntegrationsRepository,
    private webSocketAdapter: WebSocketAdapter,
  ) {}

  @Get('/user-chats')
  public getUserChats(
    @Body() user: UserModel,
    @Query() query: Partial<GetUserChatsInput>,
  ) {
    const usecase = new GetUserChatsUsecase(this.chats);
    query.userId = user.id;
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
  public sendMessage(@Body() input: SendMessageInput) {
    const usecase = new SendMessageUsecase(
      this.integrations,
      this.chats,
      this.webSocketAdapter,
    );
    return usecase.execute(input);
  }
}

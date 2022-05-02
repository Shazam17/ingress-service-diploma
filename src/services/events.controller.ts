import { Body, Controller, Post } from '@nestjs/common';
import { WebSocketAdapter } from '../packages/infrastructure/sockets/webSocketAdapter';
import {
  ParseNewMessageInput,
  Usecase,
} from '../packages/domain/events/usecases/parseNewMessage';
import { PostgresChatsRepository } from '../packages/repositories/postgress/postgres-chats-repository';
import { IntegrationsRepository } from '../packages/repositories/postgress/integrations-repository';

@Controller()
export class EventsController {
  constructor(
    private chats: PostgresChatsRepository,
    private sockets: WebSocketAdapter,
    private integrations: IntegrationsRepository,
  ) {}

  @Post('/notify')
  public onNewMessage(@Body() input: ParseNewMessageInput) {
    const usecase = new Usecase(this.chats, this.sockets, this.integrations);
    return usecase.execute(input);
  }
}

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class WebSocketAdapter {
  @WebSocketServer()
  server: any;

  sendToClient(message: object) {
    this.server.emit('messages', {
      message,
    });
  }

  @SubscribeMessage('messages')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: object,
  ): string {
    console.log(data);
    return data;
  }
}

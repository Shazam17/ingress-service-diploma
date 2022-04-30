import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller()
export class ChatsController {
  @Get('/chats')
  public getChats(
    @Param('page') page: string,
    @Param('offset') offset: string,
  ) {
    return true;
  }

  @Get('/chat-detail/:id')
  public getChatDetail(@Param('id') id: string) {
  }

  @Get('/chat-history/:id')
  public getChatHistory(@Param('id') id: string) {

  }

  @Post('/send-message')
  public sendMessage(@Body() body: object) {}
}

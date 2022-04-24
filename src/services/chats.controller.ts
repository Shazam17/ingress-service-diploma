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
  public getChatDetail(@Param('chatId') chatId: string) {}

  @Get('/chat-history')
  public getChatHistory(@Param('chatId') chatId: string) {}

  @Post('/send-message')
  public sendMessage(@Body() body: object) {}
}

import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class PanelController {
  @Post('/test')
  public testRequest(@Body() body: object) {
    console.log(body);
    return true;
  }
}

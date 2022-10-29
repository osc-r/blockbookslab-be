import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { VerifyLoginDto } from 'src/dto/verifyLogin.dto';
import { Public } from 'src/helper/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private authService: WalletService) {}

  // @Get()
  // async getNonce() {
  //   return await this.authService.getNonce();
  // }

  // @Post('verify')
  // async postVerify(@Body() req: VerifyLoginDto) {
  //   return await this.authService.verify(req);
  // }
}

// @Get('notify')
// async notify(@Req() req: Request, @Res() res: Response) {
//   res.json(await this.authService.sendNotification());
// }

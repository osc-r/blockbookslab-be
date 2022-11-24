import { Controller, Get, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async getWallet(@Req() req) {
    return await this.walletService.getWallet(req.user.userId);
  }

  @Post()
  async postWallet(@Req() req) {
    return await this.walletService.createWallet(
      req.user.userId,
      req.body.name,
      req.body.address.toLowerCase(),
    );
  }
}

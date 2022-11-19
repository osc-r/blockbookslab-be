import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { Public } from 'src/helper/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    @InjectQueue('transaction') private readonly transactionQueue: Queue,
    private transactionService: TransactionService,
  ) {}

  @Get()
  async getTransaction(@Req() req) {
    return this.transactionService.getTransaction(req.user?.userId, req.query);
  }

  @Public()
  @Get(':address')
  async generateTransaction(@Param() params) {
    const address = params.address;

    return {
      jobDetail: await this.transactionQueue.add(
        'transcode',
        { address: address },
        { jobId: randomUUID() },
      ),
    };
  }

  @Public()
  @Get('status/:id')
  async getQueueStatus(@Param() params) {
    const id = params.id;

    const job = await this.transactionQueue.getJob(id);
    if (job.finishedOn && job.returnvalue) {
      return 'SUCCESS';
    } else if (job.finishedOn && !job.returnvalue) {
      return 'FAILED';
    } else {
      return 'PENDING';
    }
  }

  @Post('/details')
  async createTransactionDetail(@Req() req) {
    await this.transactionService.createTransactionDetail(
      req.body,
      req.user?.userId,
    );
    return true;
  }

  @Post('/details/memo')
  async createTransactionDetailMemo(@Req() req) {
    await this.transactionService.addMemo(req.body, req.user?.userId);
    return true;
  }

  @Post('/details/labels')
  async createTransactionDetailLabels(@Req() req) {
    await this.transactionService.addLabel(req.body, req.user?.userId);
    return true;
  }
}

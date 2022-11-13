import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { Queue } from 'bull';
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
        { jobId: address },
      ),
    };
  }

  @Public()
  @Get(':id')
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
}

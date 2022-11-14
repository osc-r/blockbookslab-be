import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Queue } from 'bull';
import { TransactionDetailRequestDto } from 'src/dto/transactionDetailRequest.dto';
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
    const x = await this.transactionService.createTransactionDetail(
      req.body,
      req.user?.userId,
    );
    console.log(x);
    return true;
  }

  @Post('/details/memo')
  async createTransactionDetailMemo(@Req() req) {
    const x = await this.transactionService.addMemo(req.body, req.user?.userId);
    console.log(x);
    return true;
  }

  @Post('/details/labels')
  async createTransactionDetailLabels(@Req() req) {
    const x = await this.transactionService.addLabel(
      req.body,
      req.user?.userId,
    );
    console.log(x);
    return true;
  }
}

import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Param } from '@nestjs/common';
import { Queue } from 'bull';
import { Public } from 'src/helper/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(
    @InjectQueue('transaction') private readonly transactionQueue: Queue,
  ) {}

  @Public()
  @Get()
  async test() {
    const id = Date.now();

    return {
      id,
      q: await this.transactionQueue.add(
        'transcode',
        { address: '0x03d15ec11110dda27df907e12e7ac996841d95e4' },
        { jobId: id },
      ),
    };
  }

  @Public()
  @Get(':id')
  async test1(@Param() params) {
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

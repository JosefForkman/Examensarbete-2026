import { Module } from '@nestjs/common';
import { BaseServiceService } from './base-service.service';

@Module({
  providers: [BaseServiceService],
})
export class BaseServiceModule {}

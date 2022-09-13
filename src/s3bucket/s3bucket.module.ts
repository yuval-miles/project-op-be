import { Module } from '@nestjs/common';
import { S3bucketService } from './s3bucket.service';
import { S3bucketController } from './s3bucket.controller';

@Module({
  providers: [S3bucketService],
  controllers: [S3bucketController],
})
export class S3bucketModule {}

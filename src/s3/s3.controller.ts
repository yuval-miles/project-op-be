import { Controller } from '@nestjs/common';
import { Get, Query } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}
  @Get()
  getSecureUrl(
    @Query() { filename, path }: { filename: string; path: string },
  ) {
    return this.s3Service.getSecureUrl(filename, path);
  }
}

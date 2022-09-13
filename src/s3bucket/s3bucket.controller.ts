import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { S3bucketService } from './s3bucket.service';

@UseGuards(JwtAuthGuard)
@Controller('s3bucket')
export class S3bucketController {
  constructor(private readonly s3bucketService: S3bucketService) {}
  @Get()
  getSecureUrl(
    @Query() { filename, path }: { filename: string; path: string },
  ) {
    return this.s3bucketService.getSecureUrl(filename, path);
  }
}

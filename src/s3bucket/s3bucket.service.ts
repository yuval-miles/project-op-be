import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class S3bucketService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly config: ConfigService,
  ) {}
  async getSecureUrl(filename: string, path: string) {
    if (!filename || !path)
      throw new BadRequestException('please provide filename and path');
    const params = {
      Bucket: this.config.get('S3_BUCKET_NAME'),
      Key: (filename + path) as string,
      Expires: 60,
    };
    return {
      message: 'success',
      url: await this.s3.getSignedUrlPromise('putObject', params),
    };
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { generateUploadUrl } from 'src/utils/s3';

@Injectable()
export class S3Service {
  async getSecureUrl(
    filename: string,
    path: string,
  ): Promise<{ message: string; response: string }> {
    if (!filename || !path)
      throw new BadRequestException('please provide filename and path');
    const url = await generateUploadUrl(
      ((path as string) + filename) as string,
    );
    return { message: 'success', response: url };
  }
}

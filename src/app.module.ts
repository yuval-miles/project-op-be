import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { S3Module } from 'nestjs-s3';
import { S3bucketModule } from './s3bucket/s3bucket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    S3Module.forRoot({
      config: {
        region: process.env.S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    S3Module,
    S3bucketModule,
  ],
})
export class AppModule {}

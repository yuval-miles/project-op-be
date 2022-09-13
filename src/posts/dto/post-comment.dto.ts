import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostCommentDto {
  @IsNotEmpty()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @IsString()
  public postId: string;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public action: 'create' | 'delete';

  @IsOptional()
  @IsString()
  public commentId: string;
}

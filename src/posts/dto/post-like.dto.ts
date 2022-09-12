import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Like {
  like,
  dislike,
}

export class PostLikeDto {
  @IsNotEmpty()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @IsEnum(Like)
  public type: 'like' | 'disLike';

  @IsNotEmpty()
  @IsString()
  public postId: string;
}

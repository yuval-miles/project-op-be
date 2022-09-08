import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  public text: string;

  @IsString()
  @IsOptional()
  public picture: string;

  @IsNotEmpty()
  @IsString()
  public userId: string;
}

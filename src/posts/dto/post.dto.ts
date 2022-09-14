import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsBoolean()
  @IsOptional()
  public anon: boolean;

  @IsBoolean()
  @IsOptional()
  public comments: boolean;
}

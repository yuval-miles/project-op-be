import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  @Length(3, 15, { message: 'username must be 3 - 20 characters' })
  username: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  public picture: string;

  @IsOptional()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and  20 characters' })
  public password: string;
}

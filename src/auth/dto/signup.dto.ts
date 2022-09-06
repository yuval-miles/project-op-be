import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 15, { message: 'username must be 3 - 20 characters' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password must be between 6 and  20 characters' })
  public password: string;
}

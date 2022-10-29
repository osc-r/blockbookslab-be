import { IsNotEmpty } from 'class-validator';

export class VerifyLoginDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  signature: string;
}

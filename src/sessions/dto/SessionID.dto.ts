import { IsNotEmpty, IsString } from "class-validator";

export class SessionIDDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
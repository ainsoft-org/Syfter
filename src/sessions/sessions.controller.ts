import { Controller, Get, Post, Request, UseGuards, Body } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { AuthGuard } from "@nestjs/passport";
import { SessionIDDto } from "./dto/SessionID.dto";
import { PinCodeDto } from "./dto/PinCode.dto";

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('getSessions')
  getSessions(@Request() req) {
    return this.sessionsService.getSessions(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeSession')
  removeSession(@Request() req, @Body() dto: SessionIDDto) {
    return this.sessionsService.closeSession(dto.sessionId, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeAllSessions')
  closeAllSessions(@Request() req, @Body() dto: PinCodeDto) {
    return this.sessionsService.closeAllSessions(req.user.sessionId, req.user.sub, dto.pin);
  }
}

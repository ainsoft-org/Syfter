import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from 'express';

@Controller('uploads')
export class UploadsController {
  @Get(":filename")
  getFile(@Param("filename") filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: "./src/uploads" })
  }
}

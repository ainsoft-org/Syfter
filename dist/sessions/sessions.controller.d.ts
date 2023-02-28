/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { SessionsService } from "./sessions.service";
import { SessionIDDto } from "./dto/SessionID.dto";
import { PinCodeDto } from "./dto/PinCode.dto";
import { PeriodDto } from "./dto/Period.dto";
export declare class SessionsController {
    private sessionsService;
    constructor(sessionsService: SessionsService);
    getSessions(req: any): Promise<(import("mongoose").Document<unknown, any, import("./session.schema").Session> & import("./session.schema").Session & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    removeSession(req: any, dto: SessionIDDto): Promise<{
        message: string;
    }>;
    closeAllSessions(req: any, dto: PinCodeDto): Promise<{
        message: string;
    }>;
    setSessionExpirationPeriod(req: any, dto: PeriodDto): Promise<string>;
}

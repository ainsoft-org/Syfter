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
import { AuthService } from './auth.service';
import { MobileNumberDto } from "./dto/MobileNumber.dto";
import { CheckRegConfirmationCode } from "./dto/Reg/CheckRegConfirmationCode.dto";
import { SetPinRegDto } from "./dto/Reg/SetPinReg.dto";
import { SetUsernameRegDto } from "./dto/Reg/SetUsernameRegDto.dto";
import { SetEmailRegDto } from "./dto/Reg/SetEmailReg.dto";
import { SetAddressRegDto } from "./dto/Reg/SetAddressReg.dto";
import { SignInLocalDto } from "./dto/SignInLocal.dto";
import { RefreshTokenDto } from "./dto/RefreshToken.dto";
import { RestorePinDto } from "./dto/restorePin.dto";
import { ConfirmRestorePinDto } from "./dto/confirmRestorePin.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getCountries(): {
        AD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AX: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        AZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BB: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BJ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BQ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        BZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CV: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CX: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        CZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DJ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DO2: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        DZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        EC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        EE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        EG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        EH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ER: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ES: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ET: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FJ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        FR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GB: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GP: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GQ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        GY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        HU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ID: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IQ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        IT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        JE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        JM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        JO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        JP: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KP: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        KZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LB: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LV: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        LY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ME: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ML: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MP: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MQ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MV: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MX: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        MZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NP: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        NZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        OM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PR2: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        PY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        QA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        RE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        RO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        RS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        RU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        RW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SB: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SJ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ST: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SV: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SX: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        SZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TD: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TH: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TJ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TK: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TL: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TO: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TR: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TV: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        TZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        UA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        UG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        US: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        UY: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        UZ: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VC: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VG: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VI: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VN: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        VU: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        WF: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        WS: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        YE: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        YT: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ZA: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ZM: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
        ZW: {
            name: string;
            emoji: string;
            unicode: string;
            image: string;
            code: string;
        };
    };
    twitterSignin(): string;
    twitterRedirect(req: any): any;
    restorePin(dto: MobileNumberDto): Promise<import("mongoose").LeanDocument<import("./restoringPinUser.schema").RestoringPinUser> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    confirmRestorePin(dto: ConfirmRestorePinDto): Promise<import("mongoose").Document<unknown, any, import("./restoringPinUser.schema").RestoringPinUser> & import("./restoringPinUser.schema").RestoringPinUser & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    restorePin2(dto: RestorePinDto): Promise<{
        message: string;
    }>;
    sendAuthConfirmationCode(dto: MobileNumberDto): Promise<{
        message: string;
        authToken: string;
    }>;
    signinLocal(req: any, dto: SignInLocalDto): Promise<{
        username: string;
        email: string;
        image: string;
        refresh_token: string;
        access_token: string;
    }>;
    logout(req: any, dto: RefreshTokenDto): Promise<import("mongoose").Document<unknown, any, import("../sessions/session.schema").Session> & import("../sessions/session.schema").Session & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        access_token: string;
    }>;
    sendRegConfirmationCode(mobileNumber: MobileNumberDto): Promise<{
        message: string;
        data: import("mongoose").LeanDocument<import("./registeringUser.schema").RegisteringUser> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    checkRegConfirmationCode(dto: CheckRegConfirmationCode): Promise<import("mongoose").LeanDocument<import("./registeringUser.schema").RegisteringUser> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    setPinReg(dto: SetPinRegDto): Promise<import("mongoose").Document<unknown, any, import("./registeringUser.schema").RegisteringUser> & import("./registeringUser.schema").RegisteringUser & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    setUsernameReg(dto: SetUsernameRegDto): Promise<import("mongoose").Document<unknown, any, import("./registeringUser.schema").RegisteringUser> & import("./registeringUser.schema").RegisteringUser & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    setEmailReg(dto: SetEmailRegDto): Promise<import("mongoose").Document<unknown, any, import("./registeringUser.schema").RegisteringUser> & import("./registeringUser.schema").RegisteringUser & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    setAddressReg(req: any, dto: SetAddressRegDto): Promise<{
        username: string;
        email: string;
        image: string;
        refresh_token: string;
        access_token: string;
    }>;
}

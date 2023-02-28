import { ExecutionContext } from "@nestjs/common";
declare const TwitterAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TwitterAuthGuard extends TwitterAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};

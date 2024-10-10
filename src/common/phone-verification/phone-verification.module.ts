import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneVerification } from "./phone-verification.entity";
import { PhoneVerificationService } from "./phone-verification.service";
import { PhoneVerificationController } from "./phone-verification.controller";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PhoneVerification]),
        AuthModule
    ],
    providers: [PhoneVerificationService],
    controllers: [PhoneVerificationController],
    exports: [PhoneVerificationService]
})
export class PhoneVerificationModule { }
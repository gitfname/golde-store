import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneVerification } from "./phone-verification.entity";
import { PhoneVerificationService } from "./phone-verification.service";
import { PhoneVerificationController } from "./phone-verification.controller";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { MeliPayamakService } from "../lib/meli-payamak.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PhoneVerification]),
        AuthModule
    ],
    providers: [MeliPayamakService, PhoneVerificationService],
    controllers: [PhoneVerificationController],
    exports: [PhoneVerificationService]
})
export class PhoneVerificationModule { }
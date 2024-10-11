import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PhoneVerification } from "./phone-verification.entity";
import { LoginResponseDto } from "../auth/dto/login-response.dto";
import { AuthService } from "../auth/auth.service";
import { MeliPayamakService } from "../lib/meli-payamak.service";
import { generateNumericOTP } from "src/helpers";

@Injectable()
export class PhoneVerificationService {

    constructor(
        @InjectRepository(PhoneVerification) private readonly phoneVerificationRepository: Repository<PhoneVerification>,
        private readonly authService: AuthService,
        private readonly meliPayamakService: MeliPayamakService
    ) { }

    async sendCodeToPhone(phone: string, code: string): Promise<void> {
        const sendOtpCode = await this.meliPayamakService.sendMessage({
            from: "50004001000020",
            to: phone,
            isFlash: false,
            password: "CL4ET",
            username: "09127788031",
            text: `کد تایید شما : ${code}`,
        })

        if (sendOtpCode === "failed" || sendOtpCode === "internal-error") {
            throw new InternalServerErrorException("unable to send otp code")
        }
    }

    async sendCode(phone: string): Promise<void> {
        const verification = await this.phoneVerificationRepository.findOneBy({ phone })
        const otpCode = generateNumericOTP()

        if (!verification) {
            await this.sendCodeToPhone(phone, otpCode)
            const verification = this.phoneVerificationRepository.create({ phone, retries: 0, date: new Date(), code: otpCode })
            await this.phoneVerificationRepository.save(verification)
            return
        }

        if (new Date(verification.date.getTime() + 20 * 1000) > new Date()) {
            throw new BadRequestException("wait for 20 seconds and then try again")
        }

        if (verification.retries > 4) {
            if (new Date(verification.date.getTime() + 2 * 60 * 1000) > new Date()) {
                throw new BadRequestException("you tried too much please wait 2 minutes and then try again")
            }
            else {
                verification.retries = 0
                verification.code = otpCode
                verification.retries = 1
                verification.date = new Date()
                await this.phoneVerificationRepository.save(verification)
            }
        }

        await this.sendCodeToPhone(phone, otpCode)
        verification.code = otpCode
        verification.retries = verification.retries + 1
        verification.date = new Date()
        await this.phoneVerificationRepository.save(verification)
    }

    async verifyCode(phone: string, code: string): Promise<boolean | LoginResponseDto> {
        const verification = await this.phoneVerificationRepository.findOneBy({ phone })

        if (!verification) throw new NotFoundException("please send a verification code first")

        if (code === verification.code) {
            await this.phoneVerificationRepository.delete({ phone })
            return await this.authService.signUpOrLogin(phone)
        }
        else {
            return false
        }
    }

}
import { Controller, Body, Query, Param, Post, Get, BadRequestException } from "@nestjs/common"
import { PhoneVerificationService } from "./phone-verification.service";
import { CreatePhoneVerificationDto, VerifyPhoneDto } from "./dto";
import { LoginResponseDto } from "../auth/dto/login-response.dto";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("phone-verification")
@ApiTags("Phone Verification")
export class PhoneVerificationController {

    constructor(
        private readonly phoneVerificationService: PhoneVerificationService
    ) { }

    @ApiOperation({ summary: "send verification-code to given phone number" })
    @ApiOkResponse({ status: "2XX", type: null })
    @Post("send-code")
    async sendCode(@Body() createPhoneVerificationDto: CreatePhoneVerificationDto): Promise<void> {
        await this.phoneVerificationService.sendCode(createPhoneVerificationDto.phone)
    }

    @Get("verify")
    @ApiOperation({ summary: "verify the verification-code and then signup or login" })
    @ApiOkResponse({ status: "2XX", type: LoginResponseDto })
    async verifyCode(
        @Query() verifyPhoneDto: VerifyPhoneDto,
    ): Promise<LoginResponseDto> {
        const res = await this.phoneVerificationService.verifyCode(verifyPhoneDto.phone, verifyPhoneDto.code)
        if (typeof res === "boolean") {
            throw new BadRequestException("code is incorrect")
        }
        else {
            return res
        }
    }
}
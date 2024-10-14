import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { WithdrawalRial } from "./withdrawal-rial.entity";
import { WithdrawalRialService } from "./withdrawal-rial.service";
import { WithdrawalRialController } from "./withdrawal-rial.controller";
import { UserModule } from "src/common/users";
import { BankAccountsModule } from "../bank-accounts/bank-accounts.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([WithdrawalRial]),
        UserModule,
        BankAccountsModule
    ],
    providers: [WithdrawalRialService],
    controllers: [WithdrawalRialController],
    exports: [WithdrawalRialService]
})
export class WithdrawalRialModule { }
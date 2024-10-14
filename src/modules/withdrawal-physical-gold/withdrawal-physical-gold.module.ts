import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { WithdrawalPhysicalGold } from "./withdrawal-physical-gold.entity";
import { UserModule } from "src/common/users";
import { WithdrawalPhysicalGoldController } from "./withdrawal-physical-gold.controller";
import { BankAccountsModule } from "../bank-accounts/bank-accounts.module";
import { WithdrawalPhysicalGoldService } from "./withdrawal-physical-gold.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([WithdrawalPhysicalGold]),
        UserModule,
        BankAccountsModule
    ],
    providers: [WithdrawalPhysicalGoldService],
    controllers: [WithdrawalPhysicalGoldController],
    exports: [WithdrawalPhysicalGoldService]
})
export class WithdrawalPhysicalGoldModule { }
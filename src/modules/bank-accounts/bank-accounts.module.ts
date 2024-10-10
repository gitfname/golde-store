import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { BankAccounts } from "./bank-accounts.entity";
import { UserModule } from "src/common/users";
import { BankAccountsService } from "./bank-accounts.service";
import { BankAccountsController } from "./bank-accounts.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([BankAccounts]),
        UserModule
    ],
    providers: [BankAccountsService],
    controllers: [BankAccountsController],
    exports: [BankAccountsService]
})
export class BankAccountsModule { }
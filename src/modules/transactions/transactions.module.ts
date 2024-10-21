import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transactions } from "./transactions.entity";
import { UserModule } from "src/common/users";
import { BankAccountsModule } from "../bank-accounts/bank-accounts.module";
import { S3Service } from "src/common/lib";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { ApplicationDataModule } from "../application-data/application-data.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Transactions]),
        UserModule,
        BankAccountsModule,
        NestjsFormDataModule.config({
            storage: MemoryStoredFile
        }),
        ApplicationDataModule
    ],
    providers: [S3Service, TransactionsService],
    controllers: [TransactionsController],
    exports: [TransactionsService]
})
export class TransactionsModule { }
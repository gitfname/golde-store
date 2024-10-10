import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from './common/users/user.entity';
import { UserModule } from './common/users';
import { AuthModule } from './common/auth/auth.module';
import { PhoneVerificationModule } from './common/phone-verification/phone-verification.module';
import { PhoneVerification } from './common/phone-verification/phone-verification.entity';
import { NationalCard } from './modules/national-cards/national-cards.entity';
import { NationalCardsModule } from './modules/national-cards/national-cards.module';
import { BankAccounts } from './modules/bank-accounts/bank-accounts.entity';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { Transactions } from './modules/transactions/transactions.entity';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "services.irn8.chabokan.net",
      username: "postgres",
      password: "a8wfdw9HEVOpUnsj",
      port: 8532,
      database: "zelma",
      synchronize: true,
      entities: [User, PhoneVerification, NationalCard, BankAccounts, Transactions]
    }),
    UserModule,
    AuthModule,
    PhoneVerificationModule,
    NationalCardsModule,
    BankAccountsModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

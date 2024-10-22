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
import { ProductsModule } from './modules/products/products.module';
import { Products } from './modules/products/products.entity';
import { WithdrawalPhysicalGold } from './modules/withdrawal-physical-gold/withdrawal-physical-gold.entity';
import { WithdrawalPhysicalGoldModule } from './modules/withdrawal-physical-gold/withdrawal-physical-gold.module';
import { WithdrawalRial } from './modules/withdrawal-rial/withdrawal-rial.entity';
import { WithdrawalRialModule } from './modules/withdrawal-rial/withdrawal-rial.module';
import { ShoppingCart } from './modules/shopping-cart/shopping-cart.entity';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';
import { ProductOrders } from './modules/product-orders/product-orders.entity';
import { ProductOrdersModule } from './modules/product-orders/product-orders.module';
import { ApplicationData } from './modules/application-data/application-data.entity';
import { ApplicationDataModule } from './modules/application-data/application-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      // host: "185.255.91.32",
      host: "103.75.198.152",
      username: "postgres",
      password: "rDeSx514NlgV2SvtPFUVaeNLdHRXFXt6X6VjFRxUbAo3cXBVcWMnjA0o4xIZ2jhK",
      port: 3008,
      database: "postgres",
      synchronize: true,
      entities: [
        User, PhoneVerification, NationalCard, BankAccounts, Transactions, Products,
        WithdrawalPhysicalGold, WithdrawalRial, ShoppingCart, ProductOrders, ApplicationData
      ]
    }),
    UserModule,
    AuthModule,
    PhoneVerificationModule,
    NationalCardsModule,
    BankAccountsModule,
    TransactionsModule,
    ProductsModule,
    WithdrawalPhysicalGoldModule,
    WithdrawalRialModule,
    ShoppingCartModule,
    ProductOrdersModule,
    ApplicationDataModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

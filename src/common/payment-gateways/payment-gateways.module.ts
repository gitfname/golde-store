import { Module } from '@nestjs/common';
import { ZibalPaymentGatewayService } from './zibal-payment-gateway.service';

@Module({
  providers: [ZibalPaymentGatewayService],
  exports: [ZibalPaymentGatewayService],
})
export class PaymentGatewaysModule {}

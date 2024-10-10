import { Injectable } from '@nestjs/common';
import { ZibalPaymentResultEnum, ZibalPaymentVerificationStatustEnum } from './enums';

interface IRequestPaymentGateway {
  message: 'success' | string;
  result: 100 | 102 | 103 | 104 | 105 | 106 | 113;
  trackId: number;
  payLink?: string;
}

interface IVerifyPayment {
  paidAt: string;
  amount: number;
  result: ZibalPaymentResultEnum;
  status: ZibalPaymentVerificationStatustEnum;
  refNumber: number;
  description?: string;
  cardNumber: string;
  orderId: string;
  message: 'success' | string;
}

@Injectable()
export class ZibalPaymentGatewayService {
  async requestGateWay({
    merchant,
    amount,
    orderId,
    callbackUrl,
    linkToPay,
  }: {
    merchant: string;
    amount: number;
    orderId: number | string;
    callbackUrl?: string;
    linkToPay?: boolean;
  }): Promise<IRequestPaymentGateway | undefined> {
    const requestPaymentGateWayReq = await fetch(
      'https://gateway.zibal.ir/v1/request',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          merchant,
          amount,
          orderId: orderId.toString(),
          callbackUrl,
          linkToPay,
        }),
      },
    );

    if (requestPaymentGateWayReq.ok) {
      return await requestPaymentGateWayReq.json();
    } else {
      return undefined;
    }
  }

  async verifyPayment({
    merchant,
    trackId,
  }: {
    merchant: string;
    trackId: number;
  }): Promise<IVerifyPayment | undefined> {
    const verifyPaymentReq = await fetch('https://gateway.zibal.ir/v1/verify', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        merchant,
        trackId,
      }),
    });

    if (verifyPaymentReq.ok) {
      return await verifyPaymentReq.json();
    } else {
      return undefined;
    }
  }
}

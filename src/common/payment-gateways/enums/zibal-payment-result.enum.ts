export enum ZibalPaymentResultEnum {
    "success" = 100,
    "can not found merchant" = 102,
    "merchant is disabled" = 103,
    "unknown merchant" = 104,
    "previously completed" = 201,
    "either the order isn't paid or was canceled" = 202,
    "incorrect trackId" = 203
}
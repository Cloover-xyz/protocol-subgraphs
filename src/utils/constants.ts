import { BigInt } from '@graphprotocol/graph-ts';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const ETH_PRECISION = BigInt.fromI32(10).pow(18).toBigDecimal();
export const USD_PRECISION = BigInt.fromI32(10).pow(6).toBigDecimal();

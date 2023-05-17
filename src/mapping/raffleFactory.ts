import { Address, BigInt } from '@graphprotocol/graph-ts';

import { NewRaffle } from '../../generated/RaffleFactory/RaffleFactory';
import { getOrInitRaffleFactory, initRaffle } from '../helpers/initializers';
import { Raffle } from '../../generated/templates';

export function handeNewRaffle(event: NewRaffle): void {
  let factory = getOrInitRaffleFactory(event.address);
  factory.raffleCount = factory.raffleCount.plus(BigInt.fromI32(1));
  factory.save();

  initRaffle(event.address, event.params.raffleContract, event.params.raffleParams);
  Raffle.create(event.params.raffleContract);
}

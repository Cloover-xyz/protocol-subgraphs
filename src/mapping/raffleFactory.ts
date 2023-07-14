import { BigInt } from '@graphprotocol/graph-ts';

import { getOrInitRaffleFactory, initRaffle } from '../helpers/initializers';
import { Raffle } from '../../generated/templates';
import { NewRaffle } from '../../generated/RaffleFactory/RaffleFactoryEvents';

export function handleNewRaffle(event: NewRaffle): void {
    let factory = getOrInitRaffleFactory(event.address);
    factory.raffleCount = factory.raffleCount.plus(BigInt.fromI32(1));
    factory.save();
    initRaffle(
        event.address,
        event.params.raffleContract,
        event.params.raffleParams,
        event.block.timestamp
    );
    Raffle.create(event.params.raffleContract);
}

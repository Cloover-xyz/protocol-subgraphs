import { Address, ethereum } from '@graphprotocol/graph-ts';

import { handleNewRaffle } from '../../../src/mapping/raffleFactory';

import { createMockedFunction, newMockEvent } from 'matchstick-as';

import { RAFFLE_FACTORY_ADDRESS } from '../constants';
import { NewRaffle } from '../../../generated/RaffleFactory/RaffleFactoryEvents';
import { RaffleConfig } from '../raffleConfig';

export function handleNewRaffles(events: NewRaffle[]): void {
    events.forEach((event) => {
        handleNewRaffle(event);
    });
}

export function createNewRaffleEvent(raffle: RaffleConfig): NewRaffle {
    let newEvent = changetype<NewRaffle>(newMockEvent());

    newEvent.parameters = new Array();
    let raffleContractParam = new ethereum.EventParam(
        'raffleContract',
        ethereum.Value.fromAddress(Address.fromString(raffle.address))
    );
    const tupleArray: Array<ethereum.Value> = [];
    tupleArray.push(ethereum.Value.fromAddress(Address.fromString(raffle.creator)));
    tupleArray.push(ethereum.Value.fromAddress(Address.fromString(raffle.implementationManager)));
    tupleArray.push(ethereum.Value.fromAddress(Address.fromString(raffle.token)));
    tupleArray.push(ethereum.Value.fromAddress(Address.fromString(raffle.nftContract)));
    tupleArray.push(ethereum.Value.fromUnsignedBigInt(raffle.nftId));
    tupleArray.push(ethereum.Value.fromUnsignedBigInt(raffle.ticketPrice));
    tupleArray.push(ethereum.Value.fromUnsignedBigInt(raffle.endTicketSales));
    tupleArray.push(ethereum.Value.fromI32(raffle.maxTicketSupply));
    tupleArray.push(ethereum.Value.fromI32(raffle.maxTicketPerWallet));
    tupleArray.push(ethereum.Value.fromI32(raffle.minTicketThreshold));
    tupleArray.push(ethereum.Value.fromI32(raffle.protocolFeeRate));
    tupleArray.push(ethereum.Value.fromI32(raffle.insuranceRate));
    tupleArray.push(ethereum.Value.fromI32(raffle.royaltiesRate));
    tupleArray.push(ethereum.Value.fromBoolean(raffle.isEthRaffle));
    const tuple = changetype<ethereum.Tuple>(tupleArray);
    let raffleParams = new ethereum.EventParam('raffleParams', ethereum.Value.fromTuple(tuple));

    newEvent.parameters.push(raffleContractParam);
    newEvent.parameters.push(raffleParams);

    newEvent.address = Address.fromString(RAFFLE_FACTORY_ADDRESS);
    return newEvent;
}

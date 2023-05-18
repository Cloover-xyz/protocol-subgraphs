import { Address, ethereum } from '@graphprotocol/graph-ts';

import { handleTicketsPurchased } from '../../../src/mapping/raffle';

import { newMockEvent } from 'matchstick-as';

import {
    TicketsPurchased,
    WinnerClaimed,
    WinningTicketDrawn,
} from '../../../generated/RaffleFactory/RaffleEvents';

export function handeTicketsPurchases(events: TicketsPurchased[]): void {
    events.forEach((event) => {
        handleTicketsPurchased(event);
    });
}

export function createTicketsPurchasedEvent(
    raffleAddress: string,
    participantAddress: string,
    firstTicketnumber: i32,
    nbOfTicketsPurchased: i32
): TicketsPurchased {
    const newEvent = changetype<TicketsPurchased>(newMockEvent());
    newEvent.parameters = new Array();
    const userParam = new ethereum.EventParam(
        'user',
        ethereum.Value.fromAddress(Address.fromString(participantAddress))
    );
    const firstTicketnumberParam = new ethereum.EventParam(
        'firstTicketnumber',
        ethereum.Value.fromI32(firstTicketnumber)
    );
    const nbOfTicketsPurchasedParam = new ethereum.EventParam(
        'nbOfTicketsPurchased',
        ethereum.Value.fromI32(nbOfTicketsPurchased)
    );
    newEvent.parameters.push(userParam);
    newEvent.parameters.push(firstTicketnumberParam);
    newEvent.parameters.push(nbOfTicketsPurchasedParam);

    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function createWinningTicketDrawnEvent(
    raffleAddress: string,
    winningTicket: i32
): WinningTicketDrawn {
    const newEvent = changetype<WinningTicketDrawn>(newMockEvent());
    newEvent.parameters = new Array();
    const winningTicketParam = new ethereum.EventParam(
        'winningTicket',
        ethereum.Value.fromI32(winningTicket)
    );
    newEvent.parameters.push(winningTicketParam);

    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function createWinnerClaimedEvent(
    raffleAddress: string,
    winnerAddress: string
): WinnerClaimed {
    const newEvent = changetype<WinnerClaimed>(newMockEvent());
    newEvent.parameters = new Array();
    const winnerParam = new ethereum.EventParam(
        'winner',
        ethereum.Value.fromAddress(Address.fromString(winnerAddress))
    );
    newEvent.parameters.push(winnerParam);
    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

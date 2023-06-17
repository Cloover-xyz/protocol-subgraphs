import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';

import { handleTicketsPurchased, handleUserClaimedRefund } from '../../../src/mapping/raffle';

import { newMockEvent } from 'matchstick-as';

import {
    CreatorClaimed,
    CreatorClaimedRefund,
    RaffleCancelled,
    RaffleStatus,
    TicketsPurchased,
    UserClaimedRefund,
    WinnerClaimed,
    WinningTicketDrawn,
} from '../../../generated/RaffleFactory/RaffleEvents';
import { Status } from '../constants';

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

export function createCreatorClaimedEvent(
    raffleAddress: string,
    creatorAmountEarned: BigInt,
    protocolFeeAmount: BigInt,
    royaltiesAmount: BigInt
): CreatorClaimed {
    const newEvent = changetype<CreatorClaimed>(newMockEvent());
    newEvent.parameters = new Array();
    const creatorAmountEarnedParam = new ethereum.EventParam(
        'creatorAmountEarned',
        ethereum.Value.fromUnsignedBigInt(creatorAmountEarned)
    );
    const protocolFeeAmountParam = new ethereum.EventParam(
        'protocolFeeAmount',
        ethereum.Value.fromUnsignedBigInt(protocolFeeAmount)
    );
    const royaltiesAmountParam = new ethereum.EventParam(
        'royaltiesAmount',
        ethereum.Value.fromUnsignedBigInt(royaltiesAmount)
    );
    newEvent.parameters.push(creatorAmountEarnedParam);
    newEvent.parameters.push(protocolFeeAmountParam);
    newEvent.parameters.push(royaltiesAmountParam);
    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function handleUserClaimedRefunds(events: UserClaimedRefund[]): void {
    events.forEach((event) => {
        handleUserClaimedRefund(event);
    });
}

export function createUserClaimedRefundEvent(
    raffleAddress: string,
    userAddress: string,
    amountReceived: BigInt
): UserClaimedRefund {
    const newEvent = changetype<UserClaimedRefund>(newMockEvent());
    newEvent.parameters = new Array();
    const userParam = new ethereum.EventParam(
        'creatorAmountEarned',
        ethereum.Value.fromAddress(Address.fromString(userAddress))
    );
    const amountReceivedParam = new ethereum.EventParam(
        'amountReceived',
        ethereum.Value.fromUnsignedBigInt(amountReceived)
    );

    newEvent.parameters.push(userParam);
    newEvent.parameters.push(amountReceivedParam);
    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function createCreatorClaimedRefundEvent(raffleAddress: string): CreatorClaimedRefund {
    const newEvent = changetype<CreatorClaimedRefund>(newMockEvent());
    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function createRaffleCancelledEvent(raffleAddress: string): RaffleCancelled {
    const newEvent = changetype<RaffleCancelled>(newMockEvent());
    newEvent.address = Address.fromString(raffleAddress);
    return newEvent;
}

export function createRaffleStatusEvent(raffleAddress: string, status: Status): RaffleStatus {
    const newEvent = changetype<RaffleStatus>(newMockEvent());
    newEvent.parameters = new Array();
    const statusParam = new ethereum.EventParam('status', ethereum.Value.fromI32(status));
    newEvent.parameters.push(statusParam);
    newEvent.address = Address.fromString(raffleAddress);

    return newEvent;
}

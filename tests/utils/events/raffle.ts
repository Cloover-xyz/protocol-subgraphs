import { Address, ethereum } from '@graphprotocol/graph-ts';

import { handleTicketsPurchased } from '../../../src/mapping/raffle';

import { newMockEvent } from 'matchstick-as';

import { TicketsPurchased } from '../../../generated/RaffleFactory/RaffleEvents';

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
  let userParam = new ethereum.EventParam(
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

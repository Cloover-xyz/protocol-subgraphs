import { Address, log } from '@graphprotocol/graph-ts';
import {
    TicketsPurchased,
    WinnerClaimed,
    WinningTicketDrawn,
} from '../../generated/RaffleFactory/RaffleEvents';
import { getOrInitParticipant, getRaffle } from '../helpers/initializers';

export function handleTicketsPurchased(event: TicketsPurchased): void {
    let raffle = getRaffle(event.address);

    raffle.currentSupply = raffle.currentSupply + event.params.nbOfTicketsPurchased;
    let participant = getOrInitParticipant(event.address, event.params.user);
    participant.numberOfTicketsPurchased =
        participant.numberOfTicketsPurchased + event.params.nbOfTicketsPurchased;
    const participantsNumber = participant.numbers;
    for (let i = 0; i < event.params.nbOfTicketsPurchased; i++) {
        participantsNumber.push(event.params.firstTicketnumber + i);
    }
    participant.numbers = participantsNumber;

    participant.save();
    raffle.save();
}

export function handleWinningTicketDrawn(event: WinningTicketDrawn): void {
    let raffle = getRaffle(event.address);
    raffle.winningNumbers = event.params.winningTicket;
    raffle.status = 'DRAWN';
    const participants = raffle.participants;
    for (let i = 0; i < participants.length; i++) {
        const participantAddress = Address.fromString(participants[i].split('-')[1]);
        const participant = getOrInitParticipant(event.address, participantAddress);
        let index = participant.numbers.indexOf(event.params.winningTicket);
        if (index != -1) {
            raffle.winner = participant.user;
            break;
        }
    }
    raffle.save();
}

export function handleWinnerClaimed(event: WinnerClaimed): void {
    let raffle = getRaffle(event.address);
    raffle.winnerClaimed = true;
    raffle.save();
}

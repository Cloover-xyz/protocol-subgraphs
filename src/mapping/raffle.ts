import { Address, log } from '@graphprotocol/graph-ts';
import {
    CreatorClaimed,
    CreatorClaimedInsurance,
    TicketsPurchased,
    UserClaimedRefund,
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
    if (raffle.creatorClaimed) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

export function handleCreatorClaimed(event: CreatorClaimed): void {
    let raffle = getRaffle(event.address);
    raffle.creatorClaimed = true;
    raffle.creatorAmountReceived = event.params.creatorAmountReceived;
    raffle.treasuryAmountReceived = event.params.protocolFeeAmount;
    raffle.royaltiesAmountReceived = event.params.royaltiesAmount;
    if (raffle.winnerClaimed) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

export function handleUserClaimedRefund(event: UserClaimedRefund): void {
    let raffle = getRaffle(event.address);
    raffle.amountOfParticipantsRefunded = raffle.amountOfParticipantsRefunded + 1;
    if (
        raffle.amountOfParticipantsRefunded == raffle.participants.length &&
        raffle.creatorClaimed
    ) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
    let participant = getOrInitParticipant(event.address, event.params.user);
    participant.claimedRefund = true;
    participant.refundAmount = event.params.amountReceived;

    participant.save();
}

export function handleCreatorClaimedInsurance(event: CreatorClaimedInsurance): void {
    let raffle = getRaffle(event.address);
    raffle.creatorClaimed = true;
    if (raffle.amountOfParticipantsRefunded == raffle.participants.length) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

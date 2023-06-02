import { Address, log } from '@graphprotocol/graph-ts';
import {
    CreatorClaimed,
    CreatorClaimedInsurance,
    RaffleCancelled,
    RaffleStatus,
    TicketsPurchased,
    UserClaimedRefund,
    WinnerClaimed,
    WinningTicketDrawn,
} from '../../generated/RaffleFactory/RaffleEvents';
import { getOrInitParticipant, getOrInitUser, getRaffle } from '../helpers/initializers';

export function handleTicketsPurchased(event: TicketsPurchased): void {
    const raffle = getRaffle(event.address);

    raffle.currentSupply = raffle.currentSupply + event.params.nbOfTicketsPurchased;
    const participant = getOrInitParticipant(event.address, event.params.user);
    participant.numberOfTicketsPurchased =
        participant.numberOfTicketsPurchased + event.params.nbOfTicketsPurchased;
    const participantsNumber = participant.numbers;
    for (let i = 0; i < event.params.nbOfTicketsPurchased; i++) {
        participantsNumber.push(event.params.firstTicketnumber + i);
    }
    participant.numbers = participantsNumber;

    const user = getOrInitUser(event.params.user);
    user.ticketsPurchasedCount = user.ticketsPurchasedCount + event.params.nbOfTicketsPurchased;
    user.save();
    participant.save();
    raffle.save();
}

export function handleWinningTicketDrawn(event: WinningTicketDrawn): void {
    const raffle = getRaffle(event.address);
    raffle.winningNumbers = event.params.winningTicket;
    raffle.status = 'DRAWN';
    const participants = raffle.participants;
    for (let i = 0; i < participants.length; i++) {
        const participantAddress = Address.fromString(participants[i].split('-')[1]);
        const participant = getOrInitParticipant(event.address, participantAddress);
        const index = participant.numbers.indexOf(event.params.winningTicket);
        if (index != -1) {
            raffle.winner = participant.user;
            break;
        }
    }
    raffle.save();
}

export function handleWinnerClaimed(event: WinnerClaimed): void {
    const raffle = getRaffle(event.address);
    raffle.winnerClaimed = true;
    if (raffle.creatorClaimed) {
        raffle.status = 'FINISHED';
    }

    const user = getOrInitUser(event.params.winner);
    user.winsCount = user.winsCount + 1;

    user.save();
    raffle.save();
}

export function handleCreatorClaimed(event: CreatorClaimed): void {
    const raffle = getRaffle(event.address);
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
    const raffle = getRaffle(event.address);
    raffle.amountOfParticipantsRefunded = raffle.amountOfParticipantsRefunded + 1;
    if (
        raffle.amountOfParticipantsRefunded == raffle.participants.length &&
        raffle.creatorClaimed
    ) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
    const participant = getOrInitParticipant(event.address, event.params.user);
    participant.claimedRefund = true;
    participant.refundAmount = event.params.amountReceived;

    participant.save();
}

export function handleCreatorClaimedInsurance(event: CreatorClaimedInsurance): void {
    const raffle = getRaffle(event.address);
    raffle.creatorClaimed = true;
    if (raffle.amountOfParticipantsRefunded == raffle.participants.length) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

export function handleRaffleCancelled(event: RaffleCancelled): void {
    const raffle = getRaffle(event.address);
    raffle.status = 'CANCELLED';
    raffle.save();
}

export function handleRaffleStatus(event: RaffleStatus): void {
    const raffle = getRaffle(event.address);
    switch (event.params.status) {
        case 1:
            raffle.status = 'DRAWNING';
            break;
        case 2:
            raffle.status = 'DRAWN';
            break;
        case 3:
            raffle.status = 'INSURANCE';
            break;
        case 4:
            raffle.status = 'CANCELLED';
            break;
        default:
            raffle.status = 'DEFAULT';
            break;
    }
    raffle.save();
}
